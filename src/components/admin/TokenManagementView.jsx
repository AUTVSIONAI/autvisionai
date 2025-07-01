// SISTEMA DE ADMINISTRAÇÃO DE TOKENS - COMPLETO
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Coins, 
  Plus, 
  Minus, 
  Gift, 
  TrendingUp, 
  Users, 
  Award,
  Send,
  History
} from 'lucide-react';
import { useSync } from '@/contexts/SyncContext';
import { User } from '@/api/entities';
import { Transaction } from '@/api/entities';

export default function TokenManagementView() {
  const { globalData, syncModule } = useSync();
  const { users = [] } = globalData;
  
  const [selectedUser, setSelectedUser] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [tokenReason, setTokenReason] = useState('');
  const [bulkAmount, setBulkAmount] = useState('');
  const [bulkReason, setBulkReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tokenHistory, setTokenHistory] = useState([]);

  // ESTATÍSTICAS DE TOKENS
  const tokenStats = {
    totalTokens: users.reduce((sum, user) => sum + (user.tokens || 0), 0),
    averageTokens: users.length > 0 ? (users.reduce((sum, user) => sum + (user.tokens || 0), 0) / users.length).toFixed(1) : 0,
    usersWithTokens: users.filter(user => (user.tokens || 0) > 0).length,
    topTokenHolder: users.reduce((max, user) => (user.tokens || 0) > (max.tokens || 0) ? user : max, {}),
  };

  // ADICIONAR TOKENS INDIVIDUAL
  const handleAddTokens = async () => {
    if (!selectedUser || !tokenAmount || !tokenReason) return;
    
    setIsProcessing(true);
    try {
      const user = users.find(u => u.email === selectedUser);
      const newTokens = (user.tokens || 0) + parseInt(tokenAmount);
      
      await User.update(user.id, { tokens: newTokens });
      
      // Registrar transação
      await Transaction.create({
        user_email: selectedUser,
        type: 'token_purchase',
        amount: 0, // Tokens gratuitos do admin
        status: 'completed',
        description: `Admin adicionou ${tokenAmount} tokens - ${tokenReason}`,
        metadata: { admin_action: true, reason: tokenReason }
      });

      setTokenHistory(prev => [{
        user: user.full_name,
        action: `+${tokenAmount} tokens`,
        reason: tokenReason,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 9)]);

      setSelectedUser('');
      setTokenAmount('');
      setTokenReason('');
      await syncModule('users');
    } catch (error) {
      console.error('Erro ao adicionar tokens:', error);
    }
    setIsProcessing(false);
  };

  // REMOVER TOKENS INDIVIDUAL
  const handleRemoveTokens = async () => {
    if (!selectedUser || !tokenAmount || !tokenReason) return;
    
    setIsProcessing(true);
    try {
      const user = users.find(u => u.email === selectedUser);
      const newTokens = Math.max(0, (user.tokens || 0) - parseInt(tokenAmount));
      
      await User.update(user.id, { tokens: newTokens });
      
      await Transaction.create({
        user_email: selectedUser,
        type: 'token_purchase',
        amount: 0,
        status: 'completed', 
        description: `Admin removeu ${tokenAmount} tokens - ${tokenReason}`,
        metadata: { admin_action: true, reason: tokenReason, action: 'remove' }
      });

      setTokenHistory(prev => [{
        user: user.full_name,
        action: `-${tokenAmount} tokens`,
        reason: tokenReason,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 9)]);

      setSelectedUser('');
      setTokenAmount('');
      setTokenReason('');
      await syncModule('users');
    } catch (error) {
      console.error('Erro ao remover tokens:', error);
    }
    setIsProcessing(false);
  };

  // DISTRIBUIÇÃO EM MASSA
  const handleBulkDistribution = async () => {
    if (!bulkAmount || !bulkReason) return;
    
    setIsProcessing(true);
    try {
      const promises = users.map(async (user) => {
        const newTokens = (user.tokens || 0) + parseInt(bulkAmount);
        await User.update(user.id, { tokens: newTokens });
        
        return Transaction.create({
          user_email: user.email,
          type: 'token_purchase',
          amount: 0,
          status: 'completed',
          description: `Distribuição em massa: ${bulkAmount} tokens - ${bulkReason}`,
          metadata: { admin_action: true, bulk_distribution: true, reason: bulkReason }
        });
      });

      await Promise.all(promises);

      setTokenHistory(prev => [{
        user: 'TODOS OS USUÁRIOS',
        action: `+${bulkAmount} tokens cada`,
        reason: bulkReason,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 9)]);

      setBulkAmount('');
      setBulkReason('');
      await syncModule('users');
    } catch (error) {
      console.error('Erro na distribuição em massa:', error);
    }
    setIsProcessing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="admin-full-width w-full max-w-none space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
          <Coins className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Gerenciamento de Tokens</h1>
          <p className="text-gray-400">Administração completa do sistema de tokens da plataforma</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total de Tokens</p>
                <p className="text-2xl font-bold text-white">{tokenStats.totalTokens.toLocaleString()}</p>
              </div>
              <Coins className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Média por Usuário</p>
                <p className="text-2xl font-bold text-white">{tokenStats.averageTokens}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Usuários com Tokens</p>
                <p className="text-2xl font-bold text-white">{tokenStats.usersWithTokens}</p>
              </div>
              <Users className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Top Holder</p>
                <p className="text-lg font-bold text-white">{tokenStats.topTokenHolder.full_name?.split(' ')[0] || 'N/A'}</p>
                <p className="text-sm text-gray-400">{tokenStats.topTokenHolder.tokens || 0} tokens</p>
              </div>
              <Award className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <Tabs defaultValue="individual" className="space-y-6">
        <TabsList className="bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="individual" className="data-[state=active]:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Individual
          </TabsTrigger>
          <TabsTrigger value="bulk" className="data-[state=active]:bg-green-600">
            <Gift className="w-4 h-4 mr-2" />
            Em Massa
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
            <Users className="w-4 h-4 mr-2" />
            Por Usuário
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-orange-600">
            <History className="w-4 h-4 mr-2" />
            Histórico
          </TabsTrigger>
        </TabsList>

        {/* Individual Token Management */}
        <TabsContent value="individual" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Gerenciar Tokens Individual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Selecionar usuário" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white">
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.email}>
                        {user.full_name} ({user.tokens || 0} tokens)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Quantidade"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />

                <Input
                  placeholder="Motivo"
                  value={tokenReason}
                  onChange={(e) => setTokenReason(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />

                <div className="flex gap-2">
                  <Button
                    onClick={handleAddTokens}
                    disabled={isProcessing || !selectedUser || !tokenAmount || !tokenReason}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                  <Button
                    onClick={handleRemoveTokens}
                    disabled={isProcessing || !selectedUser || !tokenAmount || !tokenReason}
                    variant="destructive"
                    className="flex-1"
                  >
                    <Minus className="w-4 h-4 mr-2" />
                    Remover
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Distribution */}
        <TabsContent value="bulk" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Distribuição em Massa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="number"
                  placeholder="Tokens para cada usuário"
                  value={bulkAmount}
                  onChange={(e) => setBulkAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />

                <Input
                  placeholder="Motivo da distribuição"
                  value={bulkReason}
                  onChange={(e) => setBulkReason(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />

                <Button
                  onClick={handleBulkDistribution}
                  disabled={isProcessing || !bulkAmount || !bulkReason}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Distribuir para Todos
                </Button>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                  ⚠️ Esta ação irá adicionar {bulkAmount || 0} tokens para todos os {users.length} usuários da plataforma.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users List */}
        <TabsContent value="users" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Tokens por Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-white">Usuário</TableHead>
                      <TableHead className="text-white">Email</TableHead>
                      <TableHead className="text-white">Tokens</TableHead>
                      <TableHead className="text-white">Plano</TableHead>
                      <TableHead className="text-white">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .sort((a, b) => (b.tokens || 0) - (a.tokens || 0))
                      .map(user => (
                        <TableRow key={user.id} className="border-gray-700 hover:bg-gray-700/50">
                          <TableCell className="text-white">{user.full_name}</TableCell>
                          <TableCell className="text-gray-300">{user.email}</TableCell>
                          <TableCell>
                            <Badge className="bg-yellow-500/20 text-yellow-300">
                              <Coins className="w-3 h-3 mr-1" />
                              {user.tokens || 0}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-gray-500 text-gray-300">
                              {user.plan_id ? 'Premium' : 'Free'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedUser(user.email)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              Gerenciar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Histórico de Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tokenHistory.length > 0 ? (
                  tokenHistory.map((action, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{action.user}</p>
                        <p className="text-sm text-gray-400">{action.reason}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${action.action.includes('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {action.action}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(action.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma ação registrada ainda</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}