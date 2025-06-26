import { useState } from "react";
import { User } from "@/api/entities";
import { useSync } from "@/contexts/SyncContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { UserPlus, Shield, User as UserIcon, Trash2, Users as UsersIcon } from "lucide-react";

export default function UserManagementView() {
  const { globalData, syncModule } = useSync();
  const { users, plans } = globalData;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({ full_name: "", email: "", role: "user", plan_id: "" });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.full_name || !newUser.plan_id) {
      alert("Preencha todos os campos para adicionar um novo usuário.");
      return;
    }
    try {
      await User.create(newUser);
      setNewUser({ full_name: "", email: "", role: "user", plan_id: "" });
      setIsAdding(false);
      await syncModule('users'); // Sincroniza os usuários usando SyncContext
    } catch (e) {
      console.error("Erro ao adicionar usuário", e);
      alert("Erro ao adicionar usuário.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Tem certeza que deseja deletar este usuário? Esta ação é irreversível.")) {
      try {
        await User.delete(userId);
        await syncModule('users'); // Sincroniza os usuários usando SyncContext
      } catch (e) {
        console.error("Erro ao deletar usuário", e);
        alert("Erro ao deletar usuário.");
      }
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-full-width space-y-6 w-full max-w-none overflow-hidden">
      {/* Header Responsivo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <UsersIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-100">Gerenciamento de Usuários</h1>
            <p className="text-gray-400 text-sm lg:text-base">Gerencie usuários, permissões e planos da plataforma</p>
          </div>
        </div>
        <div className="lg:ml-auto">
          <Button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            {isAdding ? "Cancelar" : "Adicionar Usuário"}
          </Button>
        </div>
      </motion.div>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-lg space-y-4"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Adicionar Novo Usuário</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input 
              placeholder="Nome Completo" 
              value={newUser.full_name} 
              onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
            <Input 
              type="email" 
              placeholder="Email" 
              value={newUser.email} 
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
            <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Cargo" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="user">Usuário</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={newUser.plan_id} onValueChange={(value) => setNewUser({...newUser, plan_id: value})}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Plano" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {plans.map(plan => (
                  <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={handleAddUser}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            >
              Salvar Usuário
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsAdding(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
          </div>
        </motion.div>
      )}

      {/* Campo de Busca */}
      <div className="w-full max-w-md">
        <Input
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
        />
      </div>

      {/* Tabela Responsiva */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-700">
                <TableHead className="text-gray-300">Usuário</TableHead>
                <TableHead className="text-gray-300 hidden md:table-cell">Email</TableHead>
                <TableHead className="text-gray-300">Plano</TableHead>
                <TableHead className="text-gray-300 hidden lg:table-cell">Cargo</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => {
                const userPlan = plans.find(p => p.id === user.plan_id);
                return (
                  <TableRow key={user.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.full_name}</p>
                          <p className="text-sm text-gray-400 md:hidden">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 hidden md:table-cell">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-cyan-300 border-cyan-300/50">
                        {userPlan ? userPlan.name : "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge className={user.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'}>
                        {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1"/> : <UserIcon className="w-3 h-3 mr-1"/>}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteUser(user.id)}
                        className="hover:bg-gray-700"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}