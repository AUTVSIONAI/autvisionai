
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Wallet as WalletIcon,
  PieChart,
  BarChart3,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  RefreshCw,
  Coins,
  Share2
} from "lucide-react";

// Componentes específicos do painel financeiro
import RevenueOverview from "./financial/RevenueOverview";
import TransactionsTable from "./financial/TransactionsTable";
import PaymentGateways from "./financial/PaymentGateways";
import WalletManagement from "./financial/WalletManagement";
import PlansManagement from "./PlansManagement";
import AffiliatesManagement from "./AffiliatesManagement";
import FinancialCharts from "./financial/FinancialCharts";
import TokenManagementView from "./TokenManagementView"; // New component for token management

export default function FinancialView() {
  const [activeTab, setActiveTab] = useState("overview");
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalTransactions: 0,
    activeSubscriptions: 0,
    pendingPayments: 0,
    refundRequests: 0,
    totalTokensDistributed: 0, // New financial data point
    affiliateCommissions: 0   // New financial data point
  });
  const [isLoading, setIsLoading] = useState(true);

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configSettings, setConfigSettings] = useState({
    currency: 'BRL',
    taxRate: 5.0,
    autoReports: true,
    emailAlerts: true
  });

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    setIsLoading(true);
    try {
      // Simular carregamento de dados financeiros
      // Em produção, isso viria de APIs reais
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFinancialData({
        totalRevenue: 125430.50,
        monthlyRevenue: 23890.75,
        totalTransactions: 1247,
        activeSubscriptions: 892,
        pendingPayments: 23,
        refundRequests: 5,
        totalTokensDistributed: 150000, // Sample data for tokens
        affiliateCommissions: 7500.00   // Sample data for affiliate commissions
      });
    } catch (error) {
      console.error("Erro ao carregar dados financeiros:", error);
    }
    setIsLoading(false);
  };

  const handleSaveConfiguration = () => {
    // Implementar salvamento das configurações
    console.log('Salvando configurações:', configSettings);
    alert('Configurações salvas com sucesso!');
    setShowConfigModal(false);
  };

  const statCards = [
    {
      title: "Receita Total",
      value: `R$ ${financialData.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      change: "+12.5%",
      changeType: "positive"
    },
    {
      title: "Receita Mensal",
      value: `R$ ${financialData.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      change: "+8.2%",
      changeType: "positive"
    },
    {
      title: "Transações",
      value: financialData.totalTransactions.toLocaleString('pt-BR'),
      icon: CreditCard,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      change: "+15.3%",
      changeType: "positive"
    },
    {
      title: "Assinaturas Ativas",
      value: financialData.activeSubscriptions.toLocaleString('pt-BR'),
      icon: Users,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      change: "+5.7%",
      changeType: "positive"
    },
    { // New stat card for Tokens
      title: "Tokens Distribuídos",
      value: financialData.totalTokensDistributed?.toLocaleString('pt-BR') || "0",
      icon: Coins,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      change: "+25.3%",
      changeType: "positive"
    },
    { // New stat card for Affiliate Commissions
      title: "Comissões Afiliados",
      value: `R$ ${(financialData.affiliateCommissions || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: Share2,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      change: "+18.9%",
      changeType: "positive"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="admin-full-width space-y-6 w-full max-w-none overflow-hidden"
    >
      {/* Header Responsivo */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-100">Centro Financeiro</h1>
            <p className="text-gray-400 text-sm lg:text-base">Gestão completa de receitas, pagamentos e carteiras</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:ml-auto">
          <Button 
            onClick={loadFinancialData} 
            variant="outline" 
            className="border-gray-600 text-white hover:bg-gray-700 w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button
            onClick={() => setShowConfigModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 w-full sm:w-auto"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Modal de Configurações */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-white mb-4">Configurações Financeiras</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Moeda</label>
                <select
                  value={configSettings.currency}
                  onChange={(e) => setConfigSettings({...configSettings, currency: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                >
                  <option value="BRL">Real (BRL)</option>
                  <option value="USD">Dólar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Taxa de Sistema (%)</label>
                <input
                  type="number"
                  value={configSettings.taxRate}
                  onChange={(e) => setConfigSettings({...configSettings, taxRate: parseFloat(e.target.value)})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={configSettings.autoReports}
                    onChange={(e) => setConfigSettings({...configSettings, autoReports: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-gray-300">Relatórios Automáticos</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={configSettings.emailAlerts}
                    onChange={(e) => setConfigSettings({...configSettings, emailAlerts: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-gray-300">Alertas por Email</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleSaveConfiguration} className="bg-green-600 hover:bg-green-700 flex-1">
                Salvar
              </Button>
              <Button onClick={() => setShowConfigModal(false)} variant="outline" className="border-gray-600 text-white hover:bg-gray-700 flex-1">
                Cancelar
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-400 mb-2">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mb-2">{stat.value}</p>
                    <div className="flex items-center gap-1">
                      {stat.changeType === 'positive' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-gray-500 text-xs ml-1">vs mês anterior</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs de Navegação */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-blue-600">
            <CreditCard className="w-4 h-4 mr-2" />
            Transações
          </TabsTrigger>
          <TabsTrigger value="wallets" className="data-[state=active]:bg-blue-600">
            <WalletIcon className="w-4 h-4 mr-2" />
            Carteiras
          </TabsTrigger>
          <TabsTrigger value="gateways" className="data-[state=active]:bg-blue-600">
            <Settings className="w-4 h-4 mr-2" />
            Gateways
          </TabsTrigger>
          <TabsTrigger value="plans" className="data-[state=active]:bg-blue-600">
            <PieChart className="w-4 h-4 mr-2" />
            Planos
          </TabsTrigger>
          <TabsTrigger value="affiliates" className="data-[state=active]:bg-blue-600">
            <Users className="w-4 h-4 mr-2" />
            Afiliados
          </TabsTrigger>
          <TabsTrigger value="tokens" className="data-[state=active]:bg-yellow-600"> {/* New tab for Tokens */}
            <Coins className="w-4 h-4 mr-2" />
            Tokens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <RevenueOverview />
          <FinancialCharts />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <TransactionsTable />
        </TabsContent>

        <TabsContent value="wallets" className="space-y-6">
          <WalletManagement />
        </TabsContent>

        <TabsContent value="gateways" className="space-y-6">
          <PaymentGateways />
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <PlansManagement />
        </TabsContent>

        <TabsContent value="affiliates" className="space-y-6">
          <AffiliatesManagement />
        </TabsContent>

        <TabsContent value="tokens" className="space-y-6"> {/* New tab content for Tokens */}
          <TokenManagementView />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
