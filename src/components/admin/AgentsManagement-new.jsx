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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { PlusCircle, Trash2, Edit, Bot, Zap, TrendingUp, Activity, Upload, Image, Save, Loader2, X } from "lucide-react";

export default function AgentsManagement() {
  const { data, updateAgents } = useAdminData();
  const { agents } = data;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
    setIsSaving(false);
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
        setNewAgent(prev => ({
          ...prev,
          image_url: e.target.result
        }));
      };
      reader.readAsDataURL(file);

      console.log(`🖼️ Imagem carregada: ${file.name}`);
      
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao processar a imagem.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const agentData = {
      ...newAgent,
      capabilities: newAgent.capabilities.split(",").map(c => c.trim()).filter(Boolean),
      icon: newAgent.icon || "🤖",
      color: newAgent.color || "#6366f1",
      prompt: newAgent.prompt || `Você é ${newAgent.name}, um assistente de IA especializado em ${newAgent.type}.`
    };

    try {
      if (editingAgent) {
        await Agent.update(editingAgent.id, agentData);
        console.log(`✅ Agente ${editingAgent.name} atualizado com sucesso`);
      } else {
        await Agent.create(agentData);
        console.log(`✅ Agente ${newAgent.name} criado com sucesso`);
      }
      
      await updateAgents();
      handleCloseForm();
      
    } catch (error) {
      console.error("❌ Erro ao salvar agente:", error);
      alert(`Erro ao salvar agente: ${error.message || error}`);
    } finally {
      setIsSaving(false);
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-400">Total de Agentes</p>
                  <p className="text-xl lg:text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <Bot className="w-6 lg:w-8 h-6 lg:h-8 text-teal-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-400">Agentes Ativos</p>
                  <p className="text-xl lg:text-2xl font-bold text-white">{stats.active}</p>
                </div>
                <Activity className="w-6 lg:w-8 h-6 lg:h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-400">Usos Totais</p>
                  <p className="text-xl lg:text-2xl font-bold text-white">{stats.totalUsage}</p>
                </div>
                <TrendingUp className="w-6 lg:w-8 h-6 lg:h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-400">Categorias</p>
                  <p className="text-xl lg:text-2xl font-bold text-white">{stats.categories}</p>
                </div>
                <Zap className="w-6 lg:w-8 h-6 lg:h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Tabela de Agentes */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bot className="w-5 h-5 text-teal-400" />
            Agentes Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Agente</TableHead>
                  <TableHead className="text-gray-300">Tipo</TableHead>
                  <TableHead className="text-gray-300 hidden lg:table-cell">Capacidades</TableHead>
                  <TableHead className="text-gray-300 hidden md:table-cell">Plano</TableHead>
                  <TableHead className="text-gray-300 hidden lg:table-cell">Uso</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents?.map((agent) => (
                  <TableRow key={agent.id} className="border-gray-700 hover:bg-gray-700/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
                          style={{ backgroundColor: agent.color || '#6366f1' }}
                        >
                          {agent.icon || '🤖'}
                        </div>
                        <div>
                          <p className="font-medium text-white">{agent.name}</p>
                          <p className="text-sm text-gray-400 max-w-[200px] truncate">{agent.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-gray-500 text-gray-300 capitalize">
                        {agent.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
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
                    <TableCell className="hidden md:table-cell">
                      <Badge className={
                        agent.plan_required === 'free' ? 'bg-green-500' :
                        agent.plan_required === 'premium' ? 'bg-blue-500' : 'bg-purple-500'
                      }>
                        {agent.plan_required}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300 hidden lg:table-cell">
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
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenForm(agent)}
                          className="hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4 text-yellow-400" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(agent.id)}
                          className="hover:bg-gray-700"
                        >
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

      {/* Modal de Formulário */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {editingAgent ? 'Editar Agente' : 'Criar Novo Agente'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
            {/* Coluna Esquerda - Dados Básicos */}
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Nome do Agente</Label>
                <Input 
                  placeholder="Nome do agente..." 
                  value={newAgent.name} 
                  onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Tipo</Label>
                <Select value={newAgent.type} onValueChange={(value) => setNewAgent({...newAgent, type: value})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="work">Trabalho</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="creative">Criativo</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="vision">Visão</SelectItem>
                    <SelectItem value="communication">Comunicação</SelectItem>
                    <SelectItem value="security">Segurança</SelectItem>
                    <SelectItem value="development">Desenvolvimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300">Plano Necessário</Label>
                <Select value={newAgent.plan_required} onValueChange={(value) => setNewAgent({...newAgent, plan_required: value})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="free">Gratuito</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Ícone</Label>
                  <Input 
                    placeholder="🤖" 
                    value={newAgent.icon} 
                    onChange={(e) => setNewAgent({...newAgent, icon: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white text-center text-xl"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Cor</Label>
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

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newAgent.is_active}
                  onCheckedChange={(checked) => setNewAgent({...newAgent, is_active: checked})}
                />
                <Label className="text-gray-300">Agente Ativo</Label>
              </div>
            </div>

            {/* Coluna Direita - Descrição e Imagem */}
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Upload de Imagem</Label>
                <div className="space-y-4">
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
                      className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-8 rounded-lg cursor-pointer border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>Processando...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6" />
                          <span>Clique para escolher imagem</span>
                        </>
                      )}
                    </Label>
                  </div>
                  
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border-2 border-gray-600"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setImagePreview(null);
                          setNewAgent(prev => ({ ...prev, image_url: "" }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  <Input 
                    placeholder="/assets/images/agents/agent.png" 
                    value={newAgent.image_url} 
                    onChange={(e) => setNewAgent({...newAgent, image_url: e.target.value})}
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
                  className="bg-gray-700 border-gray-600 text-white min-h-[100px] resize-vertical"
                />
              </div>

              <div>
                <Label className="text-gray-300">Capacidades (separadas por vírgula)</Label>
                <Input 
                  placeholder="análise, relatórios, automação" 
                  value={newAgent.capabilities} 
                  onChange={(e) => setNewAgent({...newAgent, capabilities: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            {/* Prompt do Sistema - Largura Total */}
            <div className="lg:col-span-2">
              <Label className="text-gray-300">Prompt do Sistema</Label>
              <Textarea 
                placeholder="Você é um assistente de IA especializado em..." 
                value={newAgent.prompt} 
                onChange={(e) => setNewAgent({...newAgent, prompt: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white min-h-[100px] resize-vertical"
              />
            </div>
          </div>

          <DialogFooter className="gap-4">
            <Button 
              variant="outline" 
              onClick={handleCloseForm}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingAgent ? 'Atualizar' : 'Criar'} Agente
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
