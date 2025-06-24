
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { VisionCompanion } from '@/api/entities';
import { useAdminData } from '../AdminDataContext';
import { 
  Brain, 
  Activity, 
  Users, 
  Zap, 
  Eye, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Settings,
  Search,
  Filter,
  Edit,
  Save,
  Volume2,
  VolumeX,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

export default function VisionCoreController() {
  const { data, isLoading, refreshAll } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingVision, setEditingVision] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState({
    totalCompanions: 0,
    activeCompanions: 0,
    totalInteractions: 0,
    avgResponseTime: 0,
    systemLoad: 0,
    errorRate: 0
  });

  useEffect(() => {
    if (data.visions) {
      calculateMetrics();
    }
  }, [data]);

  const calculateMetrics = () => {
    const visions = data.visions || [];
    
    setSystemMetrics({
      totalCompanions: visions.length,
      activeCompanions: visions.filter(v => v.status === 'active').length,
      totalInteractions: visions.reduce((sum, v) => sum + (v.total_interactions || 0), 0),
      avgResponseTime: 1.2 + Math.random() * 0.5,
      systemLoad: 45 + Math.random() * 30,
      errorRate: Math.random() * 3
    });
  };

  const handleEditClick = (vision) => {
    setEditingVision({
      ...vision,
      user_preferences: { ...vision.user_preferences },
      connected_agents: vision.connected_agents ? [...vision.connected_agents] : [],
      active_routines: vision.active_routines ? [...vision.active_routines] : []
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingVision) return;
    setIsSaving(true);
    try {
      const { id, ...dataToUpdate } = editingVision;
      await VisionCompanion.update(id, dataToUpdate);
      setIsDialogOpen(false);
      setEditingVision(null);
      refreshAll();
    } catch (error) {
      console.error("Erro ao salvar Vision:", error);
    }
    setIsSaving(false);
  };

  const handleFieldChange = (field, value) => {
    setEditingVision(prev => ({ ...prev, [field]: value }));
  };

  const handleUserPreferenceChange = (field, value) => {
    setEditingVision(prev => ({
      ...prev,
      user_preferences: {
        ...prev.user_preferences,
        [field]: value
      }
    }));
  };

  const filteredVisions = (data.visions || []).filter(vision => {
    const matchesSearch = vision.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vision.created_by.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vision.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'listening': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'sleeping': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'listening': return Activity;
      case 'processing': return Brain;
      case 'sleeping': return AlertTriangle;
      default: return Eye;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando Vision Core...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-100">Vision Core Master</h1>
              <p className="text-gray-400">Centro de controle completo dos Vision Companions da plataforma</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => { calculateMetrics(); refreshAll(); }} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar Sistema
          </Button>
          
          {/* BOTÃO DE CONFIGURAÇÕES CORE FUNCIONAL */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-gray-600 text-white">
                <Settings className="w-4 h-4 mr-2" />
                Configurações Core
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Configurações Globais do Vision Core
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Configurações Globais do Sistema */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-400">Sistema Global</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Limite de Companions por Usuário</Label>
                      <Input
                        type="number"
                        defaultValue="3"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label>Timeout de Inatividade (min)</Label>
                      <Input
                        type="number"
                        defaultValue="30"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Modo Depuração Global</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Auto-backup de Conversas</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Análise Comportamental</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                {/* Configurações de IA */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">Inteligência Artificial</h3>
                  
                  <div>
                    <Label>Modelo de Linguagem Padrão</Label>
                    <Select defaultValue="gpt-4">
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white">
                        <SelectItem value="gpt-4">GPT-4 Turbo</SelectItem>
                        <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude">Claude-3</SelectItem>
                        <SelectItem value="gemini">Gemini Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Temperatura Global: 0.7</Label>
                    <Slider
                      defaultValue={[0.7]}
                      max={2}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Máximo de Tokens por Resposta</Label>
                    <Input
                      type="number"
                      defaultValue="4096"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                {/* Configurações de Voz */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-400">Sistema de Voz</h3>
                  
                  <div>
                    <Label>Engine de Voz Padrão</Label>
                    <Select defaultValue="elevenlabs">
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white">
                        <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                        <SelectItem value="openai">OpenAI TTS</SelectItem>
                        <SelectItem value="google">Google TTS</SelectItem>
                        <SelectItem value="azure">Azure Speech</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Voz Habilitada Globalmente</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Reconhecimento Contínuo</Label>
                      <Switch />
                    </div>
                  </div>
                </div>

                {/* Configurações de Segurança */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-400">Segurança</h3>
                  
                  <div>
                    <Label>Filtro de Conteúdo</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white">
                        <SelectItem value="strict">Rigoroso</SelectItem>
                        <SelectItem value="medium">Médio</SelectItem>
                        <SelectItem value="permissive">Permissivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Log de Conversas Sensíveis</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Bloqueio Automático de Spam</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-600 text-white"
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Configurações
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Tabs for different functions */}
      <Tabs defaultValue="monitoring" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-purple-600">
            <Activity className="w-4 h-4 mr-2" />
            Monitoramento Sistema
          </TabsTrigger>
          <TabsTrigger value="management" className="data-[state=active]:bg-blue-600">
            <Settings className="w-4 h-4 mr-2" />
            Gerenciamento Individual
          </TabsTrigger>
        </TabsList>

        {/* MONITORING TAB */}
        <TabsContent value="monitoring" className="space-y-6">
          {/* System Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
          >
            <MetricCard
              title="Total Companions"
              value={systemMetrics.totalCompanions}
              icon={Eye}
              color="blue"
              trend="+12%"
            />
            <MetricCard
              title="Ativos Agora"
              value={systemMetrics.activeCompanions}
              icon={Activity}
              color="green"
              trend="+5%"
            />
            <MetricCard
              title="Interações Hoje"
              value={systemMetrics.totalInteractions}
              icon={Users}
              color="purple"
              trend="+23%"
            />
            <MetricCard
              title="Tempo Resposta"
              value={`${systemMetrics.avgResponseTime.toFixed(1)}s`}
              icon={Clock}
              color="cyan"
              trend="-0.2s"
            />
            <MetricCard
              title="Carga Sistema"
              value={`${systemMetrics.systemLoad.toFixed(1)}%`}
              icon={Zap}
              color="yellow"
              trend="Normal"
            />
            <MetricCard
              title="Taxa de Erro"
              value={`${systemMetrics.errorRate.toFixed(2)}%`}
              icon={AlertTriangle}
              color="red"
              trend="-1.2%"
            />
          </motion.div>

          {/* System Status Overview */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Status do Sistema Vision Core
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-white">Sistema Operacional</h3>
                  <p className="text-sm text-gray-400">Todos os serviços funcionando</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white">IA Processando</h3>
                  <p className="text-sm text-gray-400">{systemMetrics.activeCompanions} companions ativos</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white">Performance</h3>
                  <p className="text-sm text-gray-400">Excelente desempenho</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MANAGEMENT TAB */}
        <TabsContent value="management" className="space-y-6">
          {/* Filters */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Filter className="w-5 h-5" />
                Filtros de Gerenciamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Buscar Vision ou usuário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white">
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="listening">Ouvindo</SelectItem>
                    <SelectItem value="processing">Processando</SelectItem>
                    <SelectItem value="sleeping">Dormindo</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Brain className="w-4 h-4 mr-2" />
                  Análise Global
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Vision Companions Table */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Vision Companions ({filteredVisions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-white">Vision</TableHead>
                      <TableHead className="text-white">Usuário</TableHead>
                      <TableHead className="text-white">Personalidade</TableHead>
                      <TableHead className="text-white">Nível</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Interações</TableHead>
                      <TableHead className="text-white">Voz</TableHead>
                      <TableHead className="text-white">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVisions.map((vision) => {
                      const StatusIcon = getStatusIcon(vision.status);
                      return (
                        <TableRow key={vision.id} className="border-gray-700 hover:bg-gray-700/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                                <Eye className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-white">{vision.name}</p>
                                <p className="text-sm text-gray-400">
                                  Criado: {new Date(vision.created_date).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">{vision.created_by}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-gray-500 text-gray-300 capitalize">
                              {vision.personality_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                  style={{ width: `${(vision.learning_level / 10) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-400">{vision.learning_level}/10</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(vision.status)} text-white`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {vision.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {vision.total_interactions || 0}
                          </TableCell>
                          <TableCell>
                            {vision.voice_enabled ? (
                              <Volume2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <VolumeX className="w-4 h-4 text-gray-500" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => handleEditClick(vision)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Gerenciar
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <img src="/assets/images/autvision-logo.png" alt="AutVision" className="w-6 h-6 rounded bg-white/20 p-1" />
              Editando Vision: {editingVision?.name}
            </DialogTitle>
          </DialogHeader>
          {editingVision && (
            <div className="space-y-6 py-4">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações Básicas</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vision-name">Nome do Vision</Label>
                    <Input
                      id="vision-name"
                      value={editingVision.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="personality">Personalidade</Label>
                    <Select
                      value={editingVision.personality_type}
                      onValueChange={(value) => handleFieldChange('personality_type', value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white">
                        <SelectItem value="professional">Profissional</SelectItem>
                        <SelectItem value="friendly">Amigável</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="creative">Criativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nível de Aprendizado: {editingVision.learning_level}</Label>
                    <Slider
                      value={[editingVision.learning_level]}
                      onValueChange={(value) => handleFieldChange('learning_level', value[0])}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={editingVision.status}
                      onValueChange={(value) => handleFieldChange('status', value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white">
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="listening">Ouvindo</SelectItem>
                        <SelectItem value="processing">Processando</SelectItem>
                        <SelectItem value="sleeping">Dormindo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingVision.voice_enabled}
                    onCheckedChange={(checked) => handleFieldChange('voice_enabled', checked)}
                  />
                  <Label>Voz Habilitada</Label>
                </div>
              </div>

              {/* Preferências do Usuário */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preferências</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Palavra de Ativação</Label>
                    <Input
                      value={editingVision.user_preferences?.wake_word || 'Hey Vision'}
                      onChange={(e) => handleUserPreferenceChange('wake_word', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label>Velocidade de Resposta</Label>
                    <Select
                      value={editingVision.user_preferences?.response_speed || 'normal'}
                      onValueChange={(value) => handleUserPreferenceChange('response_speed', value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white">
                        <SelectItem value="slow">Lenta</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="fast">Rápida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Modo de Interação</Label>
                  <Select
                    value={editingVision.user_preferences?.interaction_mode || 'mixed'}
                    onValueChange={(value) => handleUserPreferenceChange('interaction_mode', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white">
                      <SelectItem value="voice">Apenas Voz</SelectItem>
                      <SelectItem value="text">Apenas Texto</SelectItem>
                      <SelectItem value="mixed">Misto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Estatísticas Detalhadas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Estatísticas Detalhadas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Total de Interações</p>
                    <p className="text-xl font-bold">{editingVision.total_interactions || 0}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Última Interação</p>
                    <p className="text-sm">
                      {editingVision.last_interaction
                        ? new Date(editingVision.last_interaction).toLocaleString('pt-BR')
                        : 'Nunca'
                      }
                    </p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Agentes Conectados</p>
                    <p className="text-xl font-bold">{editingVision.connected_agents?.length || 0}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Rotinas Ativas</p>
                    <p className="text-xl font-bold">{editingVision.active_routines?.length || 0}</p>
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} disabled={isSaving} className="w-full bg-blue-600 hover:bg-blue-700">
                {isSaving ? (
                  <>
                    <Activity className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Component for metric cards
const MetricCard = ({ title, value, icon: Icon, color, trend }) => {
  const colors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    cyan: 'text-cyan-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400'
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {trend && (
              <p className="text-xs text-green-400">{trend}</p>
            )}
          </div>
          <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center">
            <Icon className={`w-6 h-6 ${colors[color]}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
