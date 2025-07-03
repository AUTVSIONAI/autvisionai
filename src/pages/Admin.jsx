/**
 * 🔥 ADMIN PANEL - MARCHA EVOLUÇÃO 10.0 ISOLADO
 * Painel de administração ISOLADO com seu próprio layout completo
 */

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Crown } from "lucide-react";
import { ToastProvider } from "@/components/ui/toast";
import SystemStatus from "@/components/system/SystemStatus";
import ErrorBoundary from "@/components/ErrorBoundary";

import DashboardCharts from "../components/admin/DashboardCharts";
import UserManagementView from "../components/admin/UserManagementView";
import SystemConfigView from "../components/admin/SystemConfigView";
import FinancialView from "../components/admin/FinancialView";
import IntegrationsManagement from "../components/admin/IntegrationsManagement";
import BusinessModuleView from "../components/admin/BusinessModuleView";
import MCPMonitoringView from "../components/admin/MCPMonitoringView";
import N8NManagementView from "../components/admin/N8NManagementView";
import AgentsManagement from "../components/admin/AgentsManagement";
import VisionCommandCore from "../components/admin/VisionCommandCore";
// import VisionManagement from "../components/admin/VisionManagement"; // REMOVIDO - VisionCommandCore já faz isso melhor!
import { AdminDataProvider } from "../components/admin/AdminDataContext";
import LLMManagementView from "../components/admin/LLMManagementView";
import AffiliatesManagement from "../components/admin/AffiliatesManagement";
import AnalyticsView from "../components/admin/AnalyticsView";

import AdvancedRoutinesManagement from "../components/admin/AdvancedRoutinesManagement";
import StatCard from "../components/admin/StatCard";
import GamificationAdminPanel from "../components/admin/GamificationAdminPanel";

import {
  LayoutDashboard,
  Users as UsersIcon,
  Settings,
  Eye,
  TrendingUp,
  Clock,
  DollarSign,
  Brain,
  Activity,
  Bot,
  Share2,
  BarChart3,
  Menu,
  X,
  Trophy,
} from "lucide-react";

