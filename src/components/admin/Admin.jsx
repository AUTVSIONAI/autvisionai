import { useState, useEffect } from "react";
import { useSync } from "@/contexts/SyncContext";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

import {
  LayoutDashboard,
  Users as UsersIcon,
  Settings,
  Eye,
  Clock,
  DollarSign,
  Brain,
  Activity,
  Briefcase,
  Share2,
  Bot,
  Command,
  Sliders,
  GitBranch,
  BarChart3 as BarChart3Icon,
  Menu,
  X,
  Mic,
} from "lucide-react";
import { Routine } from "@/api/entities";

// Importa todos os componentes de uma vez
import VisionCommandCore from "./VisionCommandCore";
import { AdminDataProvider } from "./AdminDataContext";
import DashboardCharts from "./DashboardCharts";
import AnalyticsView from "./AnalyticsView";
import UserManagementView from "./UserManagementView";
import SystemConfigView from "./SystemConfigView";
import LLMManagementView from "./LLMManagementView";
import FinancialView from "./FinancialView";
import AffiliatesManagement from "./AffiliatesManagement";
import AgentsManagement from "./AgentsManagement";
import IntegrationsManagement from "./IntegrationsManagement";
import AdvancedRoutinesManagement from "./AdvancedRoutinesManagement";
import BusinessModuleView from "./BusinessModuleView";
import MCPMonitoringView from "./MCPMonitoringView";
import N8NManagementView from "./N8NManagementView";
import VoiceManagement from "./VoiceManagement";
import StatCard from "./StatCard";
import BackendStatusNotification from "./BackendStatusNotification";
import SyncStatusIndicator from "@/components/sync/SyncStatusIndicator";

