import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity, 
  Clock, 
  DollarSign,
  Zap,
  Eye,
  RefreshCw,
  Download,
  Calendar,
  Target,
  Gauge
} from "lucide-react";
import { useAdminData } from "../AdminDataContext";
import PerformanceMetrics from "./analytics/PerformanceMetrics";
import UserAnalytics from "./analytics/UserAnalytics";
import RevenueAnalytics from "./analytics/RevenueAnalytics";
import RealTimeMetrics from "./analytics/RealTimeMetrics";
import { Analytics } from "@/api/entities";

export default function AnalyticsView() {
  const { data } = useAdminData();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simular carregamento de dados analíticos
      // Em produção, isso viria do banco de dados
      const mockAnalytics = generateMockAnalytics();
      setAnalyticsData(mockAnalytics);
    } catch (error) {
      console.error("Erro ao carregar analytics:", error);
    }
    setIsLoading(false);
  };

  const generateMockAnalytics = () => {
    // Gerar dados mock para demonstração
    const events = ['user_login', 'agent_usage', 'routine_execution', 'payment'];
    const data = [];
    
    for (let i = 0; i < 100; i++) {
      data.push({
        id: `analytics_${i}`,
        event_type: events[Math.floor(Math.random() * events.length)],
        user_email: `user${Math.floor(Math.random() * 50)}@example.com`,
        created_date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        value: Math.floor(Math.random() * 1000),
        success: Math.random() > 0.1,
        response_time: Math.floor(Math.random() * 2000) + 100
      });
    }
    
    return data;
  };

  const getKPIs = () => {
    if (!data || !analyticsData) return {};

    const totalUsers = data.users?.length || 0;
    const activeUsers = analyticsData.filter(a => 
      a.event_type === 'user_login' && 
      new Date(a.created_date) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length;

    const totalAgentUsage = analyticsData.filter(a => a.event_type === 'agent_usage').length;
    const avgResponseTime = analyticsData
      .filter(a => a.response_time)
      .reduce((sum, a) => sum + a.response_time, 0) / 
      (analyticsData.filter(a => a.response_time).length || 1);

    const successRate = (analyticsData.filter(a => a.success).length / (analyticsData.length || 1)) * 100;
    
    const totalRevenue = data.users?.reduce((sum, user) => {
      const userPlan = data.plans?.find(p => p.id === user.plan_id);
      return sum + (userPlan?.price || 0);
    }, 0) || 0;

    return {
      totalUsers,
      activeUsers,
      totalAgentUsage,
      avgResponseTime: Math.round(avgResponseTime),
      successRate: Math.round(successRate),
      totalRevenue,
      conversionRate: ((data.users?.length || 0) / Math.max(totalUsers * 3, 1) * 100).toFixed(1)
    };
  };

  const kpis = getKPIs();

  const kpiCards = [
    {
      title: "Usuários Totais",
      value: kpis.totalUsers,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      change: "+12.5%"
    },
    {
      title: "Usuários Ativos (24h)",
      value: kpis.activeUsers,
      icon: Activity,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      change: "+8.2%"
    },
    {
      title: "Uso de Agentes",
      value: kpis.totalAgentUsage,
      icon: Zap,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      change: "+24.1%"
    },
    {
      title: "Tempo Médio Resposta",
      value: `${kpis.avgResponseTime}ms`,
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      change: "-5.3%"
    },
    {
      title: "Taxa de Sucesso",
      value: `${kpis.successRate}%`,
      icon: Target,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      change: "+2.1%"
    },
    {
      title: "Receita Total",
      value: `R$ ${kpis.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      change: "+18.7%"
    },
    {
      title: "Taxa Conversão",
      value: `${kpis.conversionRate}%`,
      icon: TrendingUp,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      change: "+6.4%"
    },
    {
      title: "Score Performance",
      value: "94/100",
      icon: Gauge,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      change: "+1.2%"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Central de Analytics</h1>
            <p className="text-gray-400">Métricas avançadas e insights estratégicos da plataforma</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white">
              <SelectItem value="1d">Hoje</SelectItem>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={loadAnalyticsData} variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${kpi.bgColor} rounded-lg flex items-center justify-center`}>
                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                    {kpi.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white mb-1">{kpi.value}</p>
                  <p className="text-xs text-gray-400">{kpi.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            <Eye className="w-4 h-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
            <Users className="w-4 h-4 mr-2" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600">
            <Gauge className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="revenue" className="data-[state=active]:bg-blue-600">
            <DollarSign className="w-4 h-4 mr-2" />
            Receita
          </TabsTrigger>
          <TabsTrigger value="realtime" className="data-[state=active]:bg-blue-600">
            <Activity className="w-4 h-4 mr-2" />
            Tempo Real
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Atividade dos Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Gráfico de atividade será implementado</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Performance dos Agentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Métricas de agentes serão implementadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UserAnalytics analyticsData={analyticsData} users={data.users || []} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceMetrics analyticsData={analyticsData} />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueAnalytics />
        </TabsContent>

        <TabsContent value="realtime">
          <RealTimeMetrics />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}