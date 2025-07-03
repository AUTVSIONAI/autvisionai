/**
 * 🎮 GAMIFICATION CONTEXT
 * Sistema de gamificação para engajamento do usuário
 * Gerencia XP, níveis, conquistas e recompensas
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import GamificationService from '@/services/gamificationService'; // REATIVADO!
import { useAuth } from './AuthContext';

const GamificationContext = createContext();

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification deve ser usado dentro de GamificationProvider');
  }
  return context;
};

export const GamificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalXp: 0,
    tokens: 0,
    achievements: [],
    completedMissions: [],
    earnedBadges: [],
    streak: 0,
    lastActivity: null,
    currentLevel: null,
    progressToNext: null,
    weeklyProgress: 0,
    weeklyGoal: 50
  });
  const [loading, setLoading] = useState(true);

  // Carregar dados do usuário quando autenticado
  useEffect(() => {
    const loadUserData = async () => {
      if (user?.id) {
        try {
          // Reativar carregamento de dados de gamificação
          console.log('🎮 GamificationContext: Carregando dados do usuário...', user.id);
          
          const progress = await GamificationService.getUserProgress(user.id);
          console.log('🎮 GamificationContext: Dados carregados:', progress);
          
          if (progress) {
            setUserStats({
              level: progress.currentLevel?.level || 1,
              xp: progress.xp || 0,
              xpToNextLevel: progress.progressToNext?.needed || 100,
              totalXp: progress.xp || 0,
              tokens: progress.tokens || 0,
              achievements: progress.earnedBadges || [],
              completedMissions: progress.completedMissions || [],
              earnedBadges: progress.earnedBadges || [],
              streak: progress.streak || 0,
              lastActivity: progress.lastActivity,
              currentLevel: progress.currentLevel,
              progressToNext: progress.progressToNext,
              weeklyProgress: progress.weeklyProgress || 0,
              weeklyGoal: progress.weeklyGoal || 50
            });
          }
        } catch (error) {
          console.error('Erro ao carregar dados de gamificação:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user?.id]);

  const [achievements] = useState([
    {
      id: 'first_vision',
      name: 'Primeira Visão',
      description: 'Ativou sua primeira Vision',
      icon: '👁️',
      xpReward: 50,
      unlocked: false
    },
    {
      id: 'agent_master',
      name: 'Mestre dos Agentes',
      description: 'Criou 5 agentes diferentes',
      icon: '🤖',
      xpReward: 100,
      unlocked: false
    },
    {
      id: 'streak_week',
      name: 'Semana Consistente',
      description: 'Usou o sistema por 7 dias seguidos',
      icon: '🔥',
      xpReward: 200,
      unlocked: false
    },
    {
      id: 'power_user',
      name: 'Usuário Avançado',
      description: 'Alcançou o nível 10',
      icon: '⭐',
      xpReward: 500,
      unlocked: false
    }
  ]);

  // Adicionar XP usando o serviço consolidado
  const addXp = useCallback(async (amount, tokens = 0, reason = '') => {
    if (!user?.id) return;
    
    try {
      const result = await GamificationService.addXpAndTokens(user.id, amount, tokens, reason);
      if (result) {
        // Recarregar dados do usuário
        const progress = await GamificationService.getUserProgress(user.id);
        if (progress) {
          setUserStats({
            level: progress.currentLevel?.level || 1,
            xp: progress.xp || 0,
            xpToNextLevel: progress.progressToNext?.needed || 100,
            totalXp: progress.xp || 0,
            tokens: progress.tokens || 0,
            achievements: progress.earnedBadges || [],
            completedMissions: progress.completedMissions || [],
            earnedBadges: progress.earnedBadges || [],
            streak: progress.streak || 0,
            lastActivity: progress.lastActivity,
            currentLevel: progress.currentLevel,
            progressToNext: progress.progressToNext
          });
        }
        
        if (result.levelUp) {
          console.log(`🎉 Parabéns! Você subiu para o nível ${result.newLevel.level}!`);
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar XP:', error);
    }
  }, [user?.id]);

  // Completar missão
  const completeMission = useCallback(async (missionId) => {
    if (!user?.id) return;
    
    try {
      const result = await GamificationService.completeMission(user.id, missionId);
      if (result.success) {
        // Recarregar dados do usuário
        const progress = await GamificationService.getUserProgress(user.id);
        if (progress) {
          setUserStats({
            level: progress.currentLevel?.level || 1,
            xp: progress.xp || 0,
            xpToNextLevel: progress.progressToNext?.needed || 100,
            totalXp: progress.xp || 0,
            tokens: progress.tokens || 0,
            achievements: progress.earnedBadges || [],
            completedMissions: progress.completedMissions || [],
            earnedBadges: progress.earnedBadges || [],
            streak: progress.streak || 0,
            lastActivity: progress.lastActivity,
            currentLevel: progress.currentLevel,
            progressToNext: progress.progressToNext
          });
        }
        console.log(`🎯 Missão completada: ${result.mission.title}`);
        return result;
      }
    } catch (error) {
      console.error('Erro ao completar missão:', error);
    }
  }, [user?.id]);

  // Gastar tokens
  const spendTokens = useCallback(async (amount, reason = '') => {
    if (!user?.id) return;
    
    try {
      const result = await GamificationService.spendTokens(user.id, amount, reason);
      if (result.success) {
        setUserStats(prev => ({
          ...prev,
          tokens: result.newTokens
        }));
        console.log(`💰 ${amount} tokens gastos: ${reason}`);
        return result;
      }
    } catch (error) {
      console.error('Erro ao gastar tokens:', error);
    }
  }, [user?.id]);

  // Desbloquear conquista
  const unlockAchievement = useCallback((achievementId) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return;
    
    setUserStats(prev => {
      if (prev.achievements.includes(achievementId)) {
        return prev; // Já desbloqueada
      }
      
      console.log(`🏆 Conquista desbloqueada: ${achievement.name}!`);
      addXp(achievement.xpReward, `Conquista: ${achievement.name}`);
      
      return {
        ...prev,
        achievements: [...prev.achievements, achievementId]
      };
    });
  }, [achievements, addXp]);

  // Atualizar streak
  const updateStreak = useCallback(() => {
    setUserStats(prev => {
      const now = new Date();
      const lastActivity = prev.lastActivity ? new Date(prev.lastActivity) : null;
      
      if (!lastActivity) {
        // Primeira atividade
        return {
          ...prev,
          streak: 1,
          lastActivity: now.toISOString()
        };
      }
      
      const daysDiff = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Dia consecutivo
        const newStreak = prev.streak + 1;
        
        // Verificar conquista de streak
        if (newStreak === 7) {
          unlockAchievement('streak_week');
        }
        
        return {
          ...prev,
          streak: newStreak,
          lastActivity: now.toISOString()
        };
      } else if (daysDiff > 1) {
        // Quebrou o streak
        return {
          ...prev,
          streak: 1,
          lastActivity: now.toISOString()
        };
      }
      
      // Mesmo dia
      return prev;
    });
  }, [unlockAchievement]);

  // Ações que geram XP
  const actions = {
    activateVision: () => {
      addXp(25, 'Vision ativada');
      unlockAchievement('first_vision');
    },
    createAgent: () => {
      addXp(15, 'Agente criado');
    },
    completeTask: () => {
      addXp(10, 'Tarefa completada');
    },
    dailyLogin: () => {
      updateStreak();
      addXp(5, 'Login diário');
    },
    chatInteraction: () => {
      addXp(2, 'Interação no chat');
    }
  };

  // Verificar conquistas baseadas em nível
  useEffect(() => {
    if (userStats.level >= 10 && !userStats.achievements.includes('power_user')) {
      unlockAchievement('power_user');
    }
  }, [userStats.level, userStats.achievements, unlockAchievement]);

  const value = {
    userStats,
    achievements,
    loading,
    addXp,
    completeMission,
    spendTokens,
    unlockAchievement,
    updateStreak,
    actions
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};

GamificationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default GamificationProvider;