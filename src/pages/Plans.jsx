import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSync } from '@/contexts/SyncContext';
import { 
  Crown, 
  Star, 
  CheckCircle,
  Zap,
  Users,
  Clock,
  Link,
  DollarSign
} from 'lucide-react';

export default function PlansPage() {
  const { globalData, isLoading } = useSync();
  const [currentPlan, setCurrentPlan] = useState(null);

  // Usar dados do sync global com useMemo
  const plans = useMemo(() => {
    return globalData.plans?.filter(plan => plan.is_active) || [];
  }, [globalData.plans]);

  useEffect(() => {
    // Simular plano atual do usuário (será integrado com auth depois)
    if (plans.length > 0) {
      setCurrentPlan(plans.find(plan => plan.name === 'Starter') || plans[0]);
    }
  }, [plans]);

  const getPlanIcon = (planName) => {
    switch (planName.toLowerCase()) {
      case 'starter':
      case 'básico':
        return Star;
      case 'pro':
      case 'professional':
        return Zap;
      case 'enterprise':
      case 'empresarial':
        return Crown;
      default:
        return Star;
    }
  };

  const getPlanColor = (planName) => {
    switch (planName.toLowerCase()) {
      case 'starter':
      case 'básico':
        return 'from-green-500 to-emerald-600';
      case 'pro':
      case 'professional':
        return 'from-blue-500 to-indigo-600';
      case 'enterprise':
      case 'empresarial':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400">Carregando planos...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Planos Vision AI</h1>
                <p className="text-gray-300">Escolha o plano ideal para sua jornada de automação</p>
              </div>
            </div>
          </div>

          {/* Plano atual */}
          {currentPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Seu Plano Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${getPlanColor(currentPlan.name)} rounded-lg flex items-center justify-center`}>
                        {(() => {
                          const IconComponent = getPlanIcon(currentPlan.name);
                          return <IconComponent className="w-5 h-5 text-white" />;
                        })()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{currentPlan.name}</h3>
                        <p className="text-gray-300">R$ {currentPlan.price}/mês</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Ativo
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Grid de planos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, index) => {
              const IconComponent = getPlanIcon(plan.name);
              const isCurrentPlan = currentPlan?.id === plan.id;
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className={`h-full flex flex-col relative overflow-hidden ${
                    plan.is_popular 
                      ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/50' 
                      : 'bg-gray-800/50 border-gray-700'
                  } backdrop-blur-sm`}>
                    
                    {/* Badge Popular */}
                    {plan.is_popular && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          Mais Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${getPlanColor(plan.name)} rounded-xl flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-white">
                            {plan.name}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-white">
                              R$ {plan.price}
                            </span>
                            <span className="text-gray-400">/mês</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-grow space-y-6">
                      {/* Recursos do plano */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-300">
                            {plan.max_agents} Agentes IA
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300">
                            {plan.max_routines} Rotinas
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Link className="w-4 h-4 text-purple-400" />
                          <span className="text-gray-300">
                            {plan.max_integrations} Integrações
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      {plan.features && plan.features.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-white">Recursos inclusos:</h4>
                          <div className="space-y-1">
                            {plan.features.slice(0, 4).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-400" />
                                <span className="text-sm text-gray-300">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suporte */}
                      <div className="pt-4 border-t border-gray-700">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">Suporte:</span>
                          <Badge variant="outline" className="text-xs">
                            {plan.support_level === 'basic' ? 'Básico' : 
                             plan.support_level === 'priority' ? 'Prioritário' : 'Premium'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>

                    {/* Botão de ação */}
                    <div className="p-6 pt-0">
                      <Button
                        className={`w-full ${
                          isCurrentPlan
                            ? 'bg-gray-600 hover:bg-gray-700 cursor-not-allowed'
                            : plan.is_popular
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                        }`}
                        disabled={isCurrentPlan}
                      >
                        {isCurrentPlan ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Plano Atual
                          </>
                        ) : (
                          <>
                            <DollarSign className="w-4 h-4 mr-2" />
                            Assinar Plano
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Informações adicionais */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center space-y-4"
          >
            <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    💡 Não encontrou o plano ideal?
                  </h3>
                  <p className="text-gray-300">
                    Entre em contato conosco para criar um plano personalizado para suas necessidades específicas.
                  </p>
                  <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                    Falar com Especialista
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