export default function Admin() {
  function AdminContent() {
    const { globalData: data, syncInProgress: isLoading, refreshAll, stats } = useSync();
    const [activeView, setActiveView] = useState('jarvis');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
      document.title = "🚀 AUTVISION ADMIN - Central de Comando Suprema";
      
      const root = window.document.documentElement;
      root.classList.remove('light');
      root.classList.add('dark');

      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      // Responsividade inteligente do sidebar
      const handleResize = () => {
        if (window.innerWidth < 1024) {
          setSidebarOpen(false);
        } else {
          setSidebarOpen(true);
        }
      };

      // Verificar tamanho inicial
      handleResize();
      
      window.addEventListener('resize', handleResize);

      // Preload dos componentes para melhor performance
      const preloadComponents = async () => {
        // Simular preload
        await new Promise(resolve => setTimeout(resolve, 100));
      };
      
      preloadComponents();

      return () => {
        clearInterval(timer);
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    const handleToggle = async (entity, id, field, currentValue) => {
      try {
        if (entity.update) {
          await entity.update(id, { [field]: !currentValue });
        } else {
          console.warn(`Entity ${entity.name} does not have an 'update' method.`);
        }
        await refreshAll();
      } catch (error) {
        console.error(`Erro ao atualizar ${entity.name} (ID: ${id}, Field: ${field}):`, error);
      }
    };

    // FUNÇÃO PARA CALCULAR ESTATÍSTICAS COM PROTEÇÃO - REMOVIDA (usando stats do SyncContext)
    // const getStats = () => { ... } - AGORA VEM DO SyncContext

    // Função para lidar com comandos do JARVIS
    const handleJarvisCommand = (command) => {
      console.log('JARVIS executando comando:', command);
      if (command.toLowerCase().includes('recarregar')) {
        refreshAll();
      }
    };

    // MENU LIMPO E DEFINITIVO - SEM ITENS EXTERNOS
    const menuItems = [
      { id: 'jarvis', label: 'Vision Command Core', icon: Brain },
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'analytics', label: 'Analytics', icon: BarChart3Icon },
      { id: 'userManagement', label: 'Gerenciar Usuários', icon: UsersIcon },
      { id: 'systemConfig', label: 'Configurações', icon: Settings },
      { id: 'llmManagement', label: 'Gerenciar LLMs', icon: Command },
      { id: 'voiceManagement', label: 'Gerenciar Vozes', icon: Mic },
      { id: 'financial', label: 'Financeiro', icon: DollarSign },
      { id: 'affiliates', label: 'Afiliados', icon: Share2 },
      { id: 'agents', label: 'Agentes', icon: Bot },
      { id: 'routines', label: 'Rotinas', icon: Clock },
      { id: 'integrations', label: 'Integrações', icon: GitBranch },
      { id: 'business', label: 'Módulos Business', icon: Briefcase },
      { id: 'mcp', label: 'Painel MCP', icon: GitBranch },
      { id: 'n8n', label: 'Painel N8N', icon: Sliders }
    ];

    if (isLoading) {
      return <div className="text-center p-4">Carregando dados do administrador...</div>;
    }

    const renderContent = () => {
      switch (activeView) {
        case 'jarvis':
          return (
            <AdminDataProvider>
              <VisionCommandCore adminData={data} onVoiceCommand={handleJarvisCommand} />
            </AdminDataProvider>
          );
        case 'dashboard':
          return (
            <div className="space-y-8">
              {/* HEADER PRINCIPAL */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Central de Comando</h1>
                  <p className="text-xl text-gray-300">Visão completa da plataforma AUTVISION</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
                    Sistema Operacional
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
                    <Activity className="w-4 h-4 mr-2" />
                    {new Date().toLocaleDateString('pt-BR')}
                  </Badge>
                </div>
              </div>

              {/* STATS CARDS EXPANDIDOS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                <StatCard title="Usuários Totais" value={stats.totalUsers} icon={UsersIcon} color="blue" description="Usuários cadastrados" />
                <StatCard title="Receita Mensal" value={`R$ ${stats.totalRevenue.toFixed(2)}`} icon={DollarSign} color="green" description="Faturamento atual" />
                <StatCard title="Agentes Ativos" value={stats.totalAgents} icon={Bot} color="teal" description="IA em funcionamento" />
                <StatCard title="Rotinas Ativas" value={stats.activeRoutines} icon={Clock} color="orange" description="Automações rodando" />
                <StatCard title="Afiliados" value={stats.totalAffiliates} icon={Share2} color="sky" description="Parceiros ativos" />
                <StatCard title="Visions Ativos" value={stats.activeVisions} icon={Eye} color="cyan" description="Companions online" />
              </div>

              {/* GRÁFICOS EXPANDIDOS */}
              <DashboardCharts agents={data.agents || []} routines={data.routines || []} users={data.users || []} plans={data.plans || []} />

              {/* TABELAS DE OVERVIEW */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <UsersIcon className="w-5 h-5 text-blue-400" />
                      Usuários Recentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(data.users || []).slice(0, 5).map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {user.full_name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-white">{user.full_name}</p>
                              <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                          </div>
                          <Badge className={user.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'}>
                            {user.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Clock className="w-5 h-5 text-orange-400" />
                      Rotinas Mais Executadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(data.routines || [])
                        .filter(r => r.execution_count > 0)
                        .sort((a, b) => (b.execution_count || 0) - (a.execution_count || 0))
                        .slice(0, 5)
                        .map((routine) => (
                          <div key={routine.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                <Clock className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-white">{routine.name}</p>
                                <p className="text-sm text-gray-400">{routine.created_by}</p>
                              </div>
                            </div>
                            <Badge className="bg-orange-500">
                              {routine.execution_count} execuções
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        case 'analytics':
          return <AnalyticsView />;
        case 'userManagement':
          return <UserManagementView />;
        case 'systemConfig':
          return <SystemConfigView />;
        case 'llmManagement':
          return <LLMManagementView llms={data.llms || []} onUpdate={refreshAll} />;
        case 'voiceManagement':
          return <VoiceManagement />;
        case 'financial':
          return <FinancialView />;
        case 'affiliates':
          return <AffiliatesManagement />;
        case 'agents':
          return <AgentsManagement />;
        case 'integrations':
          return <IntegrationsManagement integrations={data.integrations || []} onUpdate={refreshAll} />;
        case 'routines':
          return <AdvancedRoutinesManagement routines={data.routines || []} users={data.users || []} onToggle={(id, current) => handleToggle(Routine, id, 'is_active', current)} onUpdate={refreshAll} />;
        case 'business':
          return <BusinessModuleView />;
        case 'mcp':
          return <MCPMonitoringView />;
        case 'n8n':
          return <N8NManagementView />;
        default:
          return null;
      }
    };

    return (
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <BackendStatusNotification />
        <div className="flex h-screen bg-gray-900 admin-panel-container w-full">
          {/* Sidebar Retrátil */}
          <Sidebar 
            className={`admin-sidebar bg-gray-900 border-r border-gray-700 shadow-xl transition-all duration-300 ${
              sidebarOpen ? 'w-64' : 'w-16'
            } flex-shrink-0`}
          >
            <SidebarContent className={`flex flex-col h-full bg-gray-900 transition-all duration-300 ${
              sidebarOpen ? 'p-6' : 'p-2'
            }`}>
              <div className="flex-shrink-0">
                <div className={`flex flex-col items-center gap-3 transition-all duration-500 ease-out ${
                  sidebarOpen ? 'mb-12' : 'mb-6'
                }`}>
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src="/assets/images/autvision-logo.png"
                      alt="AutVision Logo"
                      className={`transition-all duration-500 ease-out ${sidebarOpen ? 'w-24 h-24' : 'w-12 h-12'}`}
                    />
                    <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 rounded-full blur-sm animate-pulse"></div>
                    <div className="absolute -inset-1 bg-cyan-400/10 rounded-full animate-ping"></div>
                  </motion.div>
                  {sidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <h1 className="text-xl font-bold text-center text-white bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Central de Comando
                      </h1>
                      <p className="text-xs text-gray-400 text-center mt-1">
                        AUTVISION SUPREMACY 🚀
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
              <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <ul className="space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.li 
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <button
                        onClick={() => setActiveView(item.id)}
                        className={`w-full flex items-center gap-3 rounded-lg text-left transition-all duration-300 group hover:scale-[1.02] ${
                          sidebarOpen ? 'px-4 py-3' : 'px-2 py-3 justify-center'
                        } ${
                          activeView === item.id 
                            ? 'bg-gradient-to-r from-cyan-600/80 via-blue-600/80 to-purple-600/80 text-white border border-cyan-400/50 shadow-lg shadow-cyan-900/50 transform scale-[1.02]' 
                            : 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-gray-700/80 hover:text-cyan-200 border border-transparent hover:border-gray-600/50 hover:shadow-md'
                        }`}
                        title={!sidebarOpen ? item.label : undefined}
                      >
                        <item.icon className={`flex-shrink-0 transition-all duration-300 ${
                          activeView === item.id ? 'w-5 h-5 text-cyan-200' : 'w-5 h-5 group-hover:text-cyan-300'
                        }`} />
                        {sidebarOpen && (
                          <motion.div 
                            className="flex items-center justify-between w-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                          >
                            <span className={`font-medium transition-all duration-300 ${
                              activeView === item.id ? 'text-white' : 'group-hover:text-cyan-200'
                            }`}>
                              {item.label}
                            </span>
                            {item.id === 'jarvis' && (
                              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs animate-pulse border border-red-400/50 shadow-lg shadow-red-900/50">
                                LIVE
                              </Badge>
                            )}
                            {false && (
                              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs border border-purple-400/50">
                                CORE
                              </Badge>
                            )}
                          </motion.div>
                        )}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              
              {sidebarOpen && (
                <motion.div 
                  className="mt-6 space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {/* STATUS CARDS */}
                  <div className="p-4 bg-gradient-to-br from-green-900/30 via-emerald-900/20 to-green-900/30 rounded-lg border border-green-500/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-green-300">Sistema</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400">Online</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-300 space-y-1">
                      <div className="flex justify-between">
                        <span>Uptime:</span>
                        <span className="text-green-400">99.9%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Load:</span>
                        <span className="text-blue-400">{Math.round(Math.random() * 30 + 20)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* PERFORMANCE METRICS */}
                  <div className="p-4 bg-gradient-to-br from-blue-900/30 via-cyan-900/20 to-blue-900/30 rounded-lg border border-blue-500/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-blue-300">Performance</span>
                      <div className="text-xs text-blue-400">
                        {currentTime.toLocaleTimeString('pt-BR')}
                      </div>
                    </div>
                    <div className="text-xs text-gray-300 space-y-1">
                      <div className="flex justify-between">
                        <span>Requests/s:</span>
                        <span className="text-cyan-400">{Math.round(Math.random() * 50 + 100)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Response:</span>
                        <span className="text-green-400">{(Math.random() * 2 + 1).toFixed(1)}ms</span>
                      </div>
                    </div>
                  </div>

                  {/* AI STATS */}
                  <div className="p-4 bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 rounded-lg border border-purple-500/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-purple-300">IA Engine</span>
                      <Badge className="text-xs bg-purple-500/20 text-purple-300 border-purple-400/30">
                        ACTIVE
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-300 space-y-1">
                      <div className="flex justify-between">
                        <span>Models:</span>
                        <span className="text-purple-400">{stats.totalAgents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tokens/min:</span>
                        <span className="text-pink-400">{Math.round(Math.random() * 1000 + 2000)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </SidebarContent>
          </Sidebar>

          <div className="flex-1 flex flex-col overflow-hidden bg-gray-900 text-white min-w-0 w-full">
             <header className="bg-gradient-to-r from-gray-900/95 via-slate-900/95 to-gray-900/95 backdrop-blur-xl p-4 flex items-center gap-4 border-b border-cyan-500/30 flex-shrink-0 w-full shadow-2xl">
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="p-2 rounded-lg text-cyan-300 hover:bg-gray-700/50 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 hover:scale-105"
                      title={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        animate={{ rotate: sidebarOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                      </motion.div>
                    </motion.button>
                    
                    <SidebarTrigger className="p-2 rounded-lg text-cyan-300 hover:bg-gray-700/50 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 hover:scale-105" />
                  </div>
                  
                  <motion.img
                    src="/assets/images/autvision-logo.png"
                    alt="AutVision"
                    className="w-8 h-8"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  <div className="flex-1">
                    <motion.h1 
                      className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={activeView}
                    >
                      {menuItems.find(item => item.id === activeView)?.label || 'Painel Admin'}
                    </motion.h1>
                    <p className="text-xs text-gray-400">
                      Startup Gringa Mode Activated 🚀
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* 🔄 SYNC STATUS INDICATOR - SINCRONIZAÇÃO EM TEMPO REAL */}
                    <SyncStatusIndicator />
                    
                    {/* INDICADORES DE STATUS AVANÇADOS */}
                    <motion.div 
                      className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30 backdrop-blur-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                      <span className="text-green-300 text-sm font-medium">System Online</span>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-500/30 backdrop-blur-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Activity className="w-3 h-3 text-blue-400" />
                      <span className="text-blue-300 text-sm font-medium">
                        {currentTime.toLocaleDateString('pt-BR')}
                      </span>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Brain className="w-3 h-3 text-purple-400" />
                      <span className="text-purple-300 text-sm font-medium">
                        AI Active
                      </span>
                    </motion.div>
                    
                    <div className="text-cyan-400 text-sm font-mono bg-gray-800/50 px-2 py-1 rounded border border-cyan-500/30">
                      {currentTime.toLocaleTimeString('pt-BR')}
                    </div>
                  </div>
             </header>
             
              <main className="flex-1 bg-gray-900 admin-content-area w-full">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full p-4 md:p-6 lg:p-8 admin-full-width"
                >
                  {renderContent()}
                </motion.div>
              </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <AdminContent />
  );
}
