
import { useState } from 'react';
import PropTypes from 'prop-types';
import { LLMConfig } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { PlusCircle, Edit, Trash2, BrainCircuit, CheckCircle, XCircle, Key, Star, Activity, Zap } from "lucide-react";

export default function LLMManagementView({ llms = [], onUpdate = () => {} }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLlm, setEditingLlm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    provider: 'OpenAI',
    model_id: '',
    api_key: '',
    is_active: true,
    is_default: false,
    temperature: 0.7,
    max_tokens: 4096,
    status: 'unconfigured'
  });

  const resetForm = () => ({
    name: '',
    provider: 'OpenAI',
    model_id: '',
    api_key: '',
    is_active: true,
    is_default: false,
    temperature: 0.7,
    max_tokens: 4096,
    status: 'unconfigured'
  });

  const handleAddNew = () => {
    setEditingLlm(null);
    setFormData(resetForm());
    setIsFormOpen(true);
  };

  const handleEdit = (llm) => {
    setEditingLlm(llm);
    setFormData({ ...llm });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja remover este modelo LLM?')) {
      try {
        await LLMConfig.delete(id);
        onUpdate();
      } catch (error) {
        console.error("Erro ao deletar LLM:", error);
        alert("Erro ao deletar LLM");
      }
    }
  };

  const handleSetDefault = async (llmToSet) => {
    try {
      const currentDefault = llms.find(l => l.is_default);
      if (currentDefault && currentDefault.id !== llmToSet.id) {
        await LLMConfig.update(currentDefault.id, { is_default: false });
      }
      await LLMConfig.update(llmToSet.id, { is_default: true });
      onUpdate();
    } catch (error) {
      console.error("Erro ao definir LLM padrão:", error);
      alert("Erro ao definir LLM padrão");
    }
  };

  const handleToggleActive = async (llm) => {
    try {
      await LLMConfig.update(llm.id, { is_active: !llm.is_active });
      onUpdate();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      alert("Erro ao alterar status");
    }
  };

  const handleSave = async () => {
    try {
      const dataToSave = { ...formData };
      if (dataToSave.api_key && dataToSave.status === 'unconfigured') {
        dataToSave.status = 'connected';
      }

      if (editingLlm) {
        await LLMConfig.update(editingLlm.id, dataToSave);
      } else {
        await LLMConfig.create(dataToSave);
      }
      
      setIsFormOpen(false);
      onUpdate();
    } catch (error) {
      console.error("Erro ao salvar LLM:", error);
      alert("Erro ao salvar LLM");
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      connected: { color: 'bg-green-500', text: 'Conectado', icon: CheckCircle },
      error: { color: 'bg-red-500', text: 'Erro', icon: XCircle },
      unconfigured: { color: 'bg-yellow-500', text: 'Não Configurado', icon: Key },
    };
    const config = configs[status] || configs.unconfigured;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const getProviderBadge = (provider) => {
    const colors = {
      OpenAI: 'bg-sky-500',
      Google: 'bg-blue-500',
      Anthropic: 'bg-purple-500',
      Custom: 'bg-gray-500'
    };
    return <Badge className={`${colors[provider] || colors.Custom} text-white`}>{provider}</Badge>;
  };

  // Estatísticas dos LLMs
  const stats = {
    total: llms.length || 0,
    active: llms.filter(l => l.is_active).length || 0,
    connected: llms.filter(l => l.status === 'connected').length || 0,
    providers: [...new Set(llms.map(l => l.provider))].length || 0
  };

  return (
    <div className="admin-full-width space-y-6 w-full max-w-none overflow-hidden">
      {/* Header Responsivo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-100">Gerenciamento de LLMs</h1>
            <p className="text-gray-400 text-sm lg:text-base">Configure e monitore modelos de linguagem da plataforma</p>
          </div>
        </div>
        <div className="lg:ml-auto">
          <Button 
            onClick={handleAddNew}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Adicionar LLM
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-400">Total de LLMs</p>
                <p className="text-xl lg:text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <BrainCircuit className="w-6 lg:w-8 h-6 lg:h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-400">LLMs Ativos</p>
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
                <p className="text-xs lg:text-sm font-medium text-gray-400">Conectados</p>
                <p className="text-xl lg:text-2xl font-bold text-white">{stats.connected}</p>
              </div>
              <CheckCircle className="w-6 lg:w-8 h-6 lg:h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-400">Provedores</p>
                <p className="text-xl lg:text-2xl font-bold text-white">{stats.providers}</p>
              </div>
              <Zap className="w-6 lg:w-8 h-6 lg:h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid de Cards de LLMs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {llms.map((llm, index) => (
          <motion.div 
            key={llm.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 h-full flex flex-col hover:border-purple-500/30 transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <CardTitle className="text-lg lg:text-xl text-cyan-300 mb-1 break-words">{llm.name}</CardTitle>
                    <p className="text-xs lg:text-sm text-gray-400 font-mono break-all">{llm.model_id}</p>
                  </div>
                  {llm.is_default && (
                    <Badge variant="outline" className="border-yellow-400 text-yellow-400 ml-2 flex-shrink-0">
                      <Star className="w-3 h-3 mr-1" />
                      Padrão
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {getProviderBadge(llm.provider)}
                  {getStatusBadge(llm.status)}
                </div>
              </CardHeader>

              <CardContent className="flex-grow space-y-3 pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400 block">Temperatura</span>
                    <span className="font-medium text-white">{llm.temperature || 0.7}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Max Tokens</span>
                    <span className="font-medium text-white">{llm.max_tokens || 4096}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={llm.is_active}
                      onCheckedChange={() => handleToggleActive(llm)}
                      size="sm"
                    />
                    <span className="text-xs text-gray-400">Ativo</span>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(llm)}
                      className="h-8 w-8 hover:bg-gray-700"
                    >
                      <Edit className="w-3 h-3 text-yellow-400" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(llm.id)}
                      className="h-8 w-8 hover:bg-gray-700"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                    {!llm.is_default && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSetDefault(llm)}
                        className="h-8 w-8 hover:bg-gray-700"
                        title="Definir como padrão"
                      >
                        <Star className="w-3 h-3 text-gray-400 hover:text-yellow-400" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Mensagem quando não há LLMs */}
      {llms.length === 0 && (
        <div className="text-center py-12">
          <BrainCircuit className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">Nenhum LLM configurado</h3>
          <p className="text-gray-500 mb-6">Configure seu primeiro modelo de linguagem para começar.</p>
          <Button onClick={handleAddNew} className="bg-gradient-to-r from-purple-500 to-blue-500">
            <PlusCircle className="w-4 h-4 mr-2" />
            Adicionar Primeiro LLM
          </Button>
        </div>
      )}

      {/* Modal de Formulário */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {editingLlm ? 'Editar Modelo LLM' : 'Adicionar Novo LLM'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Nome de Exibição</Label>
                <Input 
                  value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="GPT-4 Turbo"
                />
              </div>
              <div>
                <Label className="text-gray-300">Provedor</Label>
                <Select value={formData.provider || 'OpenAI'} onValueChange={v => setFormData({...formData, provider: v})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="OpenAI">OpenAI</SelectItem>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="Anthropic">Anthropic</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="text-gray-300">Model ID</Label>
              <Input 
                placeholder="gpt-4-turbo-preview" 
                value={formData.model_id || ''} 
                onChange={e => setFormData({...formData, model_id: e.target.value})} 
                className="bg-gray-700 border-gray-600 text-white" 
              />
            </div>
            
            <div>
              <Label className="text-gray-300">API Key</Label>
              <Input 
                type="password" 
                placeholder="sk-..." 
                value={formData.api_key || ''} 
                onChange={e => setFormData({...formData, api_key: e.target.value})} 
                className="bg-gray-700 border-gray-600 text-white" 
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Temperatura: {formData.temperature}</Label>
              <Slider 
                value={[formData.temperature || 0.7]} 
                onValueChange={v => setFormData({...formData, temperature: v[0]})} 
                max={2} 
                step={0.1} 
                className="mt-2"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Max Tokens</Label>
              <Input 
                type="number" 
                value={formData.max_tokens || 4096} 
                onChange={e => setFormData({...formData, max_tokens: parseInt(e.target.value)})} 
                className="bg-gray-700 border-gray-600 text-white" 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="is_active" 
                checked={formData.is_active} 
                onCheckedChange={c => setFormData({...formData, is_active: c})} 
              />
              <Label htmlFor="is_active" className="text-gray-300">Ativo para uso no sistema</Label>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsFormOpen(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                {editingLlm ? 'Atualizar' : 'Criar'} LLM
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

LLMManagementView.propTypes = {
  llms: PropTypes.array,
  onUpdate: PropTypes.func,
};
