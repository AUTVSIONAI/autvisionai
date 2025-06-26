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
import { PlusCircle, Trash2, Edit, Bot, Zap, TrendingUp, Activity, Upload, Image, Save, Loader2 } from "lucide-react";

export default function AgentsManagement() {
  const { data, updateAgents } = useAdminData();
  const { agents } = data;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: "",
    type: "work",
    description: "",
    capabilities: "",
    plan_required: "free",
    is_active: true,
    icon: "🤖",
    image_url: "",
    color: "#6366f1",
    prompt: ""
  });

  const handleOpenForm = (agent = null) => {
    if (agent) {
      setEditingAgent(agent);
      setNewAgent({
        ...agent,
        capabilities: agent.capabilities ? agent.capabilities.join(", ") : "",
        image_url: agent.image_url || agent.image || "",
        color: agent.color || "#6366f1",
        prompt: agent.prompt || ""
      });
      setImagePreview(agent.image_url || agent.image || null);
    } else {
      setEditingAgent(null);
      setNewAgent({
        name: "",
        type: "work",
        description: "",
        capabilities: "",
        plan_required: "free",
        is_active: true,
        icon: "🤖",
        image_url: "",
        color: "#6366f1",
        prompt: ""
      });
      setImagePreview(null);
    }
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAgent(null);
    setImagePreview(null);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    setIsUploading(true);
    
    try {
      // Preview local
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Simular upload para assets locais (por enquanto)
      // TODO: Implementar upload real para Supabase Storage
      const fileName = `agent_${Date.now()}_${file.name}`;
      const imagePath = `/assets/images/agents/${fileName}`;
      
      setNewAgent(prev => ({
        ...prev,
        image_url: imagePath
      }));

      console.log(`🖼️ Imagem simulada: ${imagePath}`);
      
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    const agentData = {
      ...newAgent,
      capabilities: newAgent.capabilities.split(",").map(c => c.trim()).filter(Boolean),
      // Garantir que image_url seja enviado
      image_url: newAgent.image_url || imagePreview,
      // Garantir campos necessários para o backend
      icon: newAgent.icon || "🤖",
      color: newAgent.color || "#6366f1",
      prompt: newAgent.prompt || `Você é ${newAgent.name}, um assistente de IA especializado em ${newAgent.type}.`
    };

    try {
      if (editingAgent) {
        // UPDATE: usar a rota PUT /agents/:id do backend
        await Agent.update(editingAgent.id, agentData);
        console.log(`✅ Agente ${editingAgent.name} atualizado com sucesso`);
      } else {
        // CREATE: usar a rota POST /agents do backend
        await Agent.create(agentData);
        console.log(`✅ Agente ${newAgent.name} criado com sucesso`);
      }
      
      // Recarregar dados do backend
      await updateAgents();
      handleCloseForm();
      
    } catch (error) {
      console.error("❌ Erro ao salvar agente:", error);
      alert(`Erro ao salvar agente: ${error.message || error}`);
    }
  };

  const handleUploadImageToAgent = async (agentId) => {
    try {
      // Usar rota POST /agents/:id/upload-image do backend
      const response = await fetch(`/api/agents/${agentId}/upload-image`, {
        method: 'POST',
        headers: {
          'X-API-Key': 'autvision_backend_secure_key_2025',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_url: newAgent.image_url
        })
      });
      
      if (response.ok) {
        console.log(`🖼️ Imagem do agente ${agentId} atualizada via backend`);
        await updateAgents();
      }
    } catch (error) {
      console.error('Erro ao atualizar imagem via backend:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este agente?")) {
      try {
        await Agent.delete(id);
        await updateAgents();
        console.log(`🗑️ Agente ${id} deletado com sucesso`);
      } catch (error) {
        console.error("❌ Erro ao deletar agente:", error);
        alert("Erro ao deletar agente.");
      }
    }
  };

  const handleToggleActive = async (agent) => {
    try {
      await Agent.update(agent.id, { is_active: !agent.is_active });
      await updateAgents();
      console.log(`🔄 Status do agente ${agent.name} alterado para ${!agent.is_active ? 'ativo' : 'inativo'}`);
    } catch (error) {
      console.error("❌ Erro ao alterar status do agente:", error);
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
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header com Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-100">Gerenciamento de Agentes</h1>
              <p className="text-gray-400 text-sm lg:text-base">Configure e monitore todos os agentes IA da plataforma</p>
            </div>
          </div>
          <div className="lg:ml-auto">
            <Button 
              onClick={() => handleOpenForm()}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Adicionar Agente
            </Button>
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
                placeholder="🤖" 
                value={newAgent.icon} 
                onChange={(e) => setNewAgent({...newAgent, icon: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label className="text-gray-300">Cor do Agente</Label>
              <div className="flex gap-2">
                <Input 
                  type="color"
                  value={newAgent.color} 
                  onChange={(e) => setNewAgent({...newAgent, color: e.target.value})}
                  className="bg-gray-700 border-gray-600 w-16 h-10"
                />
                <Input 
                  placeholder="#6366f1" 
                  value={newAgent.color} 
                  onChange={(e) => setNewAgent({...newAgent, color: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white flex-1"
                />
              </div>
            </div>
          </div>

          {/* Upload de Imagem */}
          <div>
            <Label className="text-gray-300">Imagem do Agente</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="agent-image-upload"
                />
                <Label
                  htmlFor="agent-image-upload"
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer border border-gray-600 transition-colors"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  {isUploading ? 'Enviando...' : 'Escolher Imagem'}
                </Label>
              </div>
              
              {imagePreview && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {newAgent.image_url && (
                <Input 
                  placeholder="/assets/images/agents/agent.png" 
                  value={newAgent.image_url} 
                  onChange={(e) => setNewAgent({...newAgent, image_url: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white flex-1"
                />
          {/* Upload de Imagem */}
          <div>
            <Label className="text-gray-300">Imagem do Agente</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="agent-image-upload"
                />
                <Label
                  htmlFor="agent-image-upload"
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer border border-gray-600 transition-colors"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  {isUploading ? 'Enviando...' : 'Escolher Imagem'}
                </Label>
              </div>
              
              {imagePreview && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {newAgent.image_url && (
                <Input 
                  placeholder="/assets/images/agents/agent.png" 
                  value={newAgent.image_url} 
                  onChange={(e) => setNewAgent({...newAgent, image_url: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white flex-1"
                />
              )}
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Prompt do Sistema</Label>
            <Textarea 
              placeholder="Você é um assistente de IA especializado em..." 
              value={newAgent.prompt} 
              onChange={(e) => setNewAgent({...newAgent, prompt: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white h-20"
            />
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

          {/* Preview da Imagem */}
          {imagePreview && (
            <div>
              <Label className="text-gray-300">Prévia da Imagem</Label>
              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                <Image src={imagePreview} alt="Prévia da Imagem" layout="fill" objectFit="cover" className="rounded-lg" />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setImagePreview(null)} 
                  className="absolute top-2 right-2 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              {editingAgent ? 'Atualizar' : 'Criar'} Agente
            </Button>
            <Button variant="outline" onClick={handleCloseForm} className="border-gray-600 text-white hover:bg-gray-700">
              Cancelar
            </Button>
          </div>

          {/* Upload de Imagem */}
          <div>
            <Label className="text-gray-300">Imagem do Agente</Label>
            <div className="flex items-center gap-2">
              <Button 
                as="label" 
                htmlFor="image-upload" 
                className="bg-teal-600 hover:bg-teal-700"
                disabled={isUploading}
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                {newAgent.image_url ? 'Trocar Imagem' : 'Fazer Upload da Imagem'}
              </Button>
              <input 
                id="image-upload"
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {newAgent.image_url && (
                <Button 
                  variant="outline" 
                  onClick={() => handleUploadImageToAgent(editingAgent?.id)} 
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Imagem
                </Button>
              )}
            </div>
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