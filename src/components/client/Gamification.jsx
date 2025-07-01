import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGamification } from '@/contexts/GamificationContext';
import { XP_SYSTEM } from '@/services/gamificationService';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy,
  Target,
  Star,
  Clock,
  BarChart3,
  Zap,
  Users,
  Award,
  Crown,
  Flame,
  Gift,
  Medal,
  TrendingUp,
  Calendar,
  CheckCircle,
  Lock
} from 'lucide-react';

export default function Gamification() {
  const { userStats, loading, addXp, completeMission, spendTokens } = useGamification();
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showRewards, setShowRewards] = useState(false);

  // Configuração de tema
  const themeConfig = {
    background: isDarkTheme ? 'bg-gradient-to-br from-gray-950 via-purple-950/20 to-black' : 'bg-gradient-to-br from-purple-50 via-white to-purple-100',
    cardBg: isDarkTheme ? 'bg-gray-900/60 backdrop-blur-md border-gray-800/60' : 'bg-white/80 backdrop-blur-md border-gray-200',
    text: isDarkTheme ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkTheme ? 'text-gray-300' : 'text-gray-600',
    accent: 'text-purple-400',
    button: isDarkTheme ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const currentLevel = XP_SYSTEM.calculateLevel(userStats.xp);
  const progressToNext = XP_SYSTEM.getProgressToNext(userStats.xp);

  // Conquistas
  const achievements = [
    {
      id: 1,
      title: 'Primeiro Contato',
      description: 'Primeira interação com Vision',
      icon: Star,
      unlocked: true,
      rarity: 'common',
      xpReward: 100,
      unlockedAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Conversador',
      description: '100 interações com Vision',
      icon: Users,
      unlocked: true,
      rarity: 'uncommon',
      xpReward: 250,
      unlockedAt: '2024-01-20'
    },
    {
      id: 3,
      title: 'Visionário Dedicado',
      description: '7 dias consecutivos',
      icon: Flame,
      unlocked: true,
      rarity: 'rare',
      xpReward: 500,
      unlockedAt: '2024-01-25'
    },
    {
      id: 4,
      title: 'Mestre dos Agentes',
      description: 'Gerencie 10 agentes simultaneamente',
      icon: Crown,
      unlocked: true,
      rarity: 'epic',
      xpReward: 1000,
      unlockedAt: '2024-02-01'
    },
    {
      id: 5,
      title: 'Workflow Master',
      description: 'Crie 50 workflows automatizados',
      icon: Trophy,
      unlocked: false,
      rarity: 'legendary',
      xpReward: 2500,
      progress: 32,
      total: 50
    },
    {
      id: 6,
      title: 'Vision Supremo',
      description: 'Alcance o nível 25',
      icon: Medal,
      unlocked: false,
      rarity: 'legendary',
      xpReward: 5000,
      progress: 15,
      total: 25
    }
  ];

  // Recompensas disponíveis
  const rewards = [
    {
      id: 1,
      title: 'Avatar Exclusivo',
      description: 'Avatar dourado para Vision',
      cost: 1000,
      type: 'cosmetic',
      icon: Crown,
      available: true
    },
    {
      id: 2,
      title: 'Boost XP 2x',
      description: '24h de XP duplo',
      cost: 500,
      type: 'boost',
      icon: Zap,
      available: true
    },
    {
      id: 3,
      title: 'Tema Premium',
      description: 'Tema exclusivo do dashboard',
      cost: 750,
      type: 'cosmetic',
      icon: Star,
      available: false
    }
  ];

  // Missões diárias
  const dailyMissions = [
    {
      id: 1,
      title: 'Conversar com Vision',
      description: 'Tenha 5 conversas hoje',
      progress: 3,
      total: 5,
      xpReward: 100,
      completed: false
    },
    {
      id: 2,
      title: 'Criar Workflow',
      description: 'Crie 1 novo workflow',
      progress: 1,
      total: 1,
      xpReward: 200,
      completed: true
    },
    {
      id: 3,
      title: 'Gerenciar Agentes',
      description: 'Interaja com 3 agentes diferentes',
      progress: 2,
      total: 3,
      xpReward: 150,
      completed: false
    }
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'uncommon': return 'text-green-400 border-green-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const xpProgress = progressToNext.nextLevelXP > 0 ? (userStats.xp / progressToNext.nextLevelXP) * 100 : 0;
  const weeklyProgress = (userStats.weeklyGoal || 50) > 0 ? ((userStats.weeklyProgress || 0) / (userStats.weeklyGoal || 50)) * 100 : 0;

  return (
    <div className={`min-h-screen transition-all duration-1000 ${themeConfig.background}`}>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-3"
          >
            <Trophy className="h-8 w-8 text-yellow-400" />
            <h1 className={`text-3xl font-bold ${themeConfig.text}`}>Gamificação</h1>
            <Trophy className="h-8 w-8 text-yellow-400" />
          </motion.div>
          <p className={`text-lg ${themeConfig.textSecondary}`}>
            Acompanhe seu progresso e conquiste recompensas incríveis!
          </p>
        </div>

        {/* Stats Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={themeConfig.cardBg}>
            <CardContent className="p-6 text-center">
              <Crown className={`h-8 w-8 ${themeConfig.accent} mx-auto mb-2`} />
              <p className="text-2xl font-bold">{currentLevel.level}</p>
              <p className={`text-sm ${themeConfig.textSecondary}`}>Nível Atual</p>
              <p className={`text-xs ${themeConfig.accent} mt-1`}>{currentLevel.title}</p>
            </CardContent>
          </Card>

          <Card className={themeConfig.cardBg}>
            <CardContent className="p-6 text-center">
              <Zap className={`h-8 w-8 text-yellow-400 mx-auto mb-2`} />
              <p className="text-2xl font-bold">{userStats.xp.toLocaleString()}</p>
              <p className={`text-sm ${themeConfig.textSecondary}`}>XP Atual</p>
              <Progress value={xpProgress} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className={themeConfig.cardBg}>
            <CardContent className="p-6 text-center">
              <Flame className={`h-8 w-8 text-orange-400 mx-auto mb-2`} />
              <p className="text-2xl font-bold">{userStats.streak || 0}</p>
              <p className={`text-sm ${themeConfig.textSecondary}`}>Dias Consecutivos</p>
              <p className={`text-xs text-orange-400 mt-1`}>🔥 Em chamas!</p>
            </CardContent>
          </Card>

          <Card className={themeConfig.cardBg}>
            <CardContent className="p-6 text-center">
              <Award className={`h-8 w-8 text-green-400 mx-auto mb-2`} />
              <p className="text-2xl font-bold">{userStats.earnedBadges?.length || 0}</p>
              <p className={`text-sm ${themeConfig.textSecondary}`}>Conquistas</p>
              <p className={`text-xs text-green-400 mt-1`}>Desbloqueadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Progresso Semanal */}
        <Card className={themeConfig.cardBg}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${themeConfig.text}`}>
              <Calendar className="h-5 w-5" />
              <span>Meta Semanal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={themeConfig.textSecondary}>Interações esta semana</span>
                <span className={`font-bold ${themeConfig.text}`}>
                  {userStats.weeklyProgress || 0}/{userStats.weeklyGoal || 50}
                </span>
              </div>
              <Progress value={weeklyProgress} className="h-3" />
              <p className={`text-sm ${themeConfig.textSecondary}`}>
                Faltam {(userStats.weeklyGoal || 50) - (userStats.weeklyProgress || 0)} interações para completar a meta semanal
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Missões Diárias */}
        <Card className={themeConfig.cardBg}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${themeConfig.text}`}>
              <Target className="h-5 w-5" />
              <span>Missões Diárias</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyMissions.map((mission) => (
                <motion.div
                  key={mission.id}
                  className={`p-4 rounded-lg border ${mission.completed ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-500/10 border-gray-500/30'}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {mission.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      ) : (
                        <Clock className="h-6 w-6 text-gray-400" />
                      )}
                      <div>
                        <h4 className={`font-semibold ${themeConfig.text}`}>{mission.title}</h4>
                        <p className={`text-sm ${themeConfig.textSecondary}`}>{mission.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={mission.completed ? 'default' : 'secondary'}>
                        +{mission.xpReward} XP
                      </Badge>
                      <div className="mt-1">
                        <Progress 
                          value={(mission.progress / mission.total) * 100} 
                          className="w-20 h-2" 
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conquistas */}
        <Card className={themeConfig.cardBg}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${themeConfig.text}`}>
              <Trophy className="h-5 w-5" />
              <span>Conquistas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      achievement.unlocked 
                        ? getRarityColor(achievement.rarity)
                        : 'border-gray-600 opacity-50'
                    }`}
                    whileHover={{ scale: achievement.unlocked ? 1.05 : 1 }}
                    onClick={() => achievement.unlocked && setSelectedAchievement(achievement)}
                  >
                    <div className="text-center space-y-2">
                      {achievement.unlocked ? (
                        <IconComponent className={`h-8 w-8 mx-auto ${getRarityColor(achievement.rarity).split(' ')[0]}`} />
                      ) : (
                        <Lock className="h-8 w-8 mx-auto text-gray-500" />
                      )}
                      <h4 className={`font-semibold ${themeConfig.text}`}>{achievement.title}</h4>
                      <p className={`text-xs ${themeConfig.textSecondary}`}>{achievement.description}</p>
                      
                      {achievement.unlocked ? (
                        <Badge className={getRarityColor(achievement.rarity)}>
                          +{achievement.xpReward} XP
                        </Badge>
                      ) : (
                        achievement.progress !== undefined && (
                          <div className="space-y-1">
                            <Progress value={(achievement.progress / achievement.total) * 100} className="h-2" />
                            <p className="text-xs text-gray-400">
                              {achievement.progress}/{achievement.total}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Loja de Recompensas */}
        <Card className={themeConfig.cardBg}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${themeConfig.text}`}>
              <Gift className="h-5 w-5" />
              <span>Loja de Recompensas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward) => {
                const IconComponent = reward.icon;
                return (
                  <motion.div
                    key={reward.id}
                    className={`p-4 rounded-lg border ${reward.available ? 'border-blue-500/30 bg-blue-500/10' : 'border-gray-500/30 bg-gray-500/10 opacity-50'}`}
                    whileHover={{ scale: reward.available ? 1.05 : 1 }}
                  >
                    <div className="text-center space-y-3">
                      <IconComponent className={`h-8 w-8 mx-auto ${reward.available ? 'text-blue-400' : 'text-gray-500'}`} />
                      <h4 className={`font-semibold ${themeConfig.text}`}>{reward.title}</h4>
                      <p className={`text-xs ${themeConfig.textSecondary}`}>{reward.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant={reward.available ? 'default' : 'secondary'}>
                          {reward.cost} XP
                        </Badge>
                        <Button 
                          size="sm" 
                          disabled={!reward.available || userStats.xp < reward.cost}
                          className={themeConfig.button}
                        >
                          {reward.available ? 'Resgatar' : 'Indisponível'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}