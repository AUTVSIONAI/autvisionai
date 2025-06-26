
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import N8NWorkflowList from './N8NWorkflowList';
import N8NWorkflowChart from './N8NWorkflowChart';
import N8NWorkflowDetailsModal from './N8NWorkflowDetailsModal';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Settings, 
  RefreshCw, 
  Activity, 
  Zap, 
  GitBranch, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Database,
  Sliders,
  Plus
} from 'lucide-react';

// DADOS MOCK PARA N8N - REALISTAS
const MOCK_N8N_DATA = {
  workflows: [
    {
      id: "wf_001",
      name: "Vision Voice Processing",
      description: "Processamento de comandos de voz do Vision",
      active: true,
      status: "active",
      execution_count: 1247,
      success_rate: 98.5,
      last_execution: "2024-01-15T10:30:00Z",
      avg_execution_time: 1.2,
      tags: ["voice", "ai", "processing"],
      nodes: [
        { type: "trigger", name: "Voice Webhook" },
        { type: "function", name: "Parse Audio" },
        { type: "openai", name: "Speech to Text" },
        { type: "function", name: "Process Command" },
        { type: "webhook", name: "Response" }
      ],
      connections: 12,
      version: 3,
      created_by: "admin@autvision.com"
    },
    {
      id: "wf_002", 
      name: "User Registration Flow",
      description: "Fluxo completo de registro de usuários",
      active: true,
      status: "active",
      execution_count: 892,
      success_rate: 99.2,
      last_execution: "2024-01-15T09:45:00Z",
      avg_execution_time: 0.8,
      tags: ["user", "registration", "email"],
      nodes: [
        { type: "webhook", name: "Registration Webhook" },
        { type: "function", name: "Validate Data" },
        { type: "database", name: "Create User" },
        { type: "email", name: "Welcome Email" },
        { type: "slack", name: "Admin Notification" }
      ],
      connections: 8,
      version: 5,
      created_by: "admin@autvision.com"
    },
    {
      id: "wf_003",
      name: "Agent Sync & Analytics",
      description: "Sincronização de dados dos agentes e analytics",
      active: true,
      status: "active", 
      execution_count: 2134,
      success_rate: 97.8,
      last_execution: "2024-01-15T11:15:00Z",
      avg_execution_time: 2.1,
      tags: ["agents", "analytics", "sync"],
      nodes: [
        { type: "schedule", name: "Daily Trigger" },
        { type: "database", name: "Fetch Agents" },
        { type: "function", name: "Calculate Metrics" },
        { type: "database", name: "Store Analytics" },
        { type: "webhook", name: "Update Dashboard" }
      ],
      connections: 15,
      version: 2,
      created_by: "system@autvision.com"
    },
    {
      id: "wf_004",
      name: "Payment Processing",
      description: "Processamento de pagamentos e assinaturas",
      active: true,
      status: "warning",
      execution_count: 456,
      success_rate: 94.2,
      last_execution: "2024-01-15T08:20:00Z",
      avg_execution_time: 3.5,
      tags: ["payment", "stripe", "billing"],
      nodes: [
        { type: "webhook", name: "Payment Webhook" },
        { type: "stripe", name: "Process Payment" },
        { type: "function", name: "Update Subscription" },
        { type: "email", name: "Receipt Email" },
        { type: "database", name: "Log Transaction" }
      ],
      connections: 10,
      version: 4,
      created_by: "finance@autvision.com"
    },
    {
      id: "wf_005",
      name: "WhatsApp Business Integration",
      description: "Integração com WhatsApp Business para módulo empresarial",
      active: false,
      status: "inactive",
      execution_count: 78,
      success_rate: 89.7,
      last_execution: "2024-01-10T16:30:00Z",
      avg_execution_time: 4.2,
      tags: ["whatsapp", "business", "messaging"],
      nodes: [
        { type: "webhook", name: "WhatsApp Webhook" },
        { type: "function", name: "Parse Message" },
        { type: "ai", name: "Generate Response" },
        { type: "whatsapp", name: "Send Reply" },
        { type: "database", name: "Log Conversation" }
      ],
      connections: 18,
      version: 1,
      created_by: "business@autvision.com"
    },
    {
      id: "wf_006",
      name: "Backup & Data Export",
      description: "Backup automático de dados e exportação",
      active: true,
      status: "active",
      execution_count: 365,
      success_rate: 100,
      last_execution: "2024-01-15T02:00:00Z",
      avg_execution_time: 12.8,
      tags: ["backup", "export", "maintenance"],
      nodes: [
        { type: "schedule", name: "Daily 2AM" },
        { type: "database", name: "Export Data" },
        { type: "s3", name: "Upload to S3" },
        { type: "email", name: "Backup Report" },
        { type: "cleanup", name: "Clean Old Files" }
      ],
      connections: 6,
      version: 7,
      created_by: "system@autvision.com"
    }
  ],
  executions: [
    {
      id: "exec_001",
      workflow_id: "wf_001",
      status: "success",
      started_at: "2024-01-15T11:20:00Z",
      finished_at: "2024-01-15T11:20:01Z",
      execution_time: 1.2,
      triggered_by: "webhook"
    },
    {
      id: "exec_002", 
      workflow_id: "wf_002",
      status: "success",
      started_at: "2024-01-15T11:18:00Z",
      finished_at: "2024-01-15T11:18:01Z",
      execution_time: 0.9,
      triggered_by: "webhook"
    },
    {
      id: "exec_003",
      workflow_id: "wf_004",
      status: "error",
      started_at: "2024-01-15T11:15:00Z",
      finished_at: "2024-01-15T11:15:04Z",
      execution_time: 4.1,
      triggered_by: "webhook",
      error: "Payment gateway timeout"
    }
  ],
  stats: {
    total_workflows: 6,
    active_workflows: 5,
    total_executions_today: 127,
    success_rate_today: 96.8,
    avg_execution_time: 2.1,
    failed_executions_today: 4
  }
};

