/**
 * 🎮 SERVIÇO DE GAMIFICAÇÃO CONSOLIDADO
 * Sistema unificado para admin e cliente
 * Gerencia XP, níveis, missões, conquistas e tokens
 */

import { supabase } from '@/utils/supabase';

// SISTEMA DE XP E NÍVEIS UNIFICADO
export const XP_SYSTEM = {
  levels: [
    { level: 1, xpRequired: 0, title: "Iniciante", icon: "🌟", tokens: 10 },
    { level: 2, xpRequired: 100, title: "Explorer", icon: "🚀", tokens: 25 },
    { level: 3, xpRequired: 300, title: "Pioneiro", icon: "⚡", tokens: 50 },
    { level: 4, xpRequired: 600, title: "Especialista", icon: "🎯", tokens: 75 },
    { level: 5, xpRequired: 1000, title: "Mestre", icon: "👑", tokens: 100 },
    { level: 6, xpRequired: 1500, title: "Lenda", icon: "🏆", tokens: 150 },
    { level: 7, xpRequired: 2200, title: "Vision Master", icon: "🌊", tokens: 200 },
    { level: 8, xpRequired: 3000, title: "Supremo", icon: "💎", tokens: 300 },
    { level: 9, xpRequired: 4000, title: "Transcendente", icon: "🔮", tokens: 500 },
    { level: 10, xpRequired: 5500, title: "Divino", icon: "✨", tokens: 1000 }
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
    token_reward: 5,
    badge_reward_id: "first_chat",
    category: "iniciante"
  },
  {
    title: "Criador de Rotinas",
    description: "Crie sua primeira rotina automatizada",
    type: "create_routine",
    goal: 1,
    xp_reward: 100,
    token_reward: 10,
    badge_reward_id: "routine_creator",
    category: "automacao"
  },
  {
    title: "Mestre dos Agentes",
    description: "Configure 3 agentes diferentes",
    type: "create_agent",
    goal: 3,
    xp_reward: 150,
    token_reward: 15,
    badge_reward_id: "agent_master",
    category: "agentes"
  },
  {
    title: "Perfil Completo",
    description: "Complete todas as informações do seu perfil",
    type: "complete_profile",
    goal: 1,
    xp_reward: 75,
    token_reward: 8,
    badge_reward_id: "profile_complete",
    category: "perfil"
  },
  {
    title: "Conversador Ativo",
    description: "Tenha 10 conversas com o Vision",
    type: "use_vision",
    goal: 10,
    xp_reward: 200,
    token_reward: 20,
    badge_reward_id: "active_user",
    category: "engajamento"
  },
  {
    title: "Sequência de 7 Dias",
    description: "Use o sistema por 7 dias consecutivos",
    type: "daily_streak",
    goal: 7,
    xp_reward: 300,
    token_reward: 30,
    badge_reward_id: "week_streak",
    category: "consistencia"
  },
  {
    title: "Integrador",
    description: "Configure 2 integrações diferentes",
    type: "setup_integration",
    goal: 2,
    xp_reward: 250,
    token_reward: 25,
    badge_reward_id: "integrator",
    category: "integracao"
  }
];

// BADGES/CONQUISTAS PADRÃO
export const DEFAULT_BADGES = [
  {
    id: "first_chat",
    name: "Primeira Conversa",
    description: "Teve a primeira conversa com o Vision",
    icon: "💬",
    color: "bronze",
    rarity: "comum"
  },
  {
    id: "routine_creator",
    name: "Criador de Rotinas",
    description: "Criou sua primeira rotina",
    icon: "⚡",
    color: "silver",
    rarity: "incomum"
  },
  {
    id: "agent_master",
    name: "Mestre dos Agentes",
    description: "Configurou múltiplos agentes",
    icon: "👑",
    color: "gold",
    rarity: "raro"
  },
  {
    id: "profile_complete",
    name: "Perfil Completo",
    description: "Completou todas as informações do perfil",
    icon: "👤",
    color: "bronze",
    rarity: "comum"
  },
  {
    id: "active_user",
    name: "Usuário Ativo",
    description: "Usuário muito ativo na plataforma",
    icon: "⭐",
    color: "gold",
    rarity: "raro"
  },
  {
    id: "week_streak",
    name: "Semana Consistente",
    description: "Usou o sistema por 7 dias seguidos",
    icon: "🔥",
    color: "purple",
    rarity: "epico"
  },
  {
    id: "integrator",
    name: "Integrador",
    description: "Configurou múltiplas integrações",
    icon: "🔗",
    color: "blue",
    rarity: "incomum"
  }
];

