import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  MessageSquare, 
  Settings, 
  Brain,
  Mic,
  Users,
  Calendar,
  BarChart3,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function QuickActions({ isDarkTheme = true }) {
  // Configuração de tema
  const themeConfig = isDarkTheme ? {
    cardBg: 'from-gray-900 via-slate-800 to-gray-900',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    border: 'border-cyan-500/30',
    borderPurple: 'border-purple-500/30',
    borderBlue: 'border-blue-500/50',
    hoverBlue: 'hover:bg-blue-500/10'
  } : {
    cardBg: 'from-white via-gray-50 to-gray-100',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-cyan-600/40',
    borderPurple: 'border-purple-600/40',
    borderBlue: 'border-blue-600/50',
    hoverBlue: 'hover:bg-blue-600/10'
  };
  const quickActions = [
    {
      id: 'voice-command',
      title: 'Comando por Voz',
      description: 'Fale com seu Vision',
      icon: Mic,
      color: 'from-green-500 to-emerald-500',
      action: () => {
        // Trigger voice command
        window.dispatchEvent(new CustomEvent('startVoiceCommand'));
      }
    },
    {
      id: 'quick-chat',
      title: 'Chat Rápido',
      description: 'Conversa instantânea',
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-500',
      action: () => {
        // Focus on text input
        window.dispatchEvent(new CustomEvent('focusTextInput'));
      }
    },
    {
      id: 'ai-analysis',
      title: 'Análise IA',
      description: 'Insights inteligentes',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      action: () => {
        // Trigger AI analysis
        window.dispatchEvent(new CustomEvent('triggerAnalysis'));
      }
    },
    {
      id: 'automation',
      title: 'Nova Automação',
      description: 'Criar rotina',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      action: () => {
        // Open automation creator
        console.log('Abrindo criador de automação...');
      }
    }
  ];

  const tips = [
    {
      id: 1,
      title: 'Dica Pro',
      content: 'Use comandos de voz para interações mais naturais com seu Vision Companion.',
      icon: '💡'
    },
    {
      id: 2,
      title: 'Evolução',
      content: 'Quanto mais você usar o sistema, mais inteligente seu Vision ficará!',
      icon: '🚀'
    },
    {
      id: 3,
      title: 'Missões',
      content: 'Complete missões diárias para ganhar XP e desbloquear recursos.',
      icon: '🎯'
    }
  ];

  const upcomingFeatures = [
    { name: 'Integração WhatsApp', status: 'Em breve', icon: '📱' },
    { name: 'Vision Avatars 3D', status: 'Desenvolvimento', icon: '🌟' },
    { name: 'Modo Colaborativo', status: 'Planejamento', icon: '👥' }
  ];

  return (
    <div className="space-y-6">
      {/* QUICK ACTIONS */}
      <Card className={`bg-gradient-to-br ${themeConfig.cardBg} border ${themeConfig.border}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkTheme ? 'text-cyan-400' : 'text-cyan-600'}`}>
            <Zap className="w-5 h-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={action.action}
                    className={`w-full h-auto p-4 bg-gradient-to-r ${action.color} hover:opacity-90 flex flex-col items-center gap-2 text-white border-0`}
                  >
                    <Icon className="w-6 h-6" />
                    <div className="text-center">
                      <p className="font-bold text-sm">{action.title}</p>
                      <p className="text-xs opacity-90">{action.description}</p>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* NAVIGATION SHORTCUTS */}
      <Card className={`bg-gradient-to-br ${themeConfig.cardBg} border ${themeConfig.borderPurple}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkTheme ? 'text-purple-400' : 'text-purple-600'}`}>
            <ArrowRight className="w-5 h-5" />
            Navegação Rápida
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className={`w-full justify-start ${themeConfig.borderBlue} ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'} ${themeConfig.hoverBlue}`}
            onClick={() => window.dispatchEvent(new CustomEvent('navigateToStats'))}
          >
            <BarChart3 className="w-4 h-4 mr-3" />
            Ver Estatísticas Completas
          </Button>
          
          <Button
            variant="outline"
            className={`w-full justify-start ${isDarkTheme ? 'border-green-500/50 text-green-400 hover:bg-green-500/10' : 'border-green-600/50 text-green-600 hover:bg-green-600/10'}`}
            onClick={() => window.dispatchEvent(new CustomEvent('navigateToMissions'))}
          >
            <Calendar className="w-4 h-4 mr-3" />
            Todas as Missões
          </Button>
          
          <Button
            variant="outline"
            className={`w-full justify-start ${isDarkTheme ? 'border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10' : 'border-yellow-600/50 text-yellow-600 hover:bg-yellow-600/10'}`}
            onClick={() => window.dispatchEvent(new CustomEvent('navigateToAgents'))}
          >
            <Users className="w-4 h-4 mr-3" />
            Gerenciar Agentes
          </Button>
          
          <Button
            variant="outline"
            className={`w-full justify-start ${isDarkTheme ? 'border-gray-500/50 text-gray-400 hover:bg-gray-500/10' : 'border-gray-600/50 text-gray-600 hover:bg-gray-600/10'}`}
            onClick={() => window.dispatchEvent(new CustomEvent('navigateToSettings'))}
          >
            <Settings className="w-4 h-4 mr-3" />
            Configurações
          </Button>
        </CardContent>
      </Card>

      {/* DAILY TIP */}
      <Card className={`bg-gradient-to-br ${isDarkTheme ? 'from-amber-900/30 to-orange-900/30 border-amber-500/30' : 'from-amber-100/80 to-orange-100/80 border-amber-400/40'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkTheme ? 'text-amber-400' : 'text-amber-600'}`}>
            <Sparkles className="w-5 h-5" />
            Dica do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tips.map((tip, index) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`flex items-start gap-3 p-3 ${isDarkTheme ? 'bg-black/20' : 'bg-white/50'} rounded-lg border ${isDarkTheme ? 'border-amber-500/20' : 'border-amber-400/30'} mb-3 last:mb-0`}
            >
              <div className="text-2xl">{tip.icon}</div>
              <div>
                <h4 className={`${isDarkTheme ? 'text-amber-400' : 'text-amber-600'} font-medium text-sm mb-1`}>{tip.title}</h4>
                <p className={`${isDarkTheme ? 'text-amber-200' : 'text-amber-700'} text-xs leading-relaxed`}>{tip.content}</p>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* UPCOMING FEATURES */}
      <Card className={`bg-gradient-to-br ${isDarkTheme ? 'from-indigo-900/30 to-purple-900/30 border-indigo-500/30' : 'from-indigo-100/80 to-purple-100/80 border-indigo-400/40'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkTheme ? 'text-indigo-400' : 'text-indigo-600'}`}>
            <Brain className="w-5 h-5" />
            Novidades em Breve
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingFeatures.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 ${isDarkTheme ? 'bg-black/20' : 'bg-white/50'} rounded-lg border ${isDarkTheme ? 'border-indigo-500/20' : 'border-indigo-400/30'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{feature.icon}</span>
                <span className={`${themeConfig.text} text-sm font-medium`}>{feature.name}</span>
              </div>
              <Badge className={`text-xs ${
                feature.status === 'Em breve' 
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : feature.status === 'Desenvolvimento'
                  ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
              }`}>
                {feature.status}
              </Badge>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* SYSTEM STATUS */}
      <Card className={`bg-gradient-to-br ${isDarkTheme ? 'from-emerald-900/30 to-green-900/30 border-emerald-500/30' : 'from-emerald-100/80 to-green-100/80 border-emerald-400/40'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className={`${isDarkTheme ? 'text-emerald-400' : 'text-emerald-600'} font-medium text-sm`}>Sistema Online</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                API: 99.9%
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                IA: Ativa
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

QuickActions.propTypes = {
  isDarkTheme: PropTypes.bool
};