export default function N8NManagementView() {
  
  const [workflows, setWorkflows] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreateWorkflow = () => {
    alert('🚀 Função "Novo Workflow" será implementada na integração com N8N API');
    console.log('Criando novo workflow...');
  };

  const handleSystemSettings = () => {
    alert('⚙️ Configurações do N8N serão implementadas na integração com backend');
    console.log('Abrindo configurações do sistema N8N...');
  };

  useEffect(() => {
    loadN8NData();
  }, []);

  const loadN8NData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular carregamento de dados (substituir por API real quando disponível)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWorkflows(MOCK_N8N_DATA.workflows);
      setExecutions(MOCK_N8N_DATA.executions);
      setStats(MOCK_N8N_DATA.stats);
    } catch (e) {
      console.error("Erro ao buscar dados do N8N:", e);
      setError("Erro ao carregar dados do N8N");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWorkflow = (workflow) => {
    setSelectedWorkflow(workflow);
    setShowDetailsModal(true);
  };

  const handleWorkflowAction = async (workflowId, action) => {
    try {
      console.log(`Executando ação ${action} no workflow ${workflowId}`);
      
      // Simular ação
      if (action === 'activate' || action === 'deactivate') {
        setWorkflows(prev => prev.map(w => 
          w.id === workflowId 
            ? { ...w, active: action === 'activate', status: action === 'activate' ? 'active' : 'inactive' }
            : w
        ));
      }
      
      if (action === 'execute') {
        // Simular execução
        const newExecution = {
          id: `exec_${Date.now()}`,
          workflow_id: workflowId,
          status: 'running',
          started_at: new Date().toISOString(),
          triggered_by: 'manual'
        };
        setExecutions(prev => [newExecution, ...prev]);
        
        // Simular conclusão após 2 segundos
        setTimeout(() => {
          setExecutions(prev => prev.map(e => 
            e.id === newExecution.id 
              ? { ...e, status: 'success', finished_at: new Date().toISOString(), execution_time: 1.5 }
              : e
          ));
        }, 2000);
      }
    } catch (error) {
      console.error(`Erro ao executar ação ${action}:`, error);
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || workflow.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Carregando painel N8N...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-yellow-900/20 border border-yellow-700/50 rounded-lg text-center"
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <AlertTriangle className="w-12 h-12 text-yellow-400" />
          <h3 className="text-xl font-bold text-yellow-300">Sistema N8N</h3>
          <p className="text-yellow-400">{error}</p>
          <p className="text-sm text-yellow-500">
            Dados simulados carregados para demonstração do painel.
          </p>
          <Button onClick={loadN8NData} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="admin-full-width space-y-6 w-full max-w-none overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Sliders className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-100">Painel N8N</h1>
            <p className="text-gray-400 text-sm lg:text-base">Gerenciamento de workflows de automação</p>
          </div>
        </div>
        
        <div className="lg:ml-auto flex items-center gap-3">
          <Button onClick={loadN8NData} variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button 
            onClick={handleCreateWorkflow}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Workflow
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Workflows</p>
                <p className="text-2xl font-bold text-white">{stats.total_workflows}</p>
              </div>
              <GitBranch className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Workflows Ativos</p>
                <p className="text-2xl font-bold text-white">{stats.active_workflows}</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Execuções Hoje</p>
                <p className="text-2xl font-bold text-white">{stats.total_executions_today}</p>
              </div>
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-white">{stats.success_rate_today}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
            <Activity className="w-4 h-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="workflows" className="data-[state=active]:bg-purple-600">
            <GitBranch className="w-4 h-4 mr-2" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="executions" className="data-[state=active]:bg-purple-600">
            <Zap className="w-4 h-4 mr-2" />
            Execuções
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-purple-600">
            <Database className="w-4 h-4 mr-2" />
            Monitoramento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Performance dos Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <N8NWorkflowChart workflows={workflows} />
              </CardContent>
            </Card>

            {/* Recent Executions */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Execuções Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {executions.slice(0, 5).map(execution => {
                    const workflow = workflows.find(w => w.id === execution.workflow_id);
                    const StatusIcon = execution.status === 'success' ? CheckCircle : 
                                     execution.status === 'error' ? XCircle : Activity;
                    
                    return (
                      <div key={execution.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <StatusIcon className={`w-5 h-5 ${
                            execution.status === 'success' ? 'text-green-400' :
                            execution.status === 'error' ? 'text-red-400' : 'text-blue-400'
                          }`} />
                          <div>
                            <p className="text-white font-medium">{workflow?.name}</p>
                            <p className="text-gray-400 text-sm">
                              {new Date(execution.started_at).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${
                          execution.status === 'success' ? 'bg-green-500' :
                          execution.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        } text-white`}>
                          {execution.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          {/* Filters */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Filtros de Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Buscar workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white">
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="warning">Aviso</SelectItem>
                    <SelectItem value="error">Erro</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleSystemSettings}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Workflow List */}
          <N8NWorkflowList 
            workflows={filteredWorkflows} 
            onSelectWorkflow={handleSelectWorkflow}
            onWorkflowAction={handleWorkflowAction}
          />
        </TabsContent>

        <TabsContent value="executions" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Histórico de Execuções</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {executions.map(execution => {
                  const workflow = workflows.find(w => w.id === execution.workflow_id);
                  const StatusIcon = execution.status === 'success' ? CheckCircle : 
                                   execution.status === 'error' ? XCircle : Activity;
                  
                  return (
                    <div key={execution.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <StatusIcon className={`w-6 h-6 ${
                          execution.status === 'success' ? 'text-green-400' :
                          execution.status === 'error' ? 'text-red-400' : 'text-blue-400'
                        }`} />
                        <div>
                          <p className="text-white font-medium">{workflow?.name}</p>
                          <p className="text-gray-400 text-sm">ID: {execution.id}</p>
                          {execution.error && (
                            <p className="text-red-400 text-sm">Erro: {execution.error}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${
                          execution.status === 'success' ? 'bg-green-500' :
                          execution.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        } text-white mb-2`}>
                          {execution.status}
                        </Badge>
                        <p className="text-gray-400 text-sm">
                          {new Date(execution.started_at).toLocaleString('pt-BR')}
                        </p>
                        {execution.execution_time && (
                          <p className="text-gray-500 text-xs">
                            {execution.execution_time}s
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Monitoramento em Tempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">CPU Usage</span>
                    <span className="text-white">45%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Memory Usage</span>
                    <span className="text-white">67%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Active Connections</span>
                    <span className="text-white">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Status do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">N8N Engine</span>
                    <Badge className="bg-green-500 text-white">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Database</span>
                    <Badge className="bg-green-500 text-white">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Redis Cache</span>
                    <Badge className="bg-green-500 text-white">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Queue Workers</span>
                    <Badge className="bg-yellow-500 text-white">3/5 Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes */}
      <N8NWorkflowDetailsModal
        workflow={selectedWorkflow}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onAction={handleWorkflowAction}
      />
    </div>
  );
}