// Componente Principal do Admin ISOLADO
function AdminContent() {
  const { user, profile, signOut } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Timer para atualizar o relógio
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Carregar dados do admin
  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setIsLoading(true);
        // Simular carregamento de dados
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data para desenvolvimento
        const mockData = {
          users: [],
          agents: [],
          routines: [],
          visions: [],
          plans: [],
          affiliates: [],
          integrations: [],
          llms: []
        };
        
        setData(mockData);
      } catch (err) {
        console.error('Erro ao carregar dados do admin:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const refreshAll = () => {
    window.location.reload();
  };

  const handleJarvisCommand = (command) => {
    console.log('JARVIS executando comando:', command);
    if (command.toLowerCase().includes('recarregar')) {
      refreshAll();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  // Calcular estatísticas
  const getStats = () => {
    if (!data) {
      return {
        totalUsers: 0,
        totalRevenue: 0,
        totalAgents: 0,
        activeRoutines: 0,
        totalAffiliates: 0,
        activeVisions: 0
      };
    }

    return {
      totalUsers: data.users?.length || 0,
      activeVisions: data.visions?.filter(v => v.status === 'active').length || 0,
      totalAgents: data.agents?.length || 0,
      activeRoutines: data.routines?.filter(r => r.is_active).length || 0,
      totalRevenue: data.users?.reduce((sum, user) => {
        const userPlan = data.plans?.find(p => p.id === user.plan_id);
        return sum + (userPlan?.price || 0);
      }, 0) || 0,
      totalAffiliates: data.affiliates?.length || 0
    };
  };

  const stats = getStats();

  // Menu items do admin
  const menuItems = [
    { id: 'jarvis', label: 'Vision Command', icon: Brain },
    
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'userManagement', label: 'Usuários', icon: UsersIcon },
    // { id: 'visions', label: 'Visions', icon: Eye }, // REMOVIDO - VisionCommandCore já faz isso!
    { id: 'systemConfig', label: 'Sistema', icon: Settings },
    { id: 'llmManagement', label: 'LLM Config', icon: Brain },
    { id: 'financial', label: 'Financeiro', icon: DollarSign },
    { id: 'affiliates', label: 'Afiliados', icon: Share2 },
    { id: 'agents', label: 'Agentes', icon: Bot },
    { id: 'integrations', label: 'Integrações', icon: Activity },
    { id: 'routines', label: 'Rotinas', icon: Clock },
    { id: 'business', label: 'Business', icon: TrendingUp },
    { id: 'mcp', label: 'MCP Monitor', icon: Activity },
    { id: 'n8n', label: 'N8N Manager', icon: Activity },
    { id: 'gamification', label: 'Gamificação', icon: Trophy },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando Central de Comando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Erro ao carregar dados</div>
          <p className="text-gray-400 mb-4">{error.message || 'Ocorreu um erro desconhecido.'}</p>
          <Button onClick={refreshAll} className="bg-blue-600 hover:bg-blue-700">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'jarvis':
        return <VisionCommandCore adminData={data} onVoiceCommand={handleJarvisCommand} />;

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
                  {currentTime.toLocaleDateString('pt-BR')}
                </Badge>
              </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <StatCard title="Usuários Totais" value={stats.totalUsers} icon={UsersIcon} color="blue" description="Usuários cadastrados" />
              <StatCard title="Receita Mensal" value={`R$ ${stats.totalRevenue.toFixed(2)}`} icon={DollarSign} color="green" description="Faturamento atual" />
              <StatCard title="Agentes Ativos" value={stats.totalAgents} icon={Bot} color="teal" description="IA em funcionamento" />
              <StatCard title="Rotinas Ativas" value={stats.activeRoutines} icon={Clock} color="orange" description="Automações rodando" />
              <StatCard title="Afiliados" value={stats.totalAffiliates} icon={Share2} color="sky" description="Parceiros ativos" />
              <StatCard title="Visions Ativos" value={stats.activeVisions} icon={Eye} color="cyan" description="Companions online" />
            </div>

            {/* GRÁFICOS */}
            <DashboardCharts 
              agents={data.agents || []} 
              routines={data.routines || []} 
              users={data.users || []} 
              plans={data.plans || []} 
            />
          </div>
        );
      case 'analytics':
        return <AnalyticsView />;
      case 'userManagement':
        return <UserManagementView />;
      // case 'visions': REMOVIDO - VisionCommandCore já faz isso melhor!
      //   return <VisionManagement />;
      case 'systemConfig':
        return <SystemConfigView />;
      case 'llmManagement':
        return <LLMManagementView llms={data.llms || []} onUpdate={refreshAll} />;
      case 'financial':
        return <FinancialView />;
      case 'affiliates':
        return <AffiliatesManagement />;
      case 'agents':
        return <AgentsManagement />;
      case 'integrations':
        return <IntegrationsManagement integrations={data.integrations || []} onUpdate={refreshAll} />;
      case 'routines':
        return <AdvancedRoutinesManagement routines={data.routines || []} onToggle={() => {}} />;
      case 'business':
        return <BusinessModuleView />;
      case 'mcp':
        return <MCPMonitoringView />;
      case 'n8n':
        return <N8NManagementView />;
      case 'gamification':
        return <GamificationAdminPanel />;
      default:
        return null;
    }
  };

  return (
    <ToastProvider>
      <SystemStatus />
      <div className="min-h-screen bg-gray-950 flex">
        {/* SIDEBAR LATERAL RETRÁTIL */}
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: sidebarCollapsed ? -280 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`fixed left-0 top-0 h-full bg-gray-900/95 backdrop-blur-sm border-r border-gray-800 z-50 overflow-y-auto flex flex-col transition-all duration-300 ${
            sidebarCollapsed ? 'w-0' : 'w-72'
          }`}
        >
          {!sidebarCollapsed && (
            <>
              {/* HEADER DA SIDEBAR */}
              <div className="p-4 border-b border-gray-800">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <img
                    src="/assets/images/autvision-logo.png"
                    alt="AutVision"
                    className="w-10 h-10"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-white">AutVision Admin</h2>
                    <p className="text-xs text-gray-400">Central de Comando</p>
                  </div>
                </Link>
                <Crown className="w-6 h-6 text-yellow-400 absolute top-4 right-4" />
              </div>

              {/* INFO DO ADMIN NA SIDEBAR */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {profile?.full_name || user?.email || 'Admin'}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
                        ADMIN
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MENU LATERAL */}
              <nav className="flex-1 p-4">
                <div className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                          isActive 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>

              {/* FOOTER DA SIDEBAR */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400">
                    {currentTime.toLocaleTimeString('pt-BR')}
                  </span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
                    Online
                  </Badge>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair do Admin
                </Button>
              </div>
            </>
          )}
        </motion.aside>

        {/* CONTEÚDO PRINCIPAL */}
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-72'}`}>
          {/* HEADER SUPERIOR FIXO */}
          <header className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4 z-40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* BOTÃO TOGGLE SIDEBAR */}
                <Button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </Button>
                
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {menuItems.find(item => item.id === activeView)?.label || 'Admin Panel'}
                  </h1>
                  <p className="text-sm text-gray-400">
                    Controle total da plataforma AutVision
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <Activity className="w-4 h-4 mr-2" />
                  {currentTime.toLocaleDateString('pt-BR')}
                </Badge>
                <Button
                  onClick={refreshAll}
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Atualizar
                </Button>
              </div>
            </div>
          </header>

          {/* CONTEÚDO */}
          <main className="p-6">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

// Componente wrapper com contexto
export default function Admin() {
  return (
    <ErrorBoundary>
      <AdminDataProvider>
        <AdminContent />
      </AdminDataProvider>
    </ErrorBoundary>
  );
}
