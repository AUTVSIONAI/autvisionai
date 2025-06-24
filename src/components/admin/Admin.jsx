
import React, { useState, useEffect } from "react";
import { useAdminData } from "../AdminDataContext";
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
  TrendingUp,
  Clock,
  DollarSign,
  Brain,
  FileText,
  X,
  Search,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  Briefcase,
  Share2,
  Bot,
  Command,
  Sliders,
  GitBranch,
  BarChart3 as BarChart3Icon,
  Globe,
  Undo2,
  Coins,
  Trophy,
} from "lucide-react";
import { Routine } from "@/api/entities";

// Importa todos os componentes de uma vez
import VisionCommanderCore from "./VisionCommanderCore";
import VisionCoreController from "./VisionCoreController";
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
import ProjectReport from "./ProjectReport";
import StatCard from "./StatCard";
import GamificationAdminPanel from "./GamificationAdminPanel";

export default function Admin() {
  function AdminContent() {
    const { data, isLoading, error, refreshAll } = useAdminData();
    const [activeView, setActiveView] = useState('jarvis');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
      document.title = "OPERAÇÃO FUSÃO TOTAL: Vision Commander + 8 Agentes Visuais Orbitantes";
      
      const root = window.document.documentElement;
      root.classList.remove('light');
      root.classList.add('dark');

      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
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

    // FUNÇÃO PARA CALCULAR ESTATÍSTICAS COM PROTEÇÃO
    const getStats = () => {
      if (!data || !data.users || !data.visions || !data.agents || !data.routines || !data.plans || !data.affiliates) {
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
        totalUsers: data.users.length,
        activeVisions: data.visions.filter(v => v.status === 'active').length,
        totalAgents: data.agents.length,
        activeRoutines: data.routines.filter(r => r.is_active).length,
        totalRevenue: data.users.reduce((sum, user) => {
          const userPlan = data.plans.find(p => p.id === user.plan_id);
          return sum + (userPlan?.price || 0);
        }, 0),
        totalAffiliates: data.affiliates.length
      };
    };

    const stats = getStats();

    // Função para lidar com comandos do JARVIS
    const handleJarvisCommand = (command) => {
      console.log('JARVIS executando comando:', command);
      if (command.toLowerCase().includes('recarregar')) {
        refreshAll();
      }
    };

    // MENU LIMPO E DEFINITIVO - SEM ITENS EXTERNOS
    const menuItems = [
      { id: 'jarvis', label: 'Vision Command', icon: Brain },
      { id: 'visionCore', label: 'Vision Core Master', icon: Eye },
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'analytics', label: 'Analytics', icon: BarChart3Icon },
      { id: 'userManagement', label: 'Gerenciar Usuários', icon: UsersIcon },
      { id: 'systemConfig', label: 'Configurações', icon: Settings },
      { id: 'llmManagement', label: 'Gerenciar LLMs', icon: Command },
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

    if (error) {
      return <div className="text-center p-4 text-red-500">Erro ao carregar dados: {error.message}</div>;
    }

    const renderContent = () => {
      switch (activeView) {
        case 'jarvis':
          return <VisionCommanderCore adminData={data} onVoiceCommand={handleJarvisCommand} />;
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
                      {(data.users || []).slice(0, 5).map((user, index) => (
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
                        .map((routine, index) => (
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
      <SidebarProvider defaultOpen={false}>
        <div className="flex h-screen">
          <Sidebar className="admin-sidebar w-64 bg-slate-900 text-white">
            <SidebarContent className="p-6 flex flex-col h-full">
              <div className="flex-shrink-0">
                <div className="flex flex-col items-center gap-3 mb-12">
                  <div className="relative">
                    <img
                      src="/assets/images/autvision-logo.png"
                      alt="AutVision Logo"
                      className="w-24 h-24"
                    />
                    <div className="absolute -inset-2 bg-cyan-400/20 rounded-full blur-sm animate-pulse"></div>
                  </div>
                  <h1 className="text-xl font-bold text-center admin-header-text">
                    Central de Comando
                  </h1>
                </div>
              </div>
              <nav className="flex-1 overflow-y-auto">
                <ul className="space-y-2">
                  {menuItems.map(item => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveView(item.id)}
                        className={`admin-menu-button w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                          activeView === item.id ? 'bg-slate-700/70 text-cyan-300 border border-cyan-400/50 shadow-lg shadow-cyan-900/30' : 'text-gray-300 hover:bg-slate-800/50 hover:text-cyan-200'
                        } transition-all duration-200`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {item.id === 'jarvis' && (
                          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs ml-auto animate-pulse border border-red-400/50">
                            LIVE
                          </Badge>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-slate-800/50 to-blue-900/50 rounded-lg border border-cyan-500/20">
                <div className="flex items-center gap-2 text-cyan-300 text-sm">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span>Sistema Operacional</span>
                </div>
              </div>
            </SidebarContent>
          </Sidebar>

          <div className="flex-1 flex flex-col overflow-hidden bg-gray-900 text-white">
             <header className="bg-gradient-to-r from-slate-900/90 to-blue-950/90 backdrop-blur-md p-4 flex items-center gap-4 border-b border-cyan-500/30">
                  <SidebarTrigger className="p-2 rounded-lg text-cyan-300 hover:bg-slate-700/50 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-200" />
                  <img
                    src="/assets/images/autvision-logo.png"
                    alt="AutVision"
                    className="w-8 h-8"
                  />
                  <h1 className="text-lg font-bold admin-header-text">
                    {menuItems.find(item => item.id === activeView)?.label || 'Painel Admin'}
                  </h1>
                  
                  <div className="flex items-center gap-3 ml-auto">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-300 text-sm font-medium">Online</span>
                    </div>
                    <div className="text-cyan-400 text-sm">
                      {currentTime.toLocaleTimeString('pt-BR')}
                    </div>
                  </div>
             </header>
             
              <main className="flex-1 p-4 md:p-8 overflow-auto">
                <div className="max-w-full mx-auto w-full">
                  <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full bg-gray-800/50 p-6 rounded-lg shadow-md border border-gray-700"
                  >
                  {renderContent()}
                  </motion.div>
                </div>
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
