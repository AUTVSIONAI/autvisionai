
// MODAL DE COMPRA DE PLANOS - CONECTADO COM SISTEMA ADMIN
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plan } from '@/api/entities';
import { User } from '@/api/entities';
import { useToast } from '@/components/ui/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Crown, 
  Zap, 
  Star, 
  Sparkles,
  CreditCard,
  Loader2,
  X,
  Shield
} from 'lucide-react';

export default function PurchasePlanModal({ isOpen, onClose, onPlanPurchased }) {
  const [plans, setPlans] = useState([]);
  const [currentUserPlan, setCurrentUserPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadPlansAndUser();
    }
  }, [isOpen]);

  const loadPlansAndUser = async () => {
    setIsLoading(true);
    try {
      const [plansData, userData] = await Promise.all([
        Plan.filter({ is_active: true }),
        User.me()
      ]);

      // Remover planos duplicados por nome
      const uniquePlans = plansData.reduce((acc, current) => {
        if (!acc.find(plan => plan.name === current.name)) {
          acc.push(current);
        }
        return acc;
      }, []);

      // Ordenar por preço
      const sortedPlans = uniquePlans.sort((a, b) => a.price - b.price);
      
      setPlans(sortedPlans);
      
      // Encontrar plano atual do usuário
      const userCurrentPlan = sortedPlans.find(plan => plan.id === userData.plan_id);
      setCurrentUserPlan(userCurrentPlan);

    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      toast.error('Erro ao carregar planos disponíveis.');
    }
    setIsLoading(false);
  };

  const handlePurchasePlan = async (plan) => {
    setSelectedPlan(plan);
    setIsPurchasing(true);

    try {
      // Simular processo de compra
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar plano do usuário
      await User.updateMyUserData({ plan_id: plan.id });
      
      toast.success(`Plano ${plan.name} ativado com sucesso!`);
      
      if (onPlanPurchased) {
        onPlanPurchased(plan);
      }
      
      onClose();
      
    } catch (error) {
      console.error('Erro na compra:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    }
    
    setIsPurchasing(false);
    setSelectedPlan(null);
  };

  const getPlanIcon = (planName) => {
    const name = planName.toLowerCase();
    if (name.includes('premium') || name.includes('pro')) return Crown;
    if (name.includes('enterprise') || name.includes('business')) return Sparkles;
    return Zap;
  };

  const getPlanColor = (planName) => {
    const name = planName.toLowerCase();
    if (name.includes('premium') || name.includes('pro')) return 'from-purple-500 to-pink-500';
    if (name.includes('enterprise') || name.includes('business')) return 'from-blue-500 to-cyan-500';
    return 'from-green-500 to-emerald-500';
  };

  const isCurrentPlan = (plan) => {
    return currentUserPlan?.id === plan.id;
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Crown className="w-6 h-6 text-purple-500" />
            Escolha seu Plano Vision
          </DialogTitle>
          <p className="text-gray-600">
            Desbloqueie todo o potencial da sua experiência com Vision
          </p>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Carregando planos disponíveis...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Plano Atual */}
            {currentUserPlan && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Seu Plano Atual</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-blue-900">{currentUserPlan.name}</p>
                    <p className="text-blue-700">R$ {currentUserPlan.price.toFixed(2)}/mês</p>
                  </div>
                  <Badge className="bg-blue-600 text-white">Ativo</Badge>
                </div>
              </div>
            )}

            {/* Grid de Planos */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {plans.map((plan, index) => {
                  const PlanIcon = getPlanIcon(plan.name);
                  const planColor = getPlanColor(plan.name);
                  const isCurrent = isCurrentPlan(plan);
                  const isProcessing = isPurchasing && selectedPlan?.id === plan.id;

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative ${plan.is_popular ? 'scale-105' : ''}`}
                    >
                      <Card className={`h-full border-2 transition-all duration-300 ${
                        plan.is_popular 
                          ? 'border-purple-500 shadow-lg shadow-purple-500/25' 
                          : isCurrent 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        {plan.is_popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-3 py-1">
                              <Star className="w-3 h-3 mr-1" />
                              Mais Popular
                            </Badge>
                          </div>
                        )}

                        <CardHeader className="text-center pb-4">
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${planColor} flex items-center justify-center`}>
                            <PlanIcon className="w-8 h-8 text-white" />
                          </div>
                          <CardTitle className="text-xl">{plan.name}</CardTitle>
                          <div className="text-center">
                            <span className="text-3xl font-bold">R$ {plan.price.toFixed(2)}</span>
                            <span className="text-gray-600">/mês</span>
                          </div>
                        </CardHeader>

                        <CardContent className="flex-grow">
                          <ul className="space-y-3 mb-6">
                            {plan.features?.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="space-y-2 text-sm text-gray-600 mb-6">
                            <div className="flex justify-between">
                              <span>Agentes:</span>
                              <span className="font-medium">{plan.max_agents || '∞'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Rotinas:</span>
                              <span className="font-medium">{plan.max_routines || '∞'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Integrações:</span>
                              <span className="font-medium">{plan.max_integrations || '∞'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Suporte:</span>
                              <span className="font-medium capitalize">{plan.support_level}</span>
                            </div>
                          </div>

                          <Button
                            onClick={() => handlePurchasePlan(plan)}
                            disabled={isCurrent || isPurchasing}
                            className={`w-full transition-all duration-300 ${
                              isCurrent
                                ? 'bg-gray-400 cursor-not-allowed'
                                : plan.is_popular
                                  ? `bg-gradient-to-r ${planColor} hover:opacity-90 text-white`
                                  : 'bg-gray-900 hover:bg-gray-800 text-white'
                            }`}
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processando...
                              </>
                            ) : isCurrent ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Plano Atual
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-4 h-4 mr-2" />
                                Escolher Plano
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Informações de Pagamento */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Informações Importantes
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Pagamento seguro com criptografia SSL
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Cancele a qualquer momento, sem multas
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Suporte técnico especializado
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Atualizações automáticas incluídas
                </li>
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
