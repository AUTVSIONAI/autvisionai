import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, Plus, Minus, TrendingUp, DollarSign, Users, RefreshCw, Send } from 'lucide-react';
import { useAdminData } from '../../AdminDataContext';
import { Wallet as WalletEntity } from '@/api/entities';
import { Transaction } from '@/api/entities';

export default function WalletManagement() {
  const { data } = useAdminData();
  const { users = [] } = data;
  
  const [wallets, setWallets] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [operation, setOperation] = useState('add'); // 'add' ou 'deduct'
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      const walletsList = await WalletEntity.list();
      setWallets(walletsList);
    } catch (error) {
      console.error('Erro ao carregar carteiras:', error);
    }
  };

  const handleBalanceOperation = async () => {
    if (!selectedUser || !amount || !reason) {
      alert('Preencha todos os campos');
      return;
    }

    setIsProcessing(true);
    try {
      let wallet = wallets.find(w => w.user_email === selectedUser);
      
      // Criar carteira se não existir
      if (!wallet) {
        wallet = await WalletEntity.create({
          user_email: selectedUser,
          balance: 0,
          tokens: 0
        });
        setWallets(prev => [...prev, wallet]);
      }

      const amountValue = parseFloat(amount);
      const newBalance = operation === 'add' 
        ? (wallet.balance || 0) + amountValue
        : Math.max(0, (wallet.balance || 0) - amountValue);

      // Atualizar carteira
      await WalletEntity.update(wallet.id, { 
        balance: newBalance,
        last_transaction: new Date().toISOString()
      });

      // Registrar transação
      await Transaction.create({
        user_email: selectedUser,
        type: operation === 'add' ? 'payment' : 'refund',
        amount: amountValue,
        status: 'completed',
        description: `Admin ${operation === 'add' ? 'adicionou' : 'deduziu'} R$ ${amountValue} - ${reason}`,
        metadata: { 
          admin_action: true, 
          reason: reason,
          operation: operation,
          previous_balance: wallet.balance || 0,
          new_balance: newBalance
        }
      });

      // Resetar form
      setSelectedUser('');
      setAmount('');
      setReason('');
      
      // Recarregar dados
      await loadWallets();
      
      alert(`Operação realizada com sucesso! ${operation === 'add' ? 'Adicionado' : 'Deduzido'} R$ ${amountValue}`);
    } catch (error) {
      console.error('Erro na operação:', error);
      alert('Erro ao processar operação');
    }
    setIsProcessing(false);
  };

  const createWalletForUser = async (userEmail) => {
    try {
      const newWallet = await WalletEntity.create({
        user_email: userEmail,
        balance: 0,
        tokens: 0
      });
      setWallets(prev => [...prev, newWallet]);
      alert('Carteira criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar carteira:', error);
      alert('Erro ao criar carteira');
    }
  };

  // Estatísticas das carteiras
  const walletStats = {
    totalWallets: wallets.length,
    totalBalance: wallets.reduce((sum, w) => sum + (w.balance || 0), 0),
    activeWallets: wallets.filter(w => (w.balance || 0) > 0).length,
    averageBalance: wallets.length > 0 ? (wallets.reduce((sum, w) => sum + (w.balance || 0), 0) / wallets.length) : 0
  };

  return (
    <div className="admin-full-width w-full max-w-none space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Carteiras</p>
                <p className="text-2xl font-bold text-white">{walletStats.totalWallets}</p>
              </div>
              <Wallet className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Saldo Total</p>
                <p className="text-2xl font-bold text-white">R$ {walletStats.totalBalance.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Carteiras Ativas</p>
                <p className="text-2xl font-bold text-white">{walletStats.activeWallets}</p>
              </div>
              <Users className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Saldo Médio</p>
                <p className="text-2xl font-bold text-white">R$ {walletStats.averageBalance.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário de Operações */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Send className="w-5 h-5" />
            Gerenciar Saldo das Carteiras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Selecionar usuário" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                {users.map(user => (
                  <SelectItem key={user.email} value={user.email}>
                    {user.full_name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                <SelectItem value="add">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-green-400" />
                    Adicionar Saldo
                  </div>
                </SelectItem>
                <SelectItem value="deduct">
                  <div className="flex items-center gap-2">
                    <Minus className="w-4 h-4 text-red-400" />
                    Deduzir Saldo
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Valor (R$)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              step="0.01"
            />

            <Input
              placeholder="Motivo da operação"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />

            <Button 
              onClick={handleBalanceOperation}
              disabled={isProcessing || !selectedUser || !amount || !reason}
              className={`${
                operation === 'add' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              } text-white`}
            >
              {isProcessing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : operation === 'add' ? (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </>
              ) : (
                <>
                  <Minus className="w-4 h-4 mr-2" />
                  Deduzir
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Carteiras */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Carteiras dos Usuários</CardTitle>
          <Button onClick={loadWallets} variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-white">Usuário</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Saldo</TableHead>
                <TableHead className="text-white">Tokens</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Última Transação</TableHead>
                <TableHead className="text-white">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => {
                const wallet = wallets.find(w => w.user_email === user.email);
                return (
                  <TableRow key={user.email} className="border-gray-700">
                    <TableCell className="text-white font-medium">{user.full_name}</TableCell>
                    <TableCell className="text-gray-300">{user.email}</TableCell>
                    <TableCell>
                      <span className="text-green-400 font-semibold">
                        R$ {(wallet?.balance || 0).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-yellow-400 font-semibold">
                        {wallet?.tokens || 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      {wallet ? (
                        <Badge className={`${wallet.is_active ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                          {wallet.is_active ? 'Ativa' : 'Inativa'}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-gray-500 text-gray-400">
                          Sem Carteira
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {wallet?.last_transaction 
                        ? new Date(wallet.last_transaction).toLocaleDateString('pt-BR')
                        : 'Nunca'
                      }
                    </TableCell>
                    <TableCell>
                      {!wallet ? (
                        <Button 
                          onClick={() => createWalletForUser(user.email)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Criar Carteira
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Detalhes
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}