import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Settings,
  Code
} from "lucide-react";
import { Integration } from '@/api/entities';

export default function IntegrationsManagement({ integrations, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'custom',
    description: '',
    api_endpoint: '',
    webhook_url: '',
    auth_type: 'none',
    api_key: '',
    client_id: '',
    client_secret: '',
    permissions: '',
    plan_required: 'free',
    is_active: true
  });

  const handleCreateOrUpdate = async () => {
    const integrationData = {
      ...formData,
      permissions: formData.permissions.split(',').map(p => p.trim()).filter(Boolean),
      status: 'disconnected'
    };

    if (editingIntegration) {
      await Integration.update(editingIntegration.id, integrationData);
    } else {
      await Integration.create(integrationData);
    }
    
    setShowForm(false);
    setEditingIntegration(null);
    resetForm();
    onUpdate();
  };

  const handleEdit = (integration) => {
    setEditingIntegration(integration);
    setFormData({
      ...integration,
      permissions: integration.permissions?.join(', ') || ''
    });
    setShowForm(true);
  };
  
  const handleAddNew = () => {
    setEditingIntegration(null);
    resetForm();
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'custom',
      description: '',
      api_endpoint: '',
      webhook_url: '',
      auth_type: 'none',
      api_key: '',
      client_id: '',
      client_secret: '',
      permissions: '',
      plan_required: 'free',
      is_active: true
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja deletar esta integração?')) {
      await Integration.delete(id);
      onUpdate();
    }
  };

  const handleToggleActive = async (integration) => {
    await Integration.update(integration.id, {
      is_active: !integration.is_active
    });
    onUpdate();
  };

  const getStatusBadge = (status) => {
    const configs = {
      connected: { color: 'bg-green-500', text: 'Conectada', icon: CheckCircle },
      disconnected: { color: 'bg-gray-500', text: 'Desconectada', icon: XCircle },
      error: { color: 'bg-red-500', text: 'Erro', icon: XCircle },
      pending: { color: 'bg-yellow-500', text: 'Pendente', icon: Settings }
    };
    
    const config = configs[status] || configs.disconnected;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="admin-full-width space-y-6 w-full max-w-none overflow-hidden">
      <Card className="bg-gray-800/50 border-gray-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Gerenciar Integrações
          </CardTitle>
          <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
            <PlusCircle className="w-4 h-4 mr-2" />
            Nova Integração
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="p-6 mb-6 bg-gray-700/50 rounded-lg space-y-4 border border-gray-600">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Code className="w-5 h-5" />
                {editingIntegration ? 'Editando Integração' : 'Nova Integração'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome da Integração</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="bg-gray-800 border-gray-600 text-white" 
                    placeholder="Ex: WhatsApp Business"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={value => setFormData({...formData, type: value})}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white">
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="microsoft">Microsoft</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="telegram">Telegram</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="spotify">Spotify</SelectItem>
                      <SelectItem value="home_assistant">Home Assistant</SelectItem>
                      <SelectItem value="custom">Personalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description" 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Descreva o que esta integração faz..."
                  />
                </div>

                <div>
                  <Label htmlFor="api_endpoint">API Endpoint</Label>
                  <Input 
                    id="api_endpoint" 
                    value={formData.api_endpoint} 
                    onChange={e => setFormData({...formData, api_endpoint: e.target.value})} 
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="https://api.exemplo.com/v1"
                  />
                </div>

                <div>
                  <Label htmlFor="webhook_url">Webhook URL</Label>
                  <Input 
                    id="webhook_url" 
                    value={formData.webhook_url} 
                    onChange={e => setFormData({...formData, webhook_url: e.target.value})} 
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="https://webhooks.exemplo.com/callback"
                  />
                </div>

                <div>
                  <Label htmlFor="auth_type">Tipo de Autenticação</Label>
                  <Select value={formData.auth_type} onValueChange={value => setFormData({...formData, auth_type: value})}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white">
                      <SelectItem value="none">Nenhuma</SelectItem>
                      <SelectItem value="api_key">API Key</SelectItem>
                      <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                      <SelectItem value="bearer">Bearer Token</SelectItem>
                      <SelectItem value="basic">Basic Auth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="plan_required">Plano Necessário</Label>
                  <Select value={formData.plan_required} onValueChange={value => setFormData({...formData, plan_required: value})}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white">
                      <SelectItem value="free">Gratuito</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.auth_type === 'api_key' && (
                  <div className="md:col-span-2">
                    <Label htmlFor="api_key">API Key</Label>
                    <Input 
                      id="api_key" 
                      type="password"
                      value={formData.api_key} 
                      onChange={e => setFormData({...formData, api_key: e.target.value})} 
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
                    />
                  </div>
                )}

                {formData.auth_type === 'oauth2' && (
                  <>
                    <div>
                      <Label htmlFor="client_id">Client ID</Label>
                      <Input 
                        id="client_id" 
                        value={formData.client_id} 
                        onChange={e => setFormData({...formData, client_id: e.target.value})} 
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="client_secret">Client Secret</Label>
                      <Input 
                        id="client_secret" 
                        type="password"
                        value={formData.client_secret} 
                        onChange={e => setFormData({...formData, client_secret: e.target.value})} 
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </>
                )}

                <div className="md:col-span-2">
                  <Label htmlFor="permissions">Permissões (separadas por vírgula)</Label>
                  <Input 
                    id="permissions" 
                    value={formData.permissions} 
                    onChange={e => setFormData({...formData, permissions: e.target.value})} 
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="read_messages, send_messages, manage_contacts"
                  />
                </div>

                <div className="md:col-span-2 flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={checked => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is_active">Integração Ativa</Label>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateOrUpdate} className="bg-blue-600 hover:bg-blue-700">
                  {editingIntegration ? 'Salvar Alterações' : 'Criar Integração'}
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="border-gray-600 text-white hover:bg-gray-600">
                  Cancelar
                </Button>
              </div>
            </div>
          )}
          
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-800/50">
                <TableHead className="text-white">Nome</TableHead>
                <TableHead className="text-white">Tipo</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Plano</TableHead>
                <TableHead className="text-white">Ativa</TableHead>
                <TableHead className="text-white">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {integrations.map(integration => (
                <TableRow key={integration.id} className="border-gray-700 hover:bg-gray-800/50">
                  <TableCell className="font-medium">{integration.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-gray-500 text-gray-300">
                      {integration.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(integration.status)}</TableCell>
                  <TableCell>
                    <Badge className={
                      integration.plan_required === 'free' ? 'bg-green-500' :
                      integration.plan_required === 'premium' ? 'bg-blue-500' : 'bg-purple-500'
                    }>
                      {integration.plan_required}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={integration.is_active}
                      onCheckedChange={() => handleToggleActive(integration)}
                    />
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(integration)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(integration.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Estatísticas das Integrações */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-2xl font-bold text-white">{integrations.length}</p>
              </div>
              <LinkIcon className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Conectadas</p>
                <p className="text-2xl font-bold text-green-400">
                  {integrations.filter(i => i.status === 'connected').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ativas</p>
                <p className="text-2xl font-bold text-blue-400">
                  {integrations.filter(i => i.is_active).length}
                </p>
              </div>
              <Settings className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Com Erro</p>
                <p className="text-2xl font-bold text-red-400">
                  {integrations.filter(i => i.status === 'error').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

IntegrationsManagement.propTypes = {
  integrations: PropTypes.array,
  onUpdate: PropTypes.func,
};