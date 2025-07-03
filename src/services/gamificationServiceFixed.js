// 🔧 CORREÇÃO TEMPORÁRIA PARA GAMIFICATION SERVICE
// Esta função substituirá a createUserProfile problemática

import { supabase } from '@/lib/supabase';

export const createUserProfileFixed = async (userId) => {
  try {
    console.log('🔄 [FIXED] Criando perfil para usuário:', userId);

    // 1. Verificar se já existe
    const { data: existing } = await supabase
      .from('userprofile')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (existing) {
      console.log('✅ [FIXED] Perfil já existe');
      return existing;
    }

    // 2. Obter dados do usuário autenticado com fallback seguro
    let userEmail = `user_${userId.substring(0, 8)}@autvision.ai`;
    let userName = 'Usuário Vision';
    
    try {
      const { data: authUser } = await supabase.auth.getUser();
      if (authUser?.user && authUser.user.id === userId) {
        userEmail = authUser.user.email || userEmail;
        userName = authUser.user.user_metadata?.full_name || 
                   authUser.user.user_metadata?.name || 
                   authUser.user.email?.split('@')[0] || 
                   userName;
      }
    } catch (authError) {
      console.warn('⚠️ [FIXED] Usando dados padrão:', authError.message);
    }

    // 3. Criar perfil com estrutura mínima mas funcional
    const profileData = {
      id: userId,
      email: userEmail,
      display_name: userName,
      full_name: userName,
      role: 'user',
      tokens: 100,
      xp: 0,
      level: 1,
      completed_mission_ids: [],
      earned_badge_ids: [],
      streak: 0,
      total_interactions: 0
    };

    console.log('📝 [FIXED] Criando com dados:', profileData);

    const { data: newProfile, error } = await supabase
      .from('userprofile')
      .insert([profileData])
      .select()
      .single();

    if (error) {
      console.error('❌ [FIXED] Erro ao criar perfil:', error);
      
      // Se der erro de email duplicado, tentar com email único
      if (error.code === '23505' && error.message.includes('email')) {
        const uniqueEmail = `user_${userId}@autvision.local`;
        profileData.email = uniqueEmail;
        
        console.log('🔄 [FIXED] Tentando com email único:', uniqueEmail);
        
        const { data: retryProfile, error: retryError } = await supabase
          .from('userprofile')
          .insert([profileData])
          .select()
          .single();

        if (retryError) {
          console.error('❌ [FIXED] Falha na segunda tentativa:', retryError);
          throw retryError;
        }

        console.log('✅ [FIXED] Perfil criado na segunda tentativa');
        return retryProfile;
      }
      
      throw error;
    }

    console.log('✅ [FIXED] Perfil criado com sucesso');
    return newProfile;

  } catch (error) {
    console.error('❌ [FIXED] Erro geral:', error);
    // Retornar dados em memória como último recurso
    return {
      id: userId,
      email: `user_${userId.substring(0, 8)}@autvision.ai`,
      display_name: 'Usuário Vision',
      full_name: 'Usuário Vision',
      role: 'user',
      tokens: 100,
      xp: 0,
      level: 1,
      completed_mission_ids: [],
      earned_badge_ids: [],
      streak: 0,
      total_interactions: 0,
      _isMemoryOnly: true // Flag para indicar que é apenas em memória
    };
  }
};
