import React, { useState } from "react";
import { User, Plan } from "@/api/entities"; // Mantenha isso para criar novos usuários, etc.
import { useAdminData } from "../AdminDataContext";
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
import { UserPlus, Shield, User as UserIcon, Trash2 } from "lucide-react";

export default function UserManagementView() {
  const { data, isLoading, error, updateUsers, updatePlans } = useAdminData();
  const { users, plans } = data;
  
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
      updateUsers(); // Atualiza os dados no contexto
    } catch (e) {
      console.error("Erro ao adicionar usuário", e);
      alert("Erro ao adicionar usuário.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Tem certeza que deseja deletar este usuário? Esta ação é irreversível.")) {
      try {
        await User.delete(userId);
        updateUsers(); // Atualiza os dados no contexto
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
        <Button onClick={() => setIsAdding(!isAdding)}>
          <UserPlus className="w-4 h-4 mr-2" />
          {isAdding ? "Cancelar" : "Adicionar Usuário"}
        </Button>
      </div>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 p-4 rounded-lg space-y-4"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input 
              placeholder="Nome Completo" 
              value={newUser.full_name} 
              onChange={(e) => setNewUser({...newUser, full_name: e.target.value})} 
            />
            <Input 
              type="email" 
              placeholder="Email" 
              value={newUser.email} 
              onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
            />
            <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
              <SelectTrigger><SelectValue placeholder="Cargo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Usuário</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={newUser.plan_id} onValueChange={(value) => setNewUser({...newUser, plan_id: value})}>
              <SelectTrigger><SelectValue placeholder="Plano" /></SelectTrigger>
              <SelectContent>
                {plans.map(plan => (
                  <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddUser}>Salvar Usuário</Button>
        </motion.div>
      )}

      <Input
        placeholder="Buscar por nome ou email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-gray-800/50 border-gray-700"
      />

      <div className="bg-gray-800/50 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b-gray-700">
              <TableHead className="text-white">Usuário</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Plano</TableHead>
              <TableHead className="text-white">Cargo</TableHead>
              <TableHead className="text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => {
              const userPlan = plans.find(p => p.id === user.plan_id);
              return (
                <TableRow key={user.id} className="border-b-gray-800">
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-cyan-300 border-cyan-300/50">
                      {userPlan ? userPlan.name : "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={user.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'}>
                      {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1"/> : <UserIcon className="w-3 h-3 mr-1"/>}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
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
  );
}