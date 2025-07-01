import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  CheckCircle, 
  Clock, 
  Star, 
  Gift,
  Trophy,
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function MissionsList({ isDarkTheme = true }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [completedMissions, setCompletedMissions] = useState(new Set());

  // Configuração de tema
  const themeConfig = isDarkTheme ? {
    cardBg: 'from-gray-900 via-slate-800 to-gray-900',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    border: 'border-cyan-500/30',
    accent: 'text-cyan-400',
    buttonActive: 'bg-cyan-500/20 text-cyan-400',
    buttonInactive: 'text-gray-400 hover:text-cyan-400',
    missionBg: 'bg-gray-800/40',
    missionBorder: 'border-gray-700/50'
  } : {
    cardBg: 'from-white via-gray-50 to-gray-100',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-cyan-600/40',
    accent: 'text-cyan-600',
    buttonActive: 'bg-cyan-600/20 text-cyan-600',
    buttonInactive: 'text-gray-600 hover:text-cyan-600',
    missionBg: 'bg-white/60',
    missionBorder: 'border-gray-200/50'
  };

  // CATEGORIAS DE MISSÕES
  const categories = [
    { id: 'all', label: 'Todas', icon: Target },
    { id: 'daily', label: 'Diárias', icon: Calendar },
    { id: 'weekly', label: 'Semanais', icon: Clock },
    { id: 'achievements', label: 'Conquistas', icon: Trophy },
  ];

  // MISSÕES MOCK EXPANDIDAS
  const allMissions = [
    // MISSÕES DIÁRIAS
    {
      id: 1,
      title: 'Primeira Conversa do Dia',
      description: 'Converse com seu Vision Companion pela manhã',
      category: 'daily',
      progress: 100,
      maxProgress: 100,
      completed: true,
      reward: '+25 XP',
      icon: '☀️',
      difficulty: 'easy',
      timeLimit: '24h'
    },
    {
      id: 2,
      title: 'Comando por Voz',
      description: 'Use o reconhecimento de voz para dar um comando',
      category: 'daily',
      progress: 0,
      maxProgress: 100,
      completed: false,
      reward: '+30 XP',
      icon: '🎤',
      difficulty: 'easy',
      timeLimit: '24h'
    },
    {
      id: 3,
      title: 'Explorador de Recursos',
      description: 'Explore 3 funcionalidades diferentes do sistema',
      category: 'daily',
      progress: 33,
      maxProgress: 100,
      completed: false,
      reward: '+40 XP',
      icon: '🔍',
      difficulty: 'medium',
      timeLimit: '24h'
    },

    // MISSÕES SEMANAIS
    {
      id: 4,
      title: 'Mestre das Automações',
      description: 'Configure 5 automações diferentes esta semana',
      category: 'weekly',
      progress: 60,
      maxProgress: 100,
      completed: false,
      reward: '+150 XP',
      icon: '⚡',
      difficulty: 'hard',
      timeLimit: '7 dias'
    },
    {
      id: 5,
      title: 'Conversador Social',
      description: 'Tenha 20 conversas significativas com o Vision',
      category: 'weekly',
      progress: 45,
      maxProgress: 100,
      completed: false,
      reward: '+100 XP',
      icon: '💬',
      difficulty: 'medium',
      timeLimit: '7 dias'
    },
    {
      id: 6,
      title: 'Integrador Expert',
      description: 'Conecte 3 aplicativos externos ao sistema',
      category: 'weekly',
      progress: 0,
      maxProgress: 100,
      completed: false,
      reward: '+200 XP',
      icon: '🔗',
      difficulty: 'hard',
      timeLimit: '7 dias'
    },

    // CONQUISTAS
    {
      id: 7,
      title: 'Primeiro Contato',
      description: 'Complete seu primeiro comando no sistema',
      category: 'achievements',
      progress: 100,
      maxProgress: 100,
      completed: true,
      reward: '+50 XP + Avatar',
      icon: '🎯',
      difficulty: 'easy',
      permanent: true
    },
    {
      id: 8,
      title: 'Viciado em IA',
      description: 'Use o sistema por 7 dias consecutivos',
      category: 'achievements',
      progress: 71,
      maxProgress: 100,
      completed: false,
      reward: '+300 XP + Título',
      icon: '🔥',
      difficulty: 'medium',
      permanent: true
    },
    {
      id: 9,
      title: 'Lenda da AUTVISION',
      description: 'Atinja o nível 10 e domine todos os recursos',
      category: 'achievements',
      progress: 30,
      maxProgress: 100,
      completed: false,
      reward: '+1000 XP + Crown',
      icon: '👑',
      difficulty: 'legendary',
      permanent: true
    }
  ];

  // FILTRAR MISSÕES
  const filteredMissions = selectedCategory === 'all' 
    ? allMissions 
    : allMissions.filter(mission => mission.category === selectedCategory);

  // ESTATÍSTICAS
  const totalMissions = allMissions.length;
  const completedCount = allMissions.filter(m => m.completed).length;
  const dailyMissions = allMissions.filter(m => m.category === 'daily');
  const weeklyMissions = allMissions.filter(m => m.category === 'weekly');
  const achievements = allMissions.filter(m => m.category === 'achievements');

  // CORES BASEADAS NA DIFICULDADE
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 border-green-500/30 bg-green-500/20';
      case 'medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/20';
      case 'hard': return 'text-red-400 border-red-500/30 bg-red-500/20';
      case 'legendary': return 'text-purple-400 border-purple-500/30 bg-purple-500/20';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/20';
    }
  };

  // SIMULAR COMPLETAR MISSÃO
  const completeMission = (missionId) => {
    setCompletedMissions(prev => new Set([...prev, missionId]));
  };

  return (
    <div className="space-y-6">
      {/* HEADER COM ESTATÍSTICAS */}
      <div className={`bg-gradient-to-r ${themeConfig.cardBg} rounded-xl p-6 border ${themeConfig.border}`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl lg:text-3xl font-bold ${themeConfig.text} mb-2 flex items-center gap-3`}>
              <Target className={`w-8 h-8 ${themeConfig.accent}`} />
              Missões e Conquistas
            </h1>
            <p className={themeConfig.textSecondary}>
              Complete missões para ganhar XP e evoluir seu Vision Companion!
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="text-center">
              <p className={`text-2xl font-bold ${themeConfig.text}`}>{completedCount}</p>
              <p className="text-sm text-green-400">Completadas</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${themeConfig.text}`}>{totalMissions - completedCount}</p>
              <p className="text-sm text-yellow-400">Pendentes</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${themeConfig.text}`}>{Math.floor((completedCount / totalMissions) * 100)}%</p>
              <p className={`text-sm ${themeConfig.accent}`}>Progresso</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <Progress value={(completedCount / totalMissions) * 100} className={`h-3 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'}`} />
        </div>
      </div>

      {/* CATEGORIAS */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                isActive
                  ? `${themeConfig.buttonActive} ${isDarkTheme ? 'border-cyan-500' : 'border-cyan-600'}`
                  : `${isDarkTheme ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-100/50 border-gray-300'} ${themeConfig.buttonInactive} hover:${isDarkTheme ? 'bg-gray-700/50' : 'bg-gray-200/50'}`
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{category.label}</span>
              {category.id === 'daily' && (
                <Badge className="bg-green-500/20 text-green-400 text-xs">
                  {dailyMissions.filter(m => !m.completed).length}
                </Badge>
              )}
              {category.id === 'weekly' && (
                <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                  {weeklyMissions.filter(m => !m.completed).length}
                </Badge>
              )}
              {category.id === 'achievements' && (
                <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                  {achievements.filter(m => !m.completed).length}
                </Badge>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* LISTA DE MISSÕES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="wait">
          {filteredMissions.map((mission) => {
            const isCompleted = mission.completed || completedMissions.has(mission.id);
            
            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <Card className={`relative overflow-hidden transition-all hover:scale-[1.02] ${
                  isCompleted 
                    ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30' 
                    : `bg-gradient-to-br ${themeConfig.cardBg} ${themeConfig.missionBorder} hover:${isDarkTheme ? 'border-cyan-500/50' : 'border-cyan-600/50'}`
                }`}>
                  {/* COMPLETED OVERLAY */}
                  {isCompleted && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-4 right-4 z-10"
                    >
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </motion.div>
                  )}

                  <CardHeader>
                    <CardTitle className="flex items-start gap-3">
                      <div className="text-3xl">{mission.icon}</div>
                      <div className="flex-1">
                        <h3 className={`${themeConfig.text} font-bold text-lg mb-2`}>{mission.title}</h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={getDifficultyColor(mission.difficulty)}>
                            {mission.difficulty === 'easy' && '⭐'}
                            {mission.difficulty === 'medium' && '⭐⭐'}
                            {mission.difficulty === 'hard' && '⭐⭐⭐'}
                            {mission.difficulty === 'legendary' && '👑'}
                            {mission.difficulty.charAt(0).toUpperCase() + mission.difficulty.slice(1)}
                          </Badge>
                          
                          {mission.timeLimit && !mission.permanent && (
                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                              <Clock className="w-3 h-3 mr-1" />
                              {mission.timeLimit}
                            </Badge>
                          )}
                          
                          {mission.permanent && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                              <Star className="w-3 h-3 mr-1" />
                              Conquista
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className={`${themeConfig.textSecondary} leading-relaxed`}>{mission.description}</p>
                    
                    {/* PROGRESS BAR */}
                    {!isCompleted && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className={themeConfig.textSecondary}>Progresso</span>
                          <span className={`${themeConfig.text} font-medium`}>{mission.progress}%</span>
                        </div>
                        <Progress value={mission.progress} className={`h-2 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'}`} />
                      </div>
                    )}

                    {/* REWARD */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-medium">{mission.reward}</span>
                      </div>
                      
                      {!isCompleted && (
                        <Button
                          onClick={() => completeMission(mission.id)}
                          disabled={mission.progress < 100}
                          className={`${
                            mission.progress >= 100
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                              : 'bg-gray-600 cursor-not-allowed'
                          }`}
                          size="sm"
                        >
                          {mission.progress >= 100 ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Completar
                            </>
                          ) : (
                            <>
                              <ArrowRight className="w-4 h-4 mr-2" />
                              {100 - mission.progress}% restante
                            </>
                          )}
                        </Button>
                      )}
                      
                      {isCompleted && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completa!
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* DAILY RESET TIMER */}
      {selectedCategory === 'daily' && (
        <Card className={`bg-gradient-to-r ${isDarkTheme ? 'from-blue-900/30 to-cyan-900/30 border-blue-500/30' : 'from-blue-100/80 to-cyan-100/80 border-blue-400/40'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className={`w-5 h-5 ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`${themeConfig.text} font-medium`}>Próximo reset das missões diárias</span>
              </div>
              <Badge className={`${isDarkTheme ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-600/20 text-blue-600 border-blue-600/30'}`}>
                <Clock className="w-4 h-4 mr-2" />
                {new Date(Date.now() + 24 * 60 * 60 * 1000 - (Date.now() % (24 * 60 * 60 * 1000))).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

MissionsList.propTypes = {
  isDarkTheme: PropTypes.bool
};
