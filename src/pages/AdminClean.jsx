/**
 * 🔥 ADMIN PANEL - MARCHA EVOLUÇÃO 10.0 LIMPO
 * Painel de administração integrado com Layout principal - SEM SOBREPOSIÇÃO
 */

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import DashboardCharts from "../components/admin/DashboardCharts";
import UserManagementView from "../components/admin/UserManagementView";
import SystemConfigView from "../components/admin/SystemConfigView";
import FinancialView from "../components/admin/FinancialView";
import IntegrationsManagement from "../components/admin/IntegrationsManagement";
import BusinessModuleView from "../components/admin/BusinessModuleView";
import MCPMonitoringView from "../components/admin/MCPMonitoringView";
import N8NManagementView from "../components/admin/N8NManagementView";
import AgentsManagement from "../components/admin/AgentsManagement";
import VisionCommandNew from "../components/admin/VisionCommandNew";
import LLMManagementView from "../components/admin/LLMManagementView";
import AffiliatesManagement from "../components/admin/AffiliatesManagement";
import AnalyticsView from "../components/admin/AnalyticsView";
import VisionCoreController from "../components/admin/VisionCoreController";
import AdvancedRoutinesManagement from "../components/admin/AdvancedRoutinesManagement";
import StatCard from "../components/admin/StatCard";
import { AdminDataProvider } from "../components/AdminDataContext";

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
} from "lucide-react";

// Componente Principal do Admin
function AdminContent() {
  const [activeView, setActiveView] = useState('dashboard');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

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
    { id: 'visionCore', label: 'Vision Core Master', icon: Eye },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'userManagement', label: 'Usuários', icon: UsersIcon },
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
  ];

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando Central de Comando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
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
        return <VisionCommandNew adminData={data} onVoiceCommand={handleJarvisCommand} />;
      case 'visionCore':
        return <VisionCoreController />;
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
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Admin Navigation Tabs */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Admin Content */}
      <div className="flex-1 overflow-auto p-6">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
}

// Componente wrapper com contexto
export default function Admin() {
  return (
    <AdminDataProvider>
      <AdminContent />
    </AdminDataProvider>
  );
}
