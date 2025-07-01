// SISTEMA DE GAMIFICAÇÃO COMPLETO - FLUXO CORRIGIDO
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Mission } from '@/api/entities';
import { Badge } from '@/api/entities';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Crown, Award, Target, Coins } from 'lucide-react';

// SISTEMA DE XP E NÍVEIS
export const XP_SYSTEM = {
  levels: [
    { level: 1, xpRequired: 0, title: "Iniciante", icon: "🌟", tokens: 10 },
    { level: 2, xpRequired: 100, title: "Explorer", icon: "🚀", tokens: 25 },
    { level: 3, xpRequired: 300, title: "Pioneiro", icon: "⚡", tokens: 50 },
    { level: 4, xpRequired: 600, title: "Especialista", icon: "🎯", tokens: 75 },
    { level: 5, xpRequired: 1000, title: "Mestre", icon: "👑", tokens: 100 },
    { level: 6, xpRequired: 1500, title: "Lenda", icon: "🏆", tokens: 150 },
    { level: 7, xpRequired: 2200, title: "Vision Master", icon: "🌊", tokens: 200 }
  ],

  calculateLevel: (xp) => {
    for (let i = XP_SYSTEM.levels.length - 1; i >= 0; i--) {
      if (xp >= XP_SYSTEM.levels[i].xpRequired) {
        return XP_SYSTEM.levels[i];
      }
    }
    return XP_SYSTEM.levels[0];
  },

  getProgressToNext: (xp) => {
    const currentLevel = XP_SYSTEM.calculateLevel(xp);
    const currentIndex = XP_SYSTEM.levels.findIndex(l => l.level === currentLevel.level);
    
    if (currentIndex === XP_SYSTEM.levels.length - 1) {
      return { progress: 100, needed: 0, nextLevel: null };
    }

    const nextLevel = XP_SYSTEM.levels[currentIndex + 1];
    const currentLevelXp = currentLevel.xpRequired;
    const nextLevelXp = nextLevel.xpRequired;
    const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
    
    return {
      progress: Math.min(progress, 100),
      needed: Math.max(0, nextLevelXp - xp),
      nextLevel
    };
  }
};

// MISSÕES PADRÃO DO SISTEMA
export const DEFAULT_MISSIONS = [
  {
    title: "Primeira Conversa",
    description: "Tenha sua primeira conversa com o Vision",
    type: "use_vision",
    goal: 1,
    xp_reward: 50,
    badge_reward_id: "first_chat"
  },
  {
    title: "Criador de Rotinas",
    description: "Crie sua primeira rotina automatizada",
    type: "create_routine",
    goal: 1,
    xp_reward: 100,
    badge_reward_id: "routine_creator"
  },
  {
    title: "Mestre dos Agentes",
    description: "Configure 3 agentes diferentes",
    type: "create_agent",
    goal: 3,
    xp_reward: 150,
    badge_reward_id: "agent_master"
  },
  {
    title: "Perfil Completo",
    description: "Complete todas as informações do seu perfil",
    type: "complete_profile",
    goal: 1,
    xp_reward: 75,
    badge_reward_id: "profile_complete"
  },
  {
    title: "Conversador Ativo",
    description: "Tenha 10 conversas com o Vision",
    type: "use_vision",
    goal: 10,
    xp_reward: 200,
    badge_reward_id: "active_user"
  }
];

// BADGES/CONQUISTAS PADRÃO
export const DEFAULT_BADGES = [
  {
    name: "Primeira Conversa",
    description: "Teve a primeira conversa com o Vision",
    icon: "MessageSquare",
    color: "bronze"
  },
  {
    name: "Criador de Rotinas",
    description: "Criou sua primeira rotina",
    icon: "Zap",
    color: "silver"
  },
  {
    name: "Mestre dos Agentes",
    description: "Configurou múltiplos agentes",
    icon: "Crown",
    color: "gold"
  },
  {
    name: "Perfil Completo",
    description: "Completou todas as informações do perfil",
    icon: "User",
    color: "bronze"
  },
  {
    name: "Usuário Ativo",
    description: "Usuário muito ativo na plataforma",
    icon: "Star",
    color: "gold"
  }
];