// SERVIÇO PRINCIPAL DE GAMIFICAÇÃO
export class GamificationService {
  // CARREGAR DADOS DO USUÁRIO
  static async getUserProgress(userId) {
    try {
      // Primeiro, tentar carregar o usuário existente
      const { data: user, error } = await supabase
        .from('userprofile')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // maybeSingle() em vez de single() para aceitar 0 resultados

      if (error) {
        console.error('Erro ao carregar progresso do usuário:', error);
        return this.getDefaultUserProgress(userId);
      }

      // Se usuário não existe, criar automaticamente
      if (!user) {
        console.log('👤 Usuário não encontrado, criando perfil automaticamente...');
        const newUser = await this.createUserProfile(userId);
        if (newUser) {
          return this.formatUserProgress(newUser);
        } else {
          return this.getDefaultUserProgress(userId);
        }
      }

      return this.formatUserProgress(user);
    } catch (error) {
      console.error('❌ Erro ao carregar progresso do usuário:', error);
      return this.getDefaultUserProgress(userId);
    }
  }

  // Formatar progresso do usuário
  static formatUserProgress(user) {
    const currentLevel = XP_SYSTEM.calculateLevel(user.xp || 0);
    const progressToNext = XP_SYSTEM.getProgressToNext(user.xp || 0);

    return {
      ...user,
      currentLevel,
      progressToNext,
      completedMissions: user.completed_mission_ids || [],
      earnedBadges: user.earned_badge_ids || [],
      tokens: user.tokens || 0
    };
  }

  // DADOS PADRÃO PARA USUÁRIO (fallback)
  static getDefaultUserProgress(userId) {
    const currentLevel = XP_SYSTEM.calculateLevel(0);
    const progressToNext = XP_SYSTEM.getProgressToNext(0);

    return {
      id: userId,
      xp: 0,
      tokens: 0,
      level: 1,
      completed_mission_ids: [],
      earned_badge_ids: [],
      streak: 0,
      total_interactions: 0,
      weeklyProgress: 0,
      weeklyGoal: 50,
      currentLevel,
      progressToNext,
      completedMissions: [],
      earnedBadges: [],
      full_name: 'Usuário',
      email: ''
    };
  }

  // CRIAR PERFIL DE USUÁRIO AUTOMATICAMENTE
  static async createUserProfile(userId) {
    try {
      console.log('🔄 Criando perfil para usuário:', userId);

      // Primeiro, tentar obter dados do auth.users
      let userEmail = '';
      let userFullName = '';
      
      try {
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser?.user && authUser.user.id === userId) {
          userEmail = authUser.user.email || '';
          userFullName = authUser.user.user_metadata?.full_name || 
                         authUser.user.user_metadata?.name || 
                         authUser.user.email?.split('@')[0] || 
                         'Usuário Vision';
        }
      } catch (authError) {
        console.warn('⚠️ Não foi possível obter dados do auth.users:', authError);
        userEmail = '';
        userFullName = 'Usuário Vision';
      }

      // Perfil com estrutura otimizada e resiliente (COLUNAS CORRETAS)
      const defaultProfile = {
        id: userId,
        email: userEmail,
        display_name: userFullName,  // ✅ display_name (não full_name)
        role: 'user',
        plan_id: null,               // ✅ plan_id pode ser null
        tokens: 100,                 // Tokens iniciais de boas-vindas
        xp: 0,
        level: 1,
        completed_mission_ids: [],
        earned_badge_ids: [],
        streak: 0,                   // ✅ streak (não daily_login_streak)
        total_interactions: 0,       // ✅ total_interactions correto
        last_login: new Date().toISOString(),    // ✅ last_login correto
        created_date: new Date().toISOString()   // ✅ created_date (não created_at)
      };

      console.log('📝 Inserindo perfil com estrutura otimizada:', defaultProfile);

      // Primeira tentativa: inserção completa
      const { data: newUser, error } = await supabase
        .from('userprofile')
        .insert([defaultProfile])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao criar perfil completo:', error);
        
        // Segunda tentativa: perfil ultra-mínimo
        console.log('🔄 Tentando criar perfil mínimo...');
        const minimalProfile = {
          id: userId,
          email: userEmail || '',
          full_name: userFullName || 'Usuário Vision',
          created_at: new Date().toISOString()
        };
        
        const { data: minUser, error: minError } = await supabase
          .from('userprofile')
          .insert([minimalProfile])
          .select()
          .single();
          
        if (minError) {
          console.error('❌ Erro mesmo com perfil mínimo:', minError);
          
          // Terceira tentativa: apenas ID (absoluto mínimo)
          console.log('🔄 Tentando criar apenas com ID...');
          const { data: idOnlyUser, error: idError } = await supabase
            .from('userprofile')
            .insert([{ id: userId }])
            .select()
            .single();
            
          if (idError) {
            console.error('❌ Falha total ao criar perfil:', idError);
            return null;
          }
          
          console.log('✅ Perfil ID-only criado:', idOnlyUser);
          return this.populateDefaultValues(idOnlyUser);
        }
        
        console.log('✅ Perfil mínimo criado:', minUser);
        return this.populateDefaultValues(minUser);
      }

      console.log('✅ Perfil completo criado com sucesso:', newUser);
      
      // Tentar criar missões iniciais (não crítico)
      setTimeout(() => {
        this.initializeUserMissions(userId).catch(err => {
          console.warn('⚠️ Erro ao criar missões iniciais (não crítico):', err);
        });
      }, 1000);
      
      return newUser;
    } catch (error) {
      console.error('❌ Erro inesperado ao criar perfil:', error);
      
      // Em caso de erro total, retornar perfil em memória
      console.log('🔄 Retornando perfil em memória como fallback...');
      return this.getDefaultUserProgress(userId);
    }
  }

  // Popular valores padrão para perfils incompletos
  static populateDefaultValues(profile) {
    return {
      ...profile,
      email: profile.email || '',
      display_name: profile.display_name || profile.full_name || 'Usuário Vision',  // ✅ display_name
      role: profile.role || 'user',
      plan_id: profile.plan_id || null,                                            // ✅ pode ser null
      tokens: profile.tokens || 100,
      xp: profile.xp || 0,
      level: profile.level || 1,
      completed_mission_ids: profile.completed_mission_ids || [],
      earned_badge_ids: profile.earned_badge_ids || [],
      streak: profile.streak || profile.daily_login_streak || 0,                   // ✅ streak
      total_interactions: profile.total_interactions || 0,
      last_login: profile.last_login || new Date().toISOString(),
      created_date: profile.created_date || profile.created_at || new Date().toISOString()  // ✅ created_date
    };
  }

  // INICIALIZAR MISSÕES PADRÃO PARA NOVO USUÁRIO
  static async initializeUserMissions(userId) {
    try {
      // Criar apenas as missões de iniciante
      const beginnerMissions = DEFAULT_MISSIONS.filter(m => m.category === 'iniciante');
      
      for (const mission of beginnerMissions) {
        await supabase
          .from('user_missions')
          .insert({
            user_id: userId,
            mission_id: mission.id || mission.title.toLowerCase().replace(/\s+/g, '_'),
            progress: 0,
            completed: false,
            created_at: new Date().toISOString()
          });
      }
      
      console.log('✅ Missões iniciais criadas para usuário:', userId);
    } catch (error) {
      console.error('⚠️ Erro ao criar missões iniciais (não crítico):', error);
    }
  }

  // ADICIONAR XP E TOKENS
  static async addXpAndTokens(userId, xp, tokens = 0, reason = '') {
    try {
      const { data: user, error: fetchError } = await supabase
        .from('userprofile')
        .select('xp, tokens, level')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      const newXp = (user.xp || 0) + xp;
      const newTokens = (user.tokens || 0) + tokens;
      const newLevel = XP_SYSTEM.calculateLevel(newXp);
      const oldLevel = XP_SYSTEM.calculateLevel(user.xp || 0);

      const { error: updateError } = await supabase
        .from('userprofile')
        .update({
          xp: newXp,
          tokens: newTokens,
          level: newLevel.level,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Log da atividade
      console.log(`🎮 +${xp} XP, +${tokens} tokens para usuário ${userId}! ${reason}`);
      
      // Verificar se subiu de nível
      if (newLevel.level > oldLevel.level) {
        console.log(`🎉 Usuário ${userId} subiu para o nível ${newLevel.level}!`);
        // Recompensar tokens por subir de nível
        await this.addXpAndTokens(userId, 0, newLevel.tokens, `Recompensa por atingir nível ${newLevel.level}`);
      }

      return { newXp, newTokens, levelUp: newLevel.level > oldLevel.level, newLevel };
    } catch (error) {
      console.error('Erro ao adicionar XP e tokens:', error);
      return null;
    }
  }

  // COMPLETAR MISSÃO
  static async completeMission(userId, missionId) {
    try {
      const { data: user, error: userError } = await supabase
        .from('userprofile')
        .select('completed_mission_ids')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const completedMissions = user.completed_mission_ids || [];
      if (completedMissions.includes(missionId)) {
        return { success: false, message: 'Missão já completada' };
      }

      const { data: mission, error: missionError } = await supabase
        .from('missions')
        .select('*')
        .eq('id', missionId)
        .single();

      if (missionError) throw missionError;

      // Atualizar missões completadas
      const newCompletedMissions = [...completedMissions, missionId];
      
      const { error: updateError } = await supabase
        .from('userprofile')
        .update({
          completed_mission_ids: newCompletedMissions,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Adicionar recompensas
      await this.addXpAndTokens(
        userId, 
        mission.xp_reward || 0, 
        mission.token_reward || 0, 
        `Missão completada: ${mission.title}`
      );

      // Conceder badge se houver
      if (mission.badge_reward_id) {
        await this.awardBadge(userId, mission.badge_reward_id);
      }

      return { success: true, mission, rewards: { xp: mission.xp_reward, tokens: mission.token_reward } };
    } catch (error) {
      console.error('Erro ao completar missão:', error);
      return { success: false, error };
    }
  }

  // CONCEDER BADGE
  static async awardBadge(userId, badgeId) {
    try {
      const { data: user, error: userError } = await supabase
        .from('userprofile')
        .select('earned_badge_ids')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const earnedBadges = user.earned_badge_ids || [];
      if (earnedBadges.includes(badgeId)) {
        return { success: false, message: 'Badge já conquistado' };
      }

      const newEarnedBadges = [...earnedBadges, badgeId];
      
      const { error: updateError } = await supabase
        .from('userprofile')
        .update({
          earned_badge_ids: newEarnedBadges,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      console.log(`🏆 Badge ${badgeId} concedido ao usuário ${userId}!`);
      return { success: true, badgeId };
    } catch (error) {
      console.error('Erro ao conceder badge:', error);
      return { success: false, error };
    }
  }

  // ESTATÍSTICAS GLOBAIS (PARA ADMIN)
  static async getGlobalStats() {
    try {
      const { data: users, error } = await supabase
        .from('userprofile')
        .select('xp, tokens, level, completed_mission_ids, earned_badge_ids, created_at');

      if (error) throw error;

      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => (u.xp || 0) > 0).length,
        averageXp: users.length > 0 ? Math.round(users.reduce((sum, u) => sum + (u.xp || 0), 0) / users.length) : 0,
        totalXpDistributed: users.reduce((sum, u) => sum + (u.xp || 0), 0),
        totalTokensDistributed: users.reduce((sum, u) => sum + (u.tokens || 0), 0),
        missionCompletions: users.reduce((sum, u) => sum + (u.completed_mission_ids?.length || 0), 0),
        badgeEarnings: users.reduce((sum, u) => sum + (u.earned_badge_ids?.length || 0), 0),
        topUsers: users
          .sort((a, b) => (b.xp || 0) - (a.xp || 0))
          .slice(0, 10)
          .map(u => ({
            ...u,
            currentLevel: XP_SYSTEM.calculateLevel(u.xp || 0)
          }))
      };

      return stats;
    } catch (error) {
      console.error('Erro ao carregar estatísticas globais:', error);
      return null;
    }
  }

  // INICIALIZAR MISSÕES E BADGES PADRÃO
  static async initializeDefaults() {
    try {
      // Verificar se já existem missões
      const { data: existingMissions } = await supabase
        .from('missions')
        .select('id')
        .limit(1);

      if (!existingMissions || existingMissions.length === 0) {
        // Criar missões padrão
        const { error: missionError } = await supabase
          .from('missions')
          .insert(DEFAULT_MISSIONS);

        if (missionError) throw missionError;
        console.log('✅ Missões padrão criadas');
      }

      // Verificar se já existem badges
      const { data: existingBadges } = await supabase
        .from('badges')
        .select('id')
        .limit(1);

      if (!existingBadges || existingBadges.length === 0) {
        // Criar badges padrão
        const { error: badgeError } = await supabase
          .from('badges')
          .insert(DEFAULT_BADGES);

        if (badgeError) throw badgeError;
        console.log('✅ Badges padrão criados');
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao inicializar dados padrão:', error);
      return { success: false, error };
    }
  }

  // RANKING DE USUÁRIOS
  static async getUserRanking(limit = 50) {
    try {
      const { data: users, error } = await supabase
        .from('userprofile')
        .select('id, email, full_name, xp, level, tokens, earned_badge_ids')
        .order('xp', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return users.map((user, index) => ({
        ...user,
        rank: index + 1,
        currentLevel: XP_SYSTEM.calculateLevel(user.xp || 0),
        badgeCount: user.earned_badge_ids?.length || 0
      }));
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
      return [];
    }
  }

  // GASTAR TOKENS
  static async spendTokens(userId, amount, reason = '') {
    try {
      const { data: user, error: fetchError } = await supabase
        .from('userprofile')
        .select('tokens')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      const currentTokens = user.tokens || 0;
      if (currentTokens < amount) {
        return { success: false, message: 'Tokens insuficientes' };
      }

      const newTokens = currentTokens - amount;
      
      const { error: updateError } = await supabase
        .from('userprofile')
        .update({
          tokens: newTokens,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      console.log(`💰 ${amount} tokens gastos pelo usuário ${userId}! ${reason}`);
      return { success: true, newTokens };
    } catch (error) {
      console.error('Erro ao gastar tokens:', error);
      return { success: false, error };
    }
  }
}

export default GamificationService;