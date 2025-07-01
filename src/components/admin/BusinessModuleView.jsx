import { useState, useEffect } from "react";
import { Business } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  MessageSquare, 
  Building2, 
  Phone, 
  BarChart3,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Crown,
  Plus
} from "lucide-react";

export default function BusinessModuleView() {
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    connected: 0,
    active: 0,
    premium: 0
  });

  useEffect(() => {
    loadBusinessData();
  }, []);

  const loadBusinessData = async () => {
    setIsLoading(true);
    try {
      const businessList = await Business.list();
      setBusinesses(businessList);
      
      // Calculate stats
      const total = businessList.length;
      const connected = businessList.filter(b => b.whatsapp_config?.status === 'connected').length;
      const active = businessList.filter(b => b.is_active).length;
      const premium = businessList.filter(b => b.plan_type !== 'free').length;
      
      setStats({ total, connected, active, premium });
    } catch (error) {
      console.error("Erro ao carregar negócios:", error);
    }
    setIsLoading(false);
  };

  const getStatusBadge = (business) => {
    const whatsappStatus = business.whatsapp_config?.status || 'disconnected';
    const isActive = business.is_active;

    if (!isActive) {
      return <Badge variant="secondary" className="bg-gray-500 text-white">Pausado</Badge>;
    }

    switch (whatsappStatus) {
      case 'connected':
        return <Badge className="bg-green-500 text-white">Conectado</Badge>;
      case 'connecting':
        return <Badge className="bg-blue-500 text-white">Conectando</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-500 text-gray-600">Desconectado</Badge>;
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      restaurant: "🍕",
      store: "🛍️",
      clinic: "🏥",
      salon: "💄",
      gym: "🏋️",
      hotel: "🏨",
      pharmacy: "💊",
      automotive: "🚗",
      education: "📚",
      other: "🏢"
    };
    return icons[category] || "🏢";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando módulo empresarial...</p>
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
        className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-100">Módulo Empresarial</h1>
            <p className="text-gray-400 text-sm lg:text-base">Gestão de empresas com WhatsApp Business</p>
          </div>
        </div>
        
        <div className="lg:ml-auto flex items-center gap-3">
          <Link to={createPageUrl("BusinessOnboarding")}>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
              <Plus className="w-4 h-4 mr-2" />
              Nova Empresa
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to={createPageUrl("BusinessDashboard")}>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Ver Dashboard
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total de Empresas</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">WhatsApp Conectado</p>
                <p className="text-2xl font-bold text-white">{stats.connected}</p>
              </div>
              <Phone className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Agentes Ativos</p>
                <p className="text-2xl font-bold text-white">{stats.active}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Planos Premium</p>
                <p className="text-2xl font-bold text-white">{stats.premium}</p>
              </div>
              <Crown className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Businesses Table */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Empresas Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          {businesses.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhuma empresa registrada</h3>
              <p className="text-gray-500 mb-6">As empresas que se cadastrarem aparecerão aqui</p>
              <Link to={createPageUrl("BusinessOnboarding")}>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Primeira Empresa
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-white">Empresa</TableHead>
                    <TableHead className="text-white">Categoria</TableHead>
                    <TableHead className="text-white">Agente</TableHead>
                    <TableHead className="text-white">WhatsApp</TableHead>
                    <TableHead className="text-white">Plano</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Criado em</TableHead>
                    <TableHead className="text-white">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businesses.map((business) => (
                    <TableRow key={business.id} className="border-gray-700">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getCategoryIcon(business.category)}</span>
                          <div>
                            <p className="font-medium text-gray-100">{business.business_name}</p>
                            <p className="text-sm text-gray-400">{business.created_by}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-300 capitalize">{business.category}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-300">{business.agent_config?.agent_name || "Assistente"}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {business.whatsapp_config?.status === 'connected' ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : business.whatsapp_config?.status === 'connecting' ? (
                            <Clock className="w-4 h-4 text-blue-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-gray-300 text-sm">
                            {business.whatsapp_config?.phone_number || 'Não conectado'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          business.plan_type === 'free' ? 'bg-gray-500' :
                          business.plan_type === 'premium' ? 'bg-blue-500' : 'bg-purple-500'
                        }>
                          {business.plan_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(business)}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(business.created_date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link to={createPageUrl("BusinessDashboard")}>
                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link to={createPageUrl("BusinessAgentConfig")}>
                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}