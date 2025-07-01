
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
// Removed MCPLogsTable, MCPStatsWidget, MCPRoutePreview as they are now inlined or replaced
import {
  GitBranch,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  BarChart3,
  FileText, // New import for logs table title
  ExternalLink, // New import for action button in table
  X, // New import for modal close button
  ArrowRight, // New import for route preview
  Bot, // New import for route preview
  Zap, // New import for route preview
  TrendingUp // New import for performance metrics
} from "lucide-react";

export default function MCPMonitoringView() {
  const [mcpData, setMcpData] = useState({
    commands: [],
    stats: {
      totalCommands: 0,
      avgResponseTime: 0,
      successRate: 0,
      topAgents: []
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    agent: 'all',
    status: 'all',
    dateRange: '24h'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadMCPData();
    // Auto-refresh a cada 2 minutos ao invés de 30 segundos (reduzindo carga)
    const interval = setInterval(loadMCPData, 120000);
    return () => clearInterval(interval);
  }, [filters]);

  const loadMCPData = async () => {
    setIsLoading(true);

    // Dados mockados baseados no que existiria no sistema real
    const mockCommands = [
      {
        id: 1,
        command: "weather_check",
        agent_type: "weather",
        status: "success",
        execution_time: 1.2,
        timestamp: new Date(Date.now() - 300000).toISOString(),
        route: "Vision → Weather Agent → OpenWeather API",
        response_data: { temp: "25°C", condition: "sunny" }
      },
      {
        id: 2,
        command: "send_email",
        agent_type: "communication",
        status: "success",
        execution_time: 2.8,
        timestamp: new Date(Date.now() - 600000).toISOString(),
        route: "Vision → Email Agent → SMTP Service",
        response_data: { sent: true, recipient: "user@example.com" }
      },
      {
        id: 3,
        command: "calendar_create",
        agent_type: "productivity",
        status: "error",
        execution_time: 0.5,
        timestamp: new Date(Date.now() - 900000).toISOString(),
        route: "Vision → Calendar Agent → Google Calendar",
        error: "Authentication failed"
      },
      {
        id: 4,
        command: "smart_home_control",
        agent_type: "home",
        status: "pending",
        execution_time: null,
        timestamp: new Date(Date.now() - 60000).toISOString(),
        route: "Vision → Home Agent → Home Assistant",
        response_data: null
      },
      {
        id: 5,
        command: "finance_summary",
        agent_type: "finance",
        status: "success",
        execution_time: 3.1,
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        route: "Vision → Finance Agent → Banking API",
        response_data: { balance: "R$ 2.500,00", transactions: 15 }
      }
    ];

    const mockStats = {
      totalCommands: mockCommands.length,
      avgResponseTime: 1.9,
      successRate: 80,
      topAgents: [
        { name: "Weather Agent", usage: 45 },
        { name: "Email Agent", usage: 32 },
        { name: "Calendar Agent", usage: 28 },
        { name: "Finance Agent", usage: 21 }
      ]
    };

    // Simular delay de carregamento
    setTimeout(() => {
      setMcpData({
        commands: mockCommands,
        stats: mockStats
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleCommandClick = (command) => {
    setSelectedCommand(command);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    const configs = {
      success: { color: 'bg-green-500', text: 'Sucesso', icon: CheckCircle },
      error: { color: 'bg-red-500', text: 'Erro', icon: XCircle },
      pending: { color: 'bg-yellow-500', text: 'Pendente', icon: Clock }
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const filteredCommands = mcpData.commands.filter(cmd => {
    const matchesAgent = filters.agent === 'all' || cmd.agent_type === filters.agent;
    const matchesStatus = filters.status === 'all' || cmd.status === filters.status;
    const matchesSearch = searchTerm === '' ||
      cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.agent_type.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesAgent && matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando dados MCP...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-full-width space-y-6 w-full max-w-none overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-100">Painel MCP</h1>
              <p className="text-gray-400">Monitoramento avançado da orquestração Model Context Protocol</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={loadMCPData} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" className="border-gray-600 text-white">
            <Activity className="w-4 h-4 mr-2" />
            Logs Avançados
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards - Melhorados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total de Comandos</p>
                <p className="text-2xl font-bold text-white">{mcpData.stats.totalCommands}</p>
                <p className="text-xs text-green-400">+12% hoje</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Tempo Médio</p>
                <p className="text-2xl font-bold text-white">{mcpData.stats.avgResponseTime}s</p>
                <p className="text-xs text-green-400">-0.3s esta semana</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-white">{mcpData.stats.successRate}%</p>
                <p className="text-xs text-green-400">+2% esta semana</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Agentes Ativos</p>
                <p className="text-2xl font-bold text-white">{mcpData.stats.topAgents.length}</p>
                <p className="text-xs text-cyan-400">3 novos hoje</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <GitBranch className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters - Melhorados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Filter className="w-5 h-5" />
              Filtros Avançados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Buscar comandos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <Select value={filters.agent} onValueChange={(value) => setFilters({...filters, agent: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Agente" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white">
                  <SelectItem value="all">Todos os Agentes</SelectItem>
                  <SelectItem value="weather">Weather Agent</SelectItem>
                  <SelectItem value="communication">Communication Agent</SelectItem>
                  <SelectItem value="productivity">Productivity Agent</SelectItem>
                  <SelectItem value="home">Home Agent</SelectItem>
                  <SelectItem value="finance">Finance Agent</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white">
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.dateRange} onValueChange={(value) => setFilters({...filters, dateRange: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white">
                  <SelectItem value="1h">Última hora</SelectItem>
                  <SelectItem value="24h">Últimas 24h</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                <Filter className="w-4 h-4 mr-2" />
                Aplicar
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Enhanced Logs Table */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="w-5 h-5" />
                Logs de Execução MCP ({filteredCommands.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-white">Comando</TableHead>
                      <TableHead className="text-white">Agente</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Tempo</TableHead>
                      <TableHead className="text-white">Timestamp</TableHead>
                      <TableHead className="text-white">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCommands.map((command) => (
                      <TableRow
                        key={command.id}
                        className="border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors"
                        onClick={() => handleCommandClick(command)}
                      >
                        <TableCell className="font-medium text-gray-300">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            {command.command}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400 capitalize">
                          {command.agent_type.replace('_', ' ')}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(command.status)}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {command.execution_time ? `${command.execution_time}s` : '-'}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {new Date(command.timestamp).toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300" onClick={(e) => {
                            e.stopPropagation(); // Prevent row click from triggering
                            handleCommandClick(command);
                          }}>
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Right Panel */}
        <div className="space-y-6">
          {/* Enhanced Route Preview */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <ArrowRight className="w-5 h-5" />
                Rota MCP Ativa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center"
                      >
                        <Bot className="w-6 h-6 text-white" />
                      </motion.div>
                      <span className="text-xs text-gray-400 mt-1">Vision</span>
                    </div>

                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5 text-gray-500" />
                    </motion.div>

                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs text-gray-400 mt-1">Agente</span>
                    </div>

                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    >
                      <ArrowRight className="w-5 h-5 text-gray-500" />
                    </motion.div>

                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs text-gray-400 mt-1">Execução</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-300">Última rota executada</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    <strong>Vision → Weather Agent → OpenWeather API</strong>
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Executado há 5 minutos</span>
                    <span>Tempo: 1.2s</span>
                    <Badge className="bg-green-500 text-white">Sucesso</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Top Agents */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="w-5 h-5" />
                Agentes Mais Usados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mcpData.stats.topAgents.map((agent, index) => (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                      }`}>
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-gray-300 font-medium">{agent.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(agent.usage / 50) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                      <span className="text-sm text-gray-400 font-mono">{agent.usage}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5" />
                Métricas de Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">CPU Usage</span>
                  <span className="text-green-400">23%</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div className="w-1/4 h-full bg-green-500 rounded-full"></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Memory Usage</span>
                  <span className="text-yellow-400">67%</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div className="w-2/3 h-full bg-yellow-500 rounded-full"></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Network I/O</span>
                  <span className="text-blue-400">45%</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div className="w-2/5 h-full bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Command Details Modal */}
      {showDetailsModal && selectedCommand && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetailsModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-800 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Detalhes do Comando</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowDetailsModal(false)}>
                  <X className="w-4 h-4 text-gray-400" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Comando</p>
                    <p className="text-white font-medium">{selectedCommand.command}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Agente</p>
                    <p className="text-white font-medium capitalize">{selectedCommand.agent_type.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Rota de Execução</p>
                  <p className="text-white">{selectedCommand.route}</p>
                </div>

                {selectedCommand.response_data && (
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">Dados de Resposta</p>
                    <pre className="text-xs text-green-400 overflow-x-auto">
                      {JSON.stringify(selectedCommand.response_data, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedCommand.error && (
                  <div className="bg-red-900/50 rounded-lg p-4 border border-red-500/50">
                    <p className="text-sm text-red-400 mb-2">Erro</p>
                    <p className="text-red-300">{selectedCommand.error}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
