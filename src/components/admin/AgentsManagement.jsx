import React, { useState } from "react";
import { Agent } from "@/api/entities";
import { useAdminData } from "../AdminDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { PlusCircle, Trash2, Edit, Bot, Zap, TrendingUp, Activity } from "lucide-react";

export default function AgentsManagement() {
  const { data, updateAgents } = useAdminData();
  const { agents } = data;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [newAgent, setNewAgent] = useState({
    name: "",
    type: "work",
    description: "",
    capabilities: "",
    plan_required: "free",
    is_active: true,
    icon: "Bot"
  });

  const handleOpenForm = (agent = null) => {
    if (agent) {
      setEditingAgent(agent);
      setNewAgent({
        ...agent,
        capabilities: agent.capabilities ? agent.capabilities.join(", ") : ""
      });
    } else {
      setEditingAgent(null);
      setNewAgent({
        name: "",
        type: "work",
        description: "",
        capabilities: "",
        plan_required: "free",
        is_active: true,
        icon: "Bot"
      });
    }
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAgent(null);
  };

  const handleSave = async () => {
    const agentData = {
      ...newAgent,
      capabilities: newAgent.capabilities.split(",").map(c => c.trim()).filter(Boolean)
    };

    try {
      if (editingAgent) {
        await Agent.update(editingAgent.id, agentData);
      } else {
        await Agent.create(agentData);
      }
      await updateAgents();
      handleCloseForm();
    } catch (e) {
      console.error("Erro ao salvar agente", e);
      alert("Erro ao salvar agente.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este agente?")) {
      try {
        await Agent.delete(id);
        await updateAgents();
      } catch (e) {
        console.error("Erro ao deletar agente", e);
        alert("Erro ao deletar agente.");
      }
    }
  };

  const handleToggleActive = async (agent) => {
    try {
      await Agent.update(agent.id, { is_active: !agent.is_active });
      await updateAgents();
    } catch (e) {
      console.error("Erro ao alterar status do agente", e);
      alert("Erro ao alterar status do agente.");
    }
  };

  // Estatísticas dos agentes
  const stats = {
    total: agents?.length || 0,
    active: agents?.filter(a => a.is_active).length || 0,
    totalUsage: agents?.reduce((sum, a) => sum + (a.usage_count || 0), 0) || 0,
    categories: [...new Set(agents?.map(a => a.type) || [])].length
  };
  
  return (
    <div className="space-y-6">
      {/* Header com Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Gerenciamento de Agentes</h1>
            <p className="text-gray-400">Configure e monitore todos os agentes IA da plataforma</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total de Agentes</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <Bot className="w-8 h-8 text-teal-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Agentes Ativos</p>
                  <p className="text-2xl font-bold text-white">{stats.active}</p>
                </div>
                <Activity className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total de Uso</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsage}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Categorias</p>
                  <p className="text-2xl font-bold text-white">{stats.categories}</p>
                </div>
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Lista de Agentes</h2>
        <Button onClick={() => handleOpenForm()} className="bg-teal-600 hover:bg-teal-700">
          <PlusCircle className="w-4 h-4 mr-2" />
          Novo Agente
        </Button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 p-6 rounded-lg space-y-4 border border-gray-700"
        >
          <h3 className="text-lg font-semibold text-white">{editingAgent ? "Editar Agente" : "Criar Novo Agente"}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Nome do Agente</Label>
              <Input 
                placeholder="Ex: Agente Financeiro" 
                value={newAgent.name} 
                onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label className="text-gray-300">Categoria</Label>
              <Select value={newAgent.type} onValueChange={(value) => setNewAgent({...newAgent, type: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white">
                  <SelectItem value="health">Saúde</SelectItem>
                  <SelectItem value="finance">Financeiro</SelectItem>
                  <SelectItem value="home">Casa</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="work">Trabalho</SelectItem>
                  <SelectItem value="entertainment">Entretenimento</SelectItem>
                  <SelectItem value="travel">Viagem</SelectItem>
                  <SelectItem value="education">Educação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-300">Plano Necessário</Label>
              <Select value={newAgent.plan_required} onValueChange={(value) => setNewAgent({...newAgent, plan_required: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Plano necessário" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white">
                  <SelectItem value="free">Gratuito</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-300">Ícone</Label>
              <Input 
                placeholder="Bot" 
                value={newAgent.icon} 
                onChange={(e) => setNewAgent({...newAgent, icon: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Descrição</Label>
            <Textarea 
              placeholder="Descreva as funções do agente..." 
              value={newAgent.description} 
              onChange={(e) => setNewAgent({...newAgent, description: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white h-24"
            />
          </div>

          <div>
            <Label className="text-gray-300">Capacidades (separadas por vírgula)</Label>
            <Input 
              placeholder="análise financeira, relatórios, previsões" 
              value={newAgent.capabilities} 
              onChange={(e) => setNewAgent({...newAgent, capabilities: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={newAgent.is_active}
              onCheckedChange={(checked) => setNewAgent({...newAgent, is_active: checked})}
            />
            <Label className="text-gray-300">Agente Ativo</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              {editingAgent ? 'Atualizar' : 'Criar'} Agente
            </Button>
            <Button variant="outline" onClick={handleCloseForm} className="border-gray-600 text-white hover:bg-gray-700">
              Cancelar
            </Button>
          </div>
        </motion.div>
      )}

      {/* Agents Table */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white">Agentes Cadastrados ({agents?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-white">Agente</TableHead>
                  <TableHead className="text-white">Categoria</TableHead>
                  <TableHead className="text-white">Capacidades</TableHead>
                  <TableHead className="text-white">Plano</TableHead>
                  <TableHead className="text-white">Uso</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(agents || []).map(agent => (
                  <TableRow key={agent.id} className="border-gray-700 hover:bg-gray-700/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{agent.name}</p>
                          <p className="text-sm text-gray-400">{agent.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-gray-500 text-gray-300 capitalize">
                        {agent.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {agent.capabilities?.slice(0, 2).map((cap, idx) => (
                          <Badge key={idx} className="bg-blue-500/20 text-blue-300 text-xs">
                            {cap}
                          </Badge>
                        ))}
                        {agent.capabilities?.length > 2 && (
                          <Badge variant="outline" className="text-xs border-gray-500 text-gray-400">
                            +{agent.capabilities.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        agent.plan_required === 'free' ? 'bg-green-500' :
                        agent.plan_required === 'premium' ? 'bg-blue-500' : 'bg-purple-500'
                      }>
                        {agent.plan_required}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {agent.usage_count || 0}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={agent.is_active}
                        onCheckedChange={() => handleToggleActive(agent)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenForm(agent)}>
                          <Edit className="w-4 h-4 text-yellow-400" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(agent.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}