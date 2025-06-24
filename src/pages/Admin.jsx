import React, { useState, useEffect } from "react";
import { VisionCompanion } from "@/api/entities";
import { Agent } from "@/api/entities";
import { Routine } from "@/api/entities";
import { Integration } from "@/api/entities";
import { User } from "@/api/entities";
import { Plan } from "@/api/entities";
import { Affiliate } from "@/api/entities";
import { VisionAdmin } from "@/api/entities";
import { LLMConfig } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import DashboardCharts from "../components/admin/DashboardCharts";
import UserManagementView from "../components/admin/UserManagementView";
import SystemConfigView from "../components/admin/SystemConfigView";
import FinancialView from "../components/admin/FinancialView";
import IntegrationsManagement from "../components/admin/IntegrationsManagement";
import VisionAdminCore from "../components/admin/VisionAdminCore";
import BusinessModuleView from "../components/admin/BusinessModuleView";
import MCPMonitoringView from "../components/admin/MCPMonitoringView";
import N8NManagementView from "../components/admin/N8NManagementView";
import AgentsManagement from "../components/admin/AgentsManagement";
import VisionCommandNew from "../components/admin/VisionCommandNew";
import VisionCommanderCore from "../components/admin/VisionCommanderCore";
import LLMManagementView from "../components/admin/LLMManagementView";
import AffiliatesManagement from "../components/admin/AffiliatesManagement";
import AnalyticsView from "../components/admin/AnalyticsView";
import VisionCoreController from "../components/admin/VisionCoreController";

import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
} from "lucide-react";

import { AdminDataProvider, useAdminData } from "../components/AdminDataContext";

// COMPONENTE PRINCIPAL QUE ENVOLVE TUDO COM O PROVIDER
export default function Admin() {
  return (
    <AdminDataProvider>
      {/* DIV PAI COM ID PARA FORÇAR ESTILOS */}
      <div id="admin-panel">
        {/* CSS AGRESSIVO COM !IMPORTANT PARA GARANTIR CORES */}
        <style>{`
          /* Estilo AGRESSIVO para o painel admin com !important */
          #admin-panel {
            background: linear-gradient(135deg, #020617 0%, #030d30 50%, #020617 100%) !important;
            color: #e2e8f0 !important;
          }
          #admin-panel * {
            border-color: rgba(56, 189, 248, 0.2) !important;
          }
          /* Força a cor do sidebar e seus filhos */
          #admin-panel .admin-sidebar, #admin-panel .admin-sidebar * {
            color: #e2e8f0 !important;
          }
          #admin-panel .admin-sidebar {
            background: linear-gradient(180deg, rgba(2, 6, 23, 0.9) 0%, rgba(3, 7, 18, 0.95) 100%) !important;
            backdrop-filter: blur(10px) !important;
          }
          /* Estilo para botão de menu ATIVO */
          #admin-panel .admin-menu-button {
             transition: all 0.2s ease-in-out !important;
          }
          #admin-panel .admin-menu-button.active {
            background: linear-gradient(90deg, #1e40af 0%, #0ea5e9 100%) !important;
            color: white !important;
            box-shadow: 0 0 15px rgba(14, 165, 233, 0.3) !important;
          }
          #admin-panel .admin-menu-button.active .lucide {
             color: white !important;
          }
          /* Estilo para botão de menu INATIVO */
          #admin-panel .admin-menu-button.inactive:hover {
            background: rgba(30, 58, 138, 0.5) !important;
          }
          #admin-panel .admin-menu-button.inactive .lucide {
             color: #94a3b8 !important;
          }
           #admin-panel .admin-menu-button.inactive:hover .lucide {
             color: #38bdf8 !important;
          }
        `}</style>
        <AdminContent />
      </div>
    </AdminDataProvider>
  );
}