// HOOK PARA GAMIFICAÇÃO
export const useGamification = (userEmail) => {
  const [userProgress, setUserProgress] = useState({
    xp: 0,
    level: 1,
    completedMissions: [],
    earnedBadges: [],
    tokens: 0
  });

  const [availableMissions, setAvailableMissions] = useState([]);
  const [recentAchievements, setRecentAchievements] = useState([]);

  useEffect(() => {
    if (userEmail) {
      loadUserProgress();
      loadMissions();
    }
  }, [userEmail]);

  const loadUserProgress = async () => {
    try {
      const user = await User.filter({ email: userEmail });
      if (user.length > 0) {
        const userData = user[0];
        setUserProgress({
          xp: userData.xp || 0,
          level: XP_SYSTEM.calculateLevel(userData.xp || 0).level,
          completedMissions: userData.completed_mission_ids || [],
          earnedBadges: userData.earned_badge_ids || [],
          tokens: userData.tokens || 0
        });
      }
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    }
  };

  const loadMissions = async () => {
    try {
      const missions = await Mission.list();
      setAvailableMissions(missions);
    } catch (error) {
      console.error('Erro ao carregar missões:', error);
    }
  };

  const completeAction = async (actionType, amount = 1) => {
    try {
      // Verificar missões relacionadas a essa ação
      const relevantMissions = availableMissions.filter(
        mission => mission.type === actionType && 
        !userProgress.completedMissions.includes(mission.id)
      );

      let totalXpGained = 0;
      let newBadges = [];
      let completedMissionIds = [...userProgress.completedMissions];

      for (const mission of relevantMissions) {
        // Simular progresso da missão (em produção, isso seria rastreado no backend)
        const currentProgress = 1; // Placeholder - seria o progresso real
        
        if (currentProgress >= mission.goal) {
          totalXpGained += mission.xp_reward;
          completedMissionIds.push(mission.id);
          
          if (mission.badge_reward_id) {
            newBadges.push(mission.badge_reward_id);
          }

          setRecentAchievements(prev => [{
            type: 'mission',
            title: mission.title,
            xp: mission.xp_reward,
            timestamp: Date.now()
          }, ...prev.slice(0, 4)]);
        }
      }

      // Atualizar usuário
      if (totalXpGained > 0) {
        const newXp = userProgress.xp + totalXpGained;
        const oldLevel = XP_SYSTEM.calculateLevel(userProgress.xp);
        const newLevel = XP_SYSTEM.calculateLevel(newXp);
        
        // Verificar se subiu de nível
        let bonusTokens = 0;
        if (newLevel.level > oldLevel.level) {
          bonusTokens = newLevel.tokens;
          setRecentAchievements(prev => [{
            type: 'level_up',
            title: `Nível ${newLevel.level} Alcançado!`,
            subtitle: newLevel.title,
            tokens: bonusTokens,
            timestamp: Date.now()
          }, ...prev.slice(0, 4)]);
        }

        await User.updateMyUserData({
          xp: newXp,
          completed_mission_ids: completedMissionIds,
          earned_badge_ids: [...userProgress.earnedBadges, ...newBadges],
          tokens: userProgress.tokens + bonusTokens
        });

        setUserProgress(prev => ({
          ...prev,
          xp: newXp,
          level: newLevel.level,
          completedMissions: completedMissionIds,
          earnedBadges: [...prev.earnedBadges, ...newBadges],
          tokens: prev.tokens + bonusTokens
        }));
      }

    } catch (error) {
      console.error('Erro ao completar ação:', error);
    }
  };

  return {
    userProgress,
    availableMissions: availableMissions.filter(m => !userProgress.completedMissions.includes(m.id)),
    recentAchievements,
    completeAction,
    levelInfo: XP_SYSTEM.calculateLevel(userProgress.xp),
    progressToNext: XP_SYSTEM.getProgressToNext(userProgress.xp)
  };
};

// COMPONENTE DE NOTIFICAÇÃO DE CONQUISTA
export const AchievementNotification = ({ achievement, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-lg shadow-2xl text-white min-w-80"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          {achievement.type === 'level_up' ? (
            <Crown className="w-6 h-6" />
          ) : (
            <Trophy className="w-6 h-6" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{achievement.title}</h3>
          {achievement.subtitle && (
            <p className="text-white/90 text-sm">{achievement.subtitle}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            {achievement.xp && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded">
                +{achievement.xp} XP
              </span>
            )}
            {achievement.tokens && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded flex items-center gap-1">
                <Coins className="w-3 h-3" />
                +{achievement.tokens}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};