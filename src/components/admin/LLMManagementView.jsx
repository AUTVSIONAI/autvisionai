
import React, { useState } from 'react';
import { LLMConfig } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { PlusCircle, Edit, Trash2, BrainCircuit, CheckCircle, XCircle, Key, Star, Power } from "lucide-react";

export default function LLMManagementView({ llms, onUpdate }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLlm, setEditingLlm] = useState(null);
  const [formData, setFormData] = useState({});

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
      await LLMConfig.delete(id);
      onUpdate();
    }
  };

  const handleSetDefault = async (llmToSet) => {
    const currentDefault = llms.find(l => l.is_default);
    try {
      if (currentDefault && currentDefault.id !== llmToSet.id) {
        await LLMConfig.update(currentDefault.id, { is_default: false });
      }
      await LLMConfig.update(llmToSet.id, { is_default: true });
      onUpdate();
    } catch (error) {
      console.error("Erro ao definir LLM padrão:", error);
    }
  };

  const handleSave = async () => {
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
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
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

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <BrainCircuit className="w-6 h-6 text-cyan-400" />
            Gerenciador de Modelos LLM
          </CardTitle>
          <Button onClick={handleAddNew} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <PlusCircle className="w-4 h-4 mr-2" />
            Adicionar LLM
          </Button>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {llms.map((llm, index) => (
          <motion.div key={llm.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="bg-gray-800/60 border border-gray-700/50 h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-cyan-300">{llm.name}</CardTitle>
                    <p className="text-sm text-gray-400 font-mono">{llm.model_id}</p>
                  </div>
                  {llm.is_default && (
                    <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                      <Star className="w-3 h-3 mr-1" />
                      Padrão
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  {getProviderBadge(llm.provider)}
                  {getStatusBadge(llm.status)}
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Temperatura:</span>
                  <span className="font-medium text-white">{llm.temperature}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Max Tokens:</span>
                  <span className="font-medium text-white">{llm.max_tokens}</span>
                </div>
                 <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Requisições:</span>
                  <span className="font-medium text-white">{llm.usage_requests}</span>
                </div>
              </CardContent>
              <div className="p-4 border-t border-gray-700/50 flex flex-wrap gap-2 justify-end">
                {!llm.is_default && (
                  <Button onClick={() => handleSetDefault(llm)} size="sm" variant="outline" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10">
                    <Star className="w-4 h-4 mr-2" />
                    Definir Padrão
                  </Button>
                )}
                <Button onClick={() => handleEdit(llm)} size="sm" variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button onClick={() => handleDelete(llm.id)} size="sm" variant="destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>{editingLlm ? 'Editar Modelo LLM' : 'Adicionar Novo LLM'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome de Exibição</Label>
                <Input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-gray-800 border-gray-600" />
              </div>
              <div>
                <Label>Provedor</Label>
                <Select value={formData.provider || 'OpenAI'} onValueChange={v => setFormData({...formData, provider: v})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white">
                    <SelectItem value="OpenAI">OpenAI</SelectItem>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="Anthropic">Anthropic</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Model ID</Label>
              <Input placeholder="gpt-4-turbo" value={formData.model_id || ''} onChange={e => setFormData({...formData, model_id: e.target.value})} className="bg-gray-800 border-gray-600" />
            </div>
            <div>
              <Label>API Key</Label>
              <Input type="password" placeholder="Cole sua chave de API aqui" value={formData.api_key || ''} onChange={e => setFormData({...formData, api_key: e.target.value})} className="bg-gray-800 border-gray-600" />
            </div>
            <div>
              <Label>Temperatura: {formData.temperature}</Label>
              <Slider value={[formData.temperature || 0.7]} onValueChange={v => setFormData({...formData, temperature: v[0]})} max={2} step={0.1} />
            </div>
             <div>
              <Label>Max Tokens: {formData.max_tokens}</Label>
              <Input type="number" value={formData.max_tokens || 4096} onChange={e => setFormData({...formData, max_tokens: parseInt(e.target.value)})} className="bg-gray-800 border-gray-600" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is_active" checked={formData.is_active} onCheckedChange={c => setFormData({...formData, is_active: c})} />
              <Label htmlFor="is_active">Ativo para uso no sistema</Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