// COMPONENTE INTERNO QUE USA O CONTEXTO
function AdminContent() {
  const { data, isLoading, error, refreshAll } = useAdminData();
  const [activeView, setActiveView] = useState('jarvis');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    document.title = "OPERAÇÃO FUSÃO TOTAL: Vision Commander + 8 Agentes Visuais Orbitantes";
    
    // FORÇA O TEMA ESCURO NO PAINEL ADMIN
    const root = window.document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // AÇÕES FUNCIONAIS EM TEMPO REAL
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

  // Helper to create external URLs
  const createPageUrl = (pageName) => {
    const baseUrl = window.location.origin;
    switch (pageName) {
      case 'ClientDashboard':
        return `${baseUrl}/dashboard`;
      case 'LandingPage':
        return `${baseUrl}/`;
      default:
        return '#';
    }
  };

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
    { id: 'n8n', label: 'Painel N8N', icon: Sliders },
    { id: 'report', label: 'Relatório do Projeto', icon: FileText },
    // ATALHOS EXTERNOS
    { id: 'clientDashboardLink', label: 'Painel Cliente', icon: Undo2, url: createPageUrl('ClientDashboard'), external: true },
    { id: 'landingPageLink', label: 'Ver Landing Page', icon: Globe, url: createPageUrl('LandingPage'), external: true },
  ];

  // Função para lidar com comandos do JARVIS
  const handleJarvisCommand = (command) => {
    console.log('JARVIS executando comando:', command);
    if (command.toLowerCase().includes('recarregar')) {
      refreshAll();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando Central de Comando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      case 'report':
        return <ProjectReport />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen">
        {/* Sidebar Responsivo do Admin */}
        <Sidebar className="admin-sidebar w-64">
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
                      onClick={() => {
                        if (item.external) {
                          window.open(item.url, '_blank');
                        } else {
                          setActiveView(item.id);
                        }
                      }}
                      className={`admin-menu-button w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                        activeView === item.id ? 'active' : 'inactive'
                      }`}
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
            
            {/* Footer com efeito especial */}
            <div className="mt-6 p-4 bg-gradient-to-r from-slate-800/50 to-blue-900/50 rounded-lg border border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-300 text-sm">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span>Sistema Operacional</span>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Conteúdo Principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
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
                
                {/* Status indicators no header */}
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
              <div className="max-w-7xl mx-auto w-full">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
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

// Sub-componentes para organização
const StatCard = ({ title, value, icon: Icon, color, description }) => {
  const colors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    teal: 'text-teal-400',
    orange: 'text-orange-400',
    cyan: 'text-cyan-400',
    sky: 'text-sky-400',
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Icon className={`w-8 h-8 ${colors[color]}`} />
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-300 mb-1">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// NOVA PÁGINA DE ROTINAS ADMIN UPGRADE TOTAL
const AdvancedRoutinesManagement = ({ routines, users, onToggle, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [triggerFilter, setTriggerFilter] = useState('all');

  const filteredRoutines = routines.filter(routine => {
    const matchesSearch = routine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         routine.created_by.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? routine.is_active : !routine.is_active);
    const matchesTrigger = triggerFilter === 'all' || routine.trigger_type === triggerFilter;
    return matchesSearch && matchesStatus && matchesTrigger;
  });

  const stats = {
    total: routines.length,
    active: routines.filter(r => r.is_active).length,
    totalExecutions: routines.reduce((sum, r) => sum + (r.execution_count || 0), 0),
    avgExecutions: routines.length > 0 ? (routines.reduce((sum, r) => sum + (r.execution_count || 0), 0) / routines.length).toFixed(1) : 0
  };

  const getTriggerIcon = (type) => {
    switch (type) {
      case 'time': return Clock;
      case 'voice': return Brain;
      case 'event': return GitBranch;
      default: return Settings;
    }
  };

  const getTriggerColor = (type) => {
    switch (type) {
      case 'time': return 'bg-blue-500';
      case 'voice': return 'bg-green-500';
      case 'event': return 'bg-purple-500';
      case 'manual': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header com Stats */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Gerenciamento de Rotinas</h1>
          <p className="text-gray-400">Automações inteligentes dos usuários da plataforma</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total de Rotinas</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Rotinas Ativas</p>
                <p className="text-2xl font-bold text-white">{stats.active}</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Execuções</p>
                <p className="text-2xl font-bold text-white">{stats.totalExecutions}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Média Execuções</p>
                <p className="text-2xl font-bold text-white">{stats.avgExecutions}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Filtros Avançados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Buscar rotina ou usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="inactive">Inativas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={triggerFilter} onValueChange={setTriggerFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Tipo de Gatilho" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                <SelectItem value="all">Todos os Gatilhos</SelectItem>
                <SelectItem value="time">Tempo</SelectItem>
                <SelectItem value="voice">Voz</SelectItem>
                <SelectItem value="event">Evento</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
              <Clock className="w-4 h-4 mr-2" />
              Executar Agora
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Routines Table */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Rotinas dos Usuários ({filteredRoutines.length})
            </span>
            <Badge className="bg-orange-500 text-white">
              {stats.active} Ativas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-white">Rotina</TableHead>
                  <TableHead className="text-white">Usuário</TableHead>
                  <TableHead className="text-white">Gatilho</TableHead>
                  <TableHead className="text-white">Ações</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Execuções</TableHead>
                  <TableHead className="text-white">Última Execução</TableHead>
                  <TableHead className="text-white">Controles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoutines.map((routine) => {
                  const TriggerIcon = getTriggerIcon(routine.trigger_type);
                  return (
                    <TableRow key={routine.id} className="border-gray-700 hover:bg-gray-700/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTriggerColor(routine.trigger_type)}`}>
                            <TriggerIcon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{routine.name}</p>
                            <p className="text-sm text-gray-400">{routine.description || 'Sem descrição'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{routine.created_by}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-gray-500 text-gray-300 capitalize">
                            {routine.trigger_type}
                          </Badge>
                          {routine.trigger_value && (
                            <span className="text-xs text-gray-400">{routine.trigger_value}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {routine.actions?.slice(0, 2).map((action, idx) => (
                            <Badge key={idx} className="bg-blue-500/20 text-blue-300 text-xs">
                              {action.agent_type}
                            </Badge>
                          ))}
                          {routine.actions?.length > 2 && (
                            <Badge variant="outline" className="text-xs border-gray-500 text-gray-400">
                              +{routine.actions.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={routine.is_active}
                          onCheckedChange={() => onToggle(routine.id, routine.is_active)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{routine.execution_count || 0}</span>
                          {(routine.execution_count || 0) > 10 && (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        {routine.last_executed
                          ? new Date(routine.last_executed).toLocaleDateString('pt-BR')
                          : 'Nunca'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                            <Bot className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ProjectReport = () => {
  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Relatório Técnico do Projeto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-gray-300">
        <p>
          Este é um relatório técnico detalhado sobre o estado e a arquitetura do projeto atual.
          Aqui você encontrará informações cruciais sobre o desempenho, a estrutura de dados,
          componentes-chave e a saúde geral do sistema.
        </p>
        <h3 className="text-xl font-semibold text-white mt-6">Seções do Relatório:</h3>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li><strong>Visão Geral da Arquitetura:</strong> Diagramas e descrições dos principais módulos e suas interações.</li>
          <li><strong>Estatísticas de Uso:</strong> Dados sobre o uso da plataforma por usuários, agentes e rotinas.</li>
          <li><strong>Desempenho da API:</strong> Métricas de latência e taxa de sucesso para endpoints críticos.</li>
          <li><strong>Segurança:</strong> Resumo das auditorias de segurança e conformidade.</li>
          <li><strong>Deployments e Infraestrutura:</strong> Informações sobre ambientes, pipelines de CI/CD e recursos de nuvem.</li>
          <li><strong>Roadmap de Desenvolvimento:</strong> Próximos passos e funcionalidades planejadas.</li>
          <li><strong>Manutenção e Suporte:</strong> Procedimentos de rotina e planos de contingência.</li>
        </ul>
        <p className="mt-6">
          Para acessar o relatório completo e interativo, por favor, utilize o painel administrativo adequado
          ou entre em contato com a equipe de engenharia. Esta seção serve como um portal de acesso e
          um resumo das informações disponíveis.
        </p>
        <Button className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white">
          Gerar Relatório Completo (Funcionalidade Futura)
        </Button>
      </CardContent>
    </Card>
  );
};