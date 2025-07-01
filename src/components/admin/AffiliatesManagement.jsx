import { useState } from 'react';
import { useSync } from '@/contexts/SyncContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { 
  PlusCircle, 
  Gift, 
  Trash2, 
  Share2,
  TrendingUp,
  DollarSign,
  Eye,
  Copy,
  ExternalLink,
  Award,
  RefreshCw
} from "lucide-react";
import { Affiliate } from '@/api/entities';
import { User } from '@/api/entities';

export default function AffiliatesManagement() {
  const { globalData, syncModule } = useSync();
  const { affiliates = [], users = [] } = globalData;

  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [commissionRate, setCommissionRate] = useState(10);
  const [bonusTokens, setBonusTokens] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);

  const generateCode = (email) => {
    return email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase() + 
           Math.random().toString(36).substring(2, 6).toUpperCase();
  };
  
  const handleCreate = async () => {
    if (!selectedUser) return;
    
    setIsProcessing(true);
    try {
      const affiliateData = {
        user_email: selectedUser,
        affiliate_code: generateCode(selectedUser),
        commission_rate: commissionRate,
        bonus_tokens: bonusTokens
      };

      await Affiliate.create(affiliateData);
      
      // Dar tokens de bônus para o novo afiliado
      const user = users.find(u => u.email === selectedUser);
      if (user) {
        await User.update(user.id, { 
          tokens: (user.tokens || 0) + bonusTokens 
        });
      }

      setShowForm(false);
      setSelectedUser('');
      await syncModule('affiliates');
      await syncModule('users');
    } catch (error) {
      console.error('Erro ao criar afiliado:', error);
    }
    setIsProcessing(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este afiliado?')) {
      try {
        await Affiliate.delete(id);
        await syncModule('affiliates');
      } catch (error) {
        console.error('Erro ao deletar afiliado:', error);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copiado para a área de transferência!');
  };

  const nonAffiliateUsers = users.filter(u => !affiliates.some(a => a.user_email === u.email));

  // Estatísticas dos afiliados
  const affiliateStats = {
    totalAffiliates: affiliates.length,
    activeAffiliates: affiliates.filter(a => a.status === 'active').length,
    totalTokensGenerated: affiliates.reduce((sum, a) => sum + (a.tokens_earned || 0), 0),
    totalClicks: affiliates.reduce((sum, a) => sum + (a.clicks || 0), 0),
    totalConversions: affiliates.reduce((sum, a) => sum + (a.conversions || 0), 0),
    conversionRate: affiliates.reduce((sum, a) => sum + (a.clicks || 0), 0) > 0 
      ? ((affiliates.reduce((sum, a) => sum + (a.conversions || 0), 0) / affiliates.reduce((sum, a) => sum + (a.clicks || 0), 0)) * 100).toFixed(1)
      : 0
  };

  return (
    <div className="admin-full-width space-y-6 w-full max-w-none overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-100">Gerenciamento de Afiliados</h1>
            <p className="text-gray-400 text-sm lg:text-base">Configure e monitore o programa de afiliados</p>
          </div>
        </div>
        <div className="lg:ml-auto">
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Novo Afiliado
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Afiliados</p>
                <p className="text-2xl font-bold text-white">{affiliateStats.totalAffiliates}</p>
              </div>
              <Share2 className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Tokens Gerados</p>
                <p className="text-2xl font-bold text-white">{affiliateStats.totalTokensGenerated}</p>
              </div>
              <Gift className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Cliques</p>
                <p className="text-2xl font-bold text-white">{affiliateStats.totalClicks}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Taxa Conversão</p>
                <p className="text-2xl font-bold text-white">{affiliateStats.conversionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      {showForm && (
        <Card className="bg-gray-800/50 border-gray-700 text-white w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Criar Novo Afiliado
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 w-full"
            >
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Selecionar Usuário</label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
                  >
                    <option value="">Escolha um usuário</option>
                    {nonAffiliateUsers.map(user => (
                      <option key={user.id} value={user.email}>
                        {user.full_name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Taxa de Comissão (%)</label>
                  <Input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                    className="bg-gray-800 border-gray-600 text-white"
                    min="0"
                    max="50"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bônus de Tokens</label>
                  <Input
                    type="number"
                    value={bonusTokens}
                    onChange={(e) => setBonusTokens(parseInt(e.target.value))}
                    className="bg-gray-800 border-gray-600 text-white"
                    min="0"
                    step="10"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleCreate} 
                  disabled={isProcessing || !selectedUser}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Award className="w-4 h-4 mr-2" />}
                  Criar Afiliado
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancelar
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      )}

      {/* Tabela de Afiliados */}
      <Card className="bg-gray-800/50 border-gray-700 text-white w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-400" />
            Lista de Afiliados
          </CardTitle>
          <Button onClick={() => syncModule('affiliates')} variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </CardHeader>
        <CardContent className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-800/50">
                <TableHead className="text-gray-300">Afiliado</TableHead>
                <TableHead className="text-gray-300">Código</TableHead>
                <TableHead className="text-gray-300">Performance</TableHead>
                <TableHead className="text-gray-300">Tokens Gerados</TableHead>
                <TableHead className="text-gray-300">Comissão</TableHead>
                <TableHead className="text-gray-300">Link de Referência</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {affiliates.map(affiliate => {
                const user = users.find(u => u.email === affiliate.user_email);
                const affiliateLink = `https://autvision.com/register?ref=${affiliate.affiliate_code}`;
                const conversionRate = affiliate.clicks > 0 ? ((affiliate.conversions || 0) / affiliate.clicks * 100).toFixed(1) : 0;
                
                return (
                  <TableRow key={affiliate.id} className="border-gray-700 hover:bg-gray-800/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {user?.full_name?.charAt(0) || 'A'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user?.full_name || affiliate.user_email}</p>
                          <p className="text-gray-400 text-sm">{affiliate.user_email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {affiliate.affiliate_code}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Conversão:</span>
                          <span className="text-white font-medium">{conversionRate}%</span>
                        </div>
                        <Progress 
                          value={parseFloat(conversionRate)} 
                          className="h-2" 
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{affiliate.clicks || 0} cliques</span>
                          <span>{affiliate.conversions || 0} conversões</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold">{affiliate.tokens_earned || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-semibold">
                          {affiliate.commission_rate || 10}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyToClipboard(affiliateLink)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copiar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(affiliateLink, '_blank')}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${
                        affiliate.status === 'active' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {affiliate.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(affiliate.id)}
                          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Mensagem se não houver afiliados */}
          {affiliates.length === 0 && (
            <div className="text-center py-12">
              <Share2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhum afiliado cadastrado</h3>
              <p className="text-gray-500 mb-6">Comece criando o primeiro afiliado da plataforma</p>
              <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="w-4 h-4 mr-2" />
                Criar Primeiro Afiliado
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}