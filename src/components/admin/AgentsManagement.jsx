import { useState, useEffect } from "react";
import { Agent } from "@/api/entities";
import { useSync } from "@/contexts/SyncContext";
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
import { PlusCircle, Trash2, Edit, Bot, Zap, TrendingUp, Activity, Upload, Save, Loader2, X, FileText, BarChart3, Eye } from "lucide-react";

export default function AgentsManagement() {
  const { globalData, syncModule } = useSync();
  const { agents } = globalData;

  // Carregar agentes quando o componente for montado
  useEffect(() => {
    const loadAgents = async () => {
      try {
        console.log('🔄 Carregando agentes...');
        await syncModule('agents');
        console.log('✅ Agentes carregados:', globalData.agents?.length || 0);
      } catch (error) {
        console.error('❌ Erro ao carregar agentes:', error);
      }
    };
    
    loadAgents();
  }, [syncModule]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    type: 'work',
    capabilities: '',
    icon: '🤖',
    color: '#6366f1',
    prompt: '',
    plan_required: 'free',
    is_active: true,
    image_url: '',
    _imageFile: null
  });

  // Lista de imagens disponíveis na pasta assets
  const availableImages = [
    '/assets/images/agents/agent-ADA.jpeg',
    '/assets/images/agents/agent-Ads.jpeg',
    '/assets/images/agents/agent-Auto.jpeg',
    '/assets/images/agents/agent-Echo.jpeg',
    '/assets/images/agents/agent-Friend.jpeg',
    '/assets/images/agents/agent-Guardian.jpeg',
    '/assets/images/agents/agent-Nova.jpeg',
    '/assets/images/agents/agent-Social.jpeg',
    '/assets/images/agents/agent-echo.png',
    '/assets/images/agents/agent-guardian.png',
    '/assets/images/agents/agent-nova.png',
    '/assets/images/agents/agent-vision.png'
  ];

  const handleOpenForm = (agent = null) => {
    if (agent) {
      setEditingAgent(agent);
      setNewAgent({
        name: agent.name || '',
        description: agent.description || '',
        type: agent.type || 'work',
        capabilities: Array.isArray(agent.capabilities) ? agent.capabilities.join(', ') : '',
        icon: agent.icon || '🤖',
        color: agent.color || '#6366f1',
        prompt: agent.prompt || '',
        plan_required: agent.plan_required || 'free',
        is_active: agent.is_active ?? true,
        image_url: agent.image_url || '',
        _imageFile: null
      });
      setImagePreview(agent.image_url || null);
    } else {
      setEditingAgent(null);
      setNewAgent({
        name: '',
        description: '',
        type: 'work',
        capabilities: '',
        icon: '🤖',
        color: '#6366f1',
        prompt: '',
        plan_required: 'free',
        is_active: true,
        image_url: '',
        _imageFile: null
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
    // Reset do input file
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
    // Reset do estado do formulário
    setNewAgent({
      name: '',
      description: '',
      type: 'work',
      capabilities: '',
      icon: '🤖',
      color: '#6366f1',
      prompt: '',
      plan_required: 'free',
      is_active: true,
      image_url: '',
      _imageFile: null
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    try {
      // Criar preview local
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setImagePreview(imageDataUrl);
        setNewAgent(prev => ({
          ...prev,
          image_url: imageDataUrl,
          _imageFile: file
        }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      alert('Erro ao processar a imagem. Tente novamente.');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Validar campos obrigatórios
    if (!newAgent.name?.trim()) {
      alert('Nome do agente é obrigatório');
      setIsSaving(false);
      return;
    }
    
    if (!newAgent.type?.trim()) {
      alert('Tipo do agente é obrigatório');
      setIsSaving(false);
      return;
    }
    
    // Preparar dados do agente (remover campos internos e otimizar)
    const { _imageFile, ...agentData } = {
      ...newAgent,
      capabilities: typeof newAgent.capabilities === 'string' ? 
        newAgent.capabilities.split(",").map(c => c.trim()).filter(Boolean) : 
        (Array.isArray(newAgent.capabilities) ? newAgent.capabilities : []),
      icon: newAgent.icon || "🤖",
      color: newAgent.color || "#6366f1",
      prompt: newAgent.prompt || `Você é ${newAgent.name}, um assistente de IA especializado em ${newAgent.type}.`,
      // Para imagens da pasta assets, manter a URL. Para uploads, remover data URL
      image_url: newAgent.image_url?.startsWith('/assets/') ? newAgent.image_url : 
                 (newAgent.image_url?.startsWith('data:') ? '' : newAgent.image_url)
    };
    
    console.log('📤 Dados sendo enviados:', agentData);

    try {
      let savedAgent;
      
      if (editingAgent) {
        // Atualizar agente existente
        savedAgent = await Agent.update(editingAgent.id, agentData);
        console.log(`✅ Agente ${editingAgent.name} atualizado com sucesso`);
        
        // Upload de imagem apenas se houver arquivo de upload (não para imagens da pasta assets)
        if (_imageFile && !newAgent.image_url?.startsWith('/assets/')) {
          try {
            console.log('📤 Fazendo upload da imagem para agente:', editingAgent.id);
            const uploadResponse = await Agent.uploadImage(editingAgent.id, _imageFile);
            console.log('✅ Upload de imagem realizado:', uploadResponse);
          } catch (uploadError) {
            console.error('❌ Erro no upload da imagem:', uploadError);
            console.error('❌ Detalhes do erro:', uploadError.response?.data);
            alert('Agente salvo, mas houve erro no upload da imagem. Tente novamente.');
          }
        }
      } else {
        // Criar novo agente
        savedAgent = await Agent.create(agentData);
        console.log(`✅ Agente ${newAgent.name} criado com sucesso`);
        
        // Upload de imagem apenas se houver arquivo de upload (não para imagens da pasta assets)
        if (_imageFile && savedAgent?.id && !newAgent.image_url?.startsWith('/assets/')) {
          try {
            console.log('📤 Fazendo upload da imagem para novo agente:', savedAgent.id);
            const uploadResponse = await Agent.uploadImage(savedAgent.id, _imageFile);
            console.log('✅ Upload de imagem pós-criação realizado:', uploadResponse);
          } catch (uploadError) {
            console.error('❌ Erro no upload da imagem pós-criação:', uploadError);
            console.error('❌ Detalhes do erro:', uploadError.response?.data);
            alert('Agente criado, mas houve erro no upload da imagem. Você pode editá-lo para adicionar a imagem.');
          }
        }
      }
      
      // 🔄 SINCRONIZAR IMEDIATAMENTE APÓS SALVAR
      await syncModule('agents');
      
      handleCloseForm();
      
    } catch (error) {
      console.error("❌ Erro ao salvar agente:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido';
      alert(`Erro ao salvar agente: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este agente?")) {
      try {
        await Agent.delete(id);
        await syncModule('agents');
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
      await syncModule('agents');
      console.log(`🔄 Status do agente ${agent.name} alterado para ${!agent.is_active ? 'ativo' : 'inativo'}`);
    } catch (error) {
      console.error("❌ Erro ao alterar status do agente:", error);
      alert("Erro ao alterar status do agente.");
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      work: 'bg-blue-500',
      social: 'bg-green-500',
      entertainment: 'bg-purple-500',
      education: 'bg-orange-500',
      health: 'bg-red-500',
      finance: 'bg-yellow-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const getPlanColor = (plan) => {
    const colors = {
      free: 'bg-green-100 text-green-800',
      basic: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-orange-100 text-orange-800'
    };
    return colors[plan] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciamento de Agentes</h1>
          <p className="text-gray-400 mt-2">Configure e gerencie os agentes de IA da plataforma</p>
        </div>
        <Button onClick={() => handleOpenForm()} className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="w-4 h-4 mr-2" />
          Novo Agente
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Agentes</p>
                <p className="text-2xl font-bold text-white">{agents?.length || 0}</p>
              </div>
              <Bot className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Agentes Ativos</p>
                <p className="text-2xl font-bold text-white">{agents?.filter(a => a.is_active).length || 0}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Tipos Únicos</p>
                <p className="text-2xl font-bold text-white">{new Set(agents?.map(a => a.type)).size || 0}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Performance</p>
                <p className="text-2xl font-bold text-white">98%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agents Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Lista de Agentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Agente</TableHead>
                <TableHead className="text-gray-300">Tipo</TableHead>
                <TableHead className="text-gray-300">Plano</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents?.map((agent) => (
                <TableRow key={agent.id} className="border-gray-700">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                        {agent.image_url || agent.image ? (
                          <img 
                            src={agent.image_url || agent.image} 
                            alt={agent.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span className="text-lg" style={{display: agent.image_url || agent.image ? 'none' : 'flex'}}>
                          {agent.icon || agent.emoji || '🤖'}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{agent.name}</p>
                        <p className="text-gray-400 text-sm">{agent.description?.substring(0, 50)}...</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getTypeColor(agent.type)} text-white`}>
                      {agent.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlanColor(agent.plan_required)}>
                      {agent.plan_required}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={agent.is_active} 
                      onCheckedChange={() => handleToggleActive(agent)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleOpenForm(agent)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleDelete(agent.id)}
                        className="border-red-600 text-red-400 hover:bg-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingAgent ? 'Editar Agente' : 'Criar Novo Agente'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna Esquerda */}
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Nome do Agente</Label>
                <Input 
                  placeholder="Ex: Assistente de Vendas" 
                  value={newAgent.name} 
                  onChange={(e) => setNewAgent(prev => ({...prev, name: e.target.value}))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label className="text-gray-300">Tipo</Label>
                <Select value={newAgent.type} onValueChange={(value) => setNewAgent(prev => ({...prev, type: value}))}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="work">Trabalho</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="entertainment">Entretenimento</SelectItem>
                    <SelectItem value="education">Educação</SelectItem>
                    <SelectItem value="health">Saúde</SelectItem>
                    <SelectItem value="finance">Finanças</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-gray-300">Plano Necessário</Label>
                <Select value={newAgent.plan_required} onValueChange={(value) => setNewAgent(prev => ({...prev, plan_required: value}))}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="free">Gratuito</SelectItem>
                    <SelectItem value="basic">Básico</SelectItem>
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
                  onChange={(e) => setNewAgent(prev => ({...prev, icon: e.target.value}))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label className="text-gray-300">Cor</Label>
                <Input 
                  type="color" 
                  value={newAgent.color} 
                  onChange={(e) => setNewAgent(prev => ({...prev, color: e.target.value}))}
                  className="bg-gray-700 border-gray-600 h-10"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={newAgent.is_active} 
                  onCheckedChange={(checked) => setNewAgent(prev => ({...prev, is_active: checked}))}
                />
                <Label className="text-gray-300">Ativo</Label>
              </div>
            </div>
            
            {/* Coluna Direita */}
            <div className="space-y-4">
              {/* Seção de Imagem */}
              <div>
                <Label className="text-gray-300 text-lg font-semibold mb-4 block">Imagem do Agente</Label>
                
                {/* Galeria de imagens disponíveis */}
                <div className="mb-4">
                  <Label className="text-gray-300 text-sm mb-2 block">Escolher da galeria:</Label>
                  <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto border border-gray-600 rounded p-2">
                    {availableImages.map((imagePath, index) => (
                      <div 
                        key={index}
                        className={`cursor-pointer border-2 rounded overflow-hidden ${
                          newAgent.image_url === imagePath ? 'border-blue-500' : 'border-gray-600'
                        } hover:border-blue-400 transition-colors`}
                        onClick={() => {
                          setNewAgent(prev => ({
                            ...prev, 
                            image_url: imagePath,
                            _imageFile: null
                          }));
                          setImagePreview(imagePath);
                        }}
                      >
                        <img 
                          src={imagePath} 
                          alt={`Agent ${index + 1}`}
                          className="w-full h-12 object-cover"
                          onError={(e) => {
                            console.log('Erro ao carregar imagem:', imagePath);
                            e.target.style.opacity = '0.3';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Upload de arquivo */}
                <div className="mb-4">
                  <Label className="text-gray-300 text-sm mb-2 block">Ou fazer upload:</Label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-gray-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Clique para fazer upload</p>
                      <p className="text-gray-500 text-xs">PNG, JPG até 5MB</p>
                    </Label>
                  </div>
                </div>
                
                {/* Preview da imagem selecionada */}
                {(imagePreview || newAgent.image_url) && (
                  <div className="relative">
                    <Label className="text-gray-300 text-sm mb-2 block">Preview:</Label>
                    <img
                      src={imagePreview || newAgent.image_url}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg border-2 border-gray-600"
                      onError={(e) => {
                        console.log('Erro ao carregar imagem:', e.target.src);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setImagePreview(null);
                        // Reset do input file
                        const fileInput = document.getElementById('image-upload');
                        if (fileInput) {
                          fileInput.value = '';
                        }
                        setNewAgent(prev => ({
                          ...prev,
                          image_url: "",
                          _imageFile: null
                        }));
                      }}
                      className="absolute top-8 right-2 bg-red-500 hover:bg-red-600 text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                {/* Campo manual para URL */}
                <div>
                  <Label className="text-gray-300 text-sm mb-2 block">Ou inserir URL manualmente:</Label>
                  <Input 
                    placeholder="/assets/images/agents/agent.png" 
                    value={newAgent.image_url} 
                    onChange={(e) => {
                       setNewAgent(prev => ({
                         ...prev, 
                         image_url: e.target.value,
                         _imageFile: null
                       }));
                       if (e.target.value) {
                         setImagePreview(e.target.value);
                       }
                     }}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Descrição</Label>
            <Textarea 
              placeholder="Descreva as funções do agente..." 
              value={newAgent.description} 
              onChange={(e) => setNewAgent(prev => ({...prev, description: e.target.value}))}
              className="bg-gray-700 border-gray-600 text-white min-h-[100px] resize-vertical"
            />
          </div>
          
          <div>
            <Label className="text-gray-300">Capacidades (separadas por vírgula)</Label>
            <Input 
              placeholder="análise de dados, relatórios, automação" 
              value={newAgent.capabilities} 
              onChange={(e) => setNewAgent(prev => ({...prev, capabilities: e.target.value}))}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <Label className="text-gray-300">Prompt do Sistema</Label>
            <Textarea 
              placeholder="Você é um assistente especializado em..." 
              value={newAgent.prompt} 
              onChange={(e) => setNewAgent(prev => ({...prev, prompt: e.target.value}))}
              className="bg-gray-700 border-gray-600 text-white min-h-[120px] resize-vertical"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseForm} className="border-gray-600 text-gray-300">
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
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
