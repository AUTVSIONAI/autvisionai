import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  CheckCircle,
  DollarSign,
  Users
} from 'lucide-react';
import { Plan } from '@/api/entities';
import { useSync } from '@/contexts/SyncContext';

export default function PlansManagement() {
  const { globalData } = useSync();
  const { users = [] } = globalData;
  
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    features: [],
    max_agents: '',
    max_routines: '',
    max_integrations: '',
    support_level: 'basic',
    is_popular: false,
    is_active: true
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const plansList = await Plan.list();
      setPlans(plansList);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const planData = {
        ...formData,
        price: parseFloat(formData.price),
        max_agents: parseInt(formData.max_agents),
        max_routines: parseInt(formData.max_routines),
        max_integrations: parseInt(formData.max_integrations),
        features: formData.features.filter(f => f.trim() !== '')
      };

      if (editingPlan) {
        await Plan.update(editingPlan.id, planData);
      } else {
        await Plan.create(planData);
      }

      setShowForm(false);
      setEditingPlan(null);
      resetForm();
      loadPlans();
    } catch (error) {
      console.error('Erro ao salvar plano:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      features: [],
      max_agents: '',
      max_routines: '',
      max_integrations: '',
      support_level: 'basic',
      is_popular: false,
      is_active: true
    });
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      ...plan,
      price: plan.price.toString(),
      max_agents: plan.max_agents?.toString() || '',
      max_routines: plan.max_routines?.toString() || '',
      max_integrations: plan.max_integrations?.toString() || '',
      features: plan.features || []
    });
    setShowForm(true);
  };

  const handleDelete = async (planId) => {
    if (window.confirm('Tem certeza que deseja deletar este plano?')) {
      try {
        await Plan.delete(planId);
        loadPlans();
      } catch (error) {
        console.error('Erro ao deletar plano:', error);
      }
    }
  };

  const togglePlanStatus = async (plan) => {
    try {
      await Plan.update(plan.id, { is_active: !plan.is_active });
      loadPlans();
    } catch (error) {
      console.error('Erro ao alterar status do plano:', error);
    }
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  // Estatísticas dos planos
  const planStats = {
    totalPlans: plans.length,
    activePlans: plans.filter(p => p.is_active).length,
    totalRevenue: users.reduce((sum, user) => {
      const userPlan = plans.find(p => p.id === user.plan_id);
      return sum + (userPlan?.price || 0);
    }, 0),
    mostPopular: plans.find(p => p.is_popular)
  };

  return (
    <div className="admin-full-width w-full max-w-none space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total de Planos</p>
                <p className="text-2xl font-bold text-white">{planStats.totalPlans}</p>
              </div>
              <Crown className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Planos Ativos</p>
                <p className="text-2xl font-bold text-white">{planStats.activePlans}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Receita Mensal</p>
                <p className="text-2xl font-bold text-white">R$ {planStats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Plano Popular</p>
                <p className="text-lg font-bold text-white">{planStats.mostPopular?.name || 'Nenhum'}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciamento de Planos</h2>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      {/* Formulário */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <Card className="bg-gray-800 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white">
                {editingPlan ? 'Editar Plano' : 'Novo Plano'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Nome do plano"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Preço (R$)"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    step="0.01"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    type="number"
                    placeholder="Máx. Agentes"
                    value={formData.max_agents}
                    onChange={(e) => setFormData({...formData, max_agents: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  <Input
                    type="number"
                    placeholder="Máx. Rotinas"
                    value={formData.max_routines}
                    onChange={(e) => setFormData({...formData, max_routines: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  <Input
                    type="number"
                    placeholder="Máx. Integrações"
                    value={formData.max_integrations}
                    onChange={(e) => setFormData({...formData, max_integrations: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <select
                  value={formData.support_level}
                  onChange={(e) => setFormData({...formData, support_level: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                >
                  <option value="basic">Suporte Básico</option>
                  <option value="priority">Suporte Prioritário</option>
                  <option value="dedicated">Suporte Dedicado</option>
                </select>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Recursos do Plano
                  </label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Recurso do plano"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 flex-1"
                      />
                      <Button 
                        type="button"
                        onClick={() => removeFeature(index)}
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button"
                    onClick={addFeature}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Recurso
                  </Button>
                </div>

                {/* Switches */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_popular}
                      onCheckedChange={(checked) => setFormData({...formData, is_popular: checked})}
                    />
                    <span className="text-gray-300">Plano Popular</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                    />
                    <span className="text-gray-300">Plano Ativo</span>
                  </label>
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  >
                    {editingPlan ? 'Salvar Alterações' : 'Criar Plano'}
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingPlan(null);
                      resetForm();
                    }}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tabela de Planos */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Planos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Plano</TableHead>
                <TableHead className="text-gray-300">Preço</TableHead>
                <TableHead className="text-gray-300">Recursos</TableHead>
                <TableHead className="text-gray-300">Limites</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Usuários</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map(plan => (
                <TableRow key={plan.id} className="border-gray-700">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">{plan.name}</p>
                        {plan.is_popular && (
                          <Badge className="bg-yellow-500 text-black text-xs mt-1">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-green-400 font-semibold text-lg">
                      R$ {plan.price.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {plan.features?.slice(0, 2).map((feature, index) => (
                        <div key={index} className="text-gray-300 text-sm">
                          • {feature}
                        </div>
                      ))}
                      {plan.features?.length > 2 && (
                        <div className="text-gray-500 text-xs">
                          +{plan.features.length - 2} mais
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-300 text-sm space-y-1">
                      <div>Agentes: {plan.max_agents || '∞'}</div>
                      <div>Rotinas: {plan.max_routines || '∞'}</div>
                      <div>Integrações: {plan.max_integrations || '∞'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={plan.is_active}
                        onCheckedChange={() => togglePlanStatus(plan)}
                      />
                      <span className={`text-sm ${plan.is_active ? 'text-green-400' : 'text-red-400'}`}>
                        {plan.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-white">
                        {users.filter(u => u.plan_id === plan.id).length}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleEdit(plan)}
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(plan.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}