// 🎯 VISION PERSONALIZATION SERVICE - Gerencia personalização do Vision por usuário
import { supabase } from '@/utils/supabase';

export class VisionPersonalizationService {
  
  // 📝 OBTER CONFIGURAÇÃO DO VISION DO USUÁRIO
  static async getUserVisionConfig(userId) {
    try {
      if (!userId) {
        return this.getDefaultConfig();
      }

      const { data, error } = await supabase
        .rpc('get_user_vision_config', { p_user_id: userId });
      
      if (error) {
        console.error('❌ Erro ao buscar config do Vision:', error);
        return this.getDefaultConfig();
      }
      
      return data || this.getDefaultConfig();
    } catch (error) {
      console.error('❌ Erro ao obter configuração do Vision:', error);
      return this.getDefaultConfig();
    }
  }

  // 🎨 TROCAR NOME DO VISION (UMA VEZ APENAS)
  static async changeVisionName(userId, newName) {
    try {
      if (!userId || !newName) {
        throw new Error('User ID e nome são obrigatórios');
      }

      // Validar nome (entre 3 e 50 caracteres, sem caracteres especiais)
      if (newName.length < 3 || newName.length > 50) {
        throw new Error('O nome deve ter entre 3 e 50 caracteres');
      }

      if (!/^[a-zA-ZÀ-ÿ0-9\s]+$/.test(newName)) {
        throw new Error('O nome só pode conter letras, números e espaços');
      }

      const { data, error } = await supabase
        .rpc('change_vision_name', { 
          p_user_id: userId, 
          p_new_name: newName.trim() 
        });
      
      if (error) {
        console.error('❌ Erro ao trocar nome do Vision:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('❌ Erro ao alterar nome do Vision:', error);
      throw error;
    }
  }

  // ⚙️ ATUALIZAR OUTRAS CONFIGURAÇÕES
  static async updateVisionSettings(userId, settings) {
    try {
      if (!userId) {
        throw new Error('User ID é obrigatório');
      }

      const updateData = {};
      
      // Apenas campos permitidos para atualização
      if (settings.voice_enabled !== undefined) {
        updateData.voice_enabled = settings.voice_enabled;
      }
      if (settings.auto_speak !== undefined) {
        updateData.auto_speak = settings.auto_speak;
      }
      if (settings.theme_color !== undefined) {
        updateData.theme_color = settings.theme_color;
      }
      if (settings.vision_personality !== undefined) {
        updateData.vision_personality = settings.vision_personality;
      }

      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('user_vision_configs')
        .upsert([{
          user_id: userId,
          ...updateData
        }])
        .select();
      
      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('❌ Erro ao atualizar configurações:', error);
      throw error;
    }
  }

  // 📋 OBTER HISTÓRICO DE NOMES (ADMIN) - USANDO USERPROFILE
  static async getNameHistory(userId = null) {
    try {
      let query = supabase
        .from('vision_name_history')
        .select(`
          id,
          user_id,
          old_name,
          new_name,
          changed_at
        `)
        .order('changed_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: history, error } = await query;
      
      if (error) throw error;
      
      // Se não há histórico, retornar array vazio
      if (!history || history.length === 0) {
        return [];
      }
      
      // Buscar dados dos usuários separadamente da tabela userprofile
      const userIds = [...new Set(history.map(h => h.user_id))];
      const { data: userProfiles, error: userError } = await supabase
        .from('userprofile')
        .select('id, user_id, full_name, email')
        .in('user_id', userIds);
      
      if (userError) {
        console.warn('⚠️ Erro ao buscar userprofile no histórico:', userError);
      }
      
      // Combinar dados
      const historyWithUsers = history.map(item => ({
        ...item,
        userprofile: userProfiles?.find(u => u.id === item.user_id) || {
          full_name: 'Usuário',
          email: 'usuario@sistema.com'
        }
      }));
      
      return historyWithUsers;
    } catch (error) {
      console.error('❌ Erro ao buscar histórico de nomes:', error);
      return [];
    }
  }

  // 👥 LISTAR TODOS OS VISIONS PERSONALIZADOS (ADMIN) - VERSÃO SIMPLES
  static async getAllVisionConfigs() {
    try {
      console.log('🚀 Carregando Vision configs (método simples)...');
      
      // Query básica sem JOIN para evitar recursão infinita
      const { data, error } = await supabase
        .from('user_vision_configs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('❌ Erro na query básica:', error);
        throw error;
      }
      
      console.log('✅ Vision configs carregados:', data?.length || 0, 'registros');
      return data || [];
    } catch (error) {
      console.error('❌ Erro ao listar configs do Vision:', error);
      return [];
    }
  }

  // 🔍 MÉTODO ALTERNATIVO PARA TESTE DE CONEXÃO
  static async testConnection() {
    try {
      console.log('🧪 Testando conexão com user_vision_configs...');
      
      const { count, error } = await supabase
        .from('user_vision_configs')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      
      console.log('✅ Conexão OK - Total de registros:', count);
      return { success: true, count };
    } catch (error) {
      console.error('❌ Teste de conexão falhou:', error);
      return { success: false, error };
    }
  }

  // 👥 LISTAR CONFIGS COM DADOS DE USUÁRIO (VERSÃO ROBUSTA - USANDO USERPROFILE)
  static async getAllVisionConfigsWithUsers() {
    try {
      console.log('🚀 Carregando configs dos Visions...');
      
      // Primeiro, buscar as configurações
      const { data: configs, error: configError } = await supabase
        .from('user_vision_configs')
        .select(`
          id,
          user_id,
          vision_name,
          vision_personality,
          voice_enabled,
          auto_speak,
          theme_color,
          has_customized_name,
          customization_date,
          created_at,
          is_active
        `)
        .eq('is_active', true)
        .order('customization_date', { ascending: false });
      
      if (configError) throw configError;
      
      if (!configs || configs.length === 0) {
        console.log('⚠️ Nenhuma configuração encontrada');
        return [];
      }
      
      console.log(`✅ ${configs.length} configurações carregadas`);
      
      // Buscar dados dos usuários da tabela userprofile (evitando recursão)
      const userIds = [...new Set(configs.map(config => config.user_id))];
      console.log(`📋 Buscando dados de ${userIds.length} usuários via userprofile...`);
      
      const { data: userProfiles, error: profileError } = await supabase
        .from('userprofile')
        .select('id, full_name, email, avatar_url')
        .in('id', userIds);
      
      if (profileError) {
        console.warn('⚠️ Erro ao buscar userprofile, continuando sem dados de usuário:', profileError);
      }
      
      // Combinar os dados
      const configsWithUsers = configs.map(config => ({
        ...config,
        userprofile: userProfiles?.find(p => p.id === config.user_id) || {
          full_name: 'Usuário',
          email: 'usuario@sistema.com',
          avatar_url: null
        }
      }));
      
      console.log('🎯 Dados combinados com sucesso:', configsWithUsers.length);
      return configsWithUsers;
      
    } catch (error) {
      console.error('❌ Erro no método robusto:', error);
      return [];
    }
  }

  // 👥 LISTAR TODOS OS VISIONS COM USERPROFILE (SEM RECURSÃO)
  static async getAllVisionConfigsWithUserProfile() {
    try {
      console.log('🚀 Carregando Vision configs com userprofile...');
      
      // Primeiro carregar configs básicos
      const { data: configs, error: configError } = await supabase
        .from('user_vision_configs')
        .select(`
          id,
          user_id,
          vision_name,
          vision_personality,
          voice_enabled,
          auto_speak,
          theme_color,
          has_customized_name,
          customization_date,
          created_at,
          is_active
        `)
        .eq('is_active', true)
        .order('customization_date', { ascending: false });
      
      if (configError) {
        console.error('❌ Erro ao buscar configs:', configError);
        throw configError;
      }
      
      if (!configs || configs.length === 0) {
        console.log('📭 Nenhuma configuração encontrada');
        return [];
      }
      
      console.log(`✅ Encontrados ${configs.length} configs, buscando dados dos usuários...`);
      
      // Buscar dados dos usuários da tabela userprofile
      const userIds = [...new Set(configs.map(config => config.user_id))];
      const { data: users, error: userError } = await supabase
        .from('userprofile')
        .select('id, full_name, email, avatar_url')
        .in('id', userIds);
      
      if (userError) {
        console.warn('⚠️ Erro ao buscar userprofile, continuando sem dados de usuário:', userError);
      }
      
      // Combinar dados
      const configsWithUsers = configs.map(config => {
        const userProfile = users?.find(u => u.id === config.user_id);
        return {
          ...config,
          userprofile: userProfile || null
        };
      });
      
      console.log(`🎯 Processados ${configsWithUsers.length} configs com dados de usuário`);
      return configsWithUsers;
      
    } catch (error) {
      console.error('❌ Erro ao listar configs com userprofile:', error);
      return [];
    }
  }

  // 📊 ESTATÍSTICAS DE PERSONALIZAÇÃO (ADMIN)
  static async getPersonalizationStats() {
    try {
      const { data: total, error: totalError } = await supabase
        .from('user_vision_configs')
        .select('id', { count: 'exact' });

      const { data: customized, error: customizedError } = await supabase
        .from('user_vision_configs')
        .select('id', { count: 'exact' })
        .eq('has_customized_name', true);

      const { data: recent, error: recentError } = await supabase
        .from('user_vision_configs')
        .select('id', { count: 'exact' })
        .gte('customization_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (totalError || customizedError || recentError) {
        throw new Error('Erro ao obter estatísticas');
      }

      return {
        total_users: total?.length || 0,
        customized_names: customized?.length || 0,
        recent_customizations: recent?.length || 0,
        customization_rate: total?.length ? ((customized?.length || 0) / total.length * 100).toFixed(1) : '0.0'
      };
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error);
      return {
        total_users: 0,
        customized_names: 0,
        recent_customizations: 0,
        customization_rate: '0.0'
      };
    }
  }

  // 🔧 CONFIGURAÇÃO PADRÃO
  static getDefaultConfig() {
    return {
      vision_name: 'Vision',
      vision_personality: 'Assistente inteligente e prestativo',
      voice_enabled: true,
      auto_speak: false,
      theme_color: 'blue',
      has_customized_name: false,
      can_change_name: true,
      customization_date: null
    };
  }

  // 🎨 CORES DISPONÍVEIS PARA TEMA
  static getAvailableThemes() {
    return [
      { value: 'blue', label: 'Azul', color: '#3B82F6' },
      { value: 'purple', label: 'Roxo', color: '#8B5CF6' },
      { value: 'green', label: 'Verde', color: '#10B981' },
      { value: 'red', label: 'Vermelho', color: '#EF4444' },
      { value: 'yellow', label: 'Amarelo', color: '#F59E0B' },
      { value: 'pink', label: 'Rosa', color: '#EC4899' },
      { value: 'indigo', label: 'Índigo', color: '#6366F1' },
      { value: 'gray', label: 'Cinza', color: '#6B7280' }
    ];
  }

  // 🤖 PERSONALIDADES DISPONÍVEIS
  static getAvailablePersonalities() {
    return [
      'Assistente inteligente e prestativo',
      'Companheiro amigável e descontraído',
      'Consultor profissional e formal',
      'Mentor sábio e experiente',
      'Parceiro criativo e inovador',
      'Guia técnico especializado',
      'Amigo leal e confiável',
      'Coach motivacional e energético'
    ];
  }

  // 👥 MÉTODO ULTRA-SIMPLES - SEM JOIN E SEM REFERÊNCIAS (PARA ADMIN)
  static async getVisionConfigsSimple() {
    try {
      console.log('🚀 Carregando Vision configs (método ultra-simples)...');
      
      // Query minimalista sem JOIN, sem referências, só dados básicos
      const { data, error } = await supabase
        .from('user_vision_configs')
        .select(`
          id,
          user_id,
          vision_name,
          vision_personality,
          voice_enabled,
          auto_speak,
          theme_color,
          has_customized_name,
          customization_date,
          created_at,
          updated_at,
          is_active
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('❌ Erro na query ultra-simples:', error);
        throw error;
      }
      
      console.log(`✅ Vision configs carregados (ultra-simples): ${data?.length || 0} registros`);
      console.log('📊 Dados recebidos:', data);
      
      return data || [];
    } catch (error) {
      console.error('❌ Erro no método ultra-simples:', error);
      return [];
    }
  }

  // 🚨 MÉTODO DE EMERGÊNCIA: Retorna dados simulados quando RLS falha
  static getVisionConfigsEmergency() {
    console.log('🚨 MODO EMERGÊNCIA: Retornando dados simulados devido a falha no RLS');
    
    // Dados simulados baseados em padrões reais
    const emergencyData = [
      {
        id: 'emergency-1',
        user_id: 'user-1',
        vision_name: 'Questão',
        vision_personality: 'analytical',
        voice_enabled: true,
        auto_speak: false,
        theme_color: '#3B82F6',
        has_customized_name: true,
        customization_date: '2024-12-15T10:00:00Z',
        created_at: '2024-12-15T10:00:00Z',
        updated_at: '2024-12-15T10:00:00Z',
        is_active: true
      },
      {
        id: 'emergency-2',
        user_id: 'user-2',
        vision_name: 'Echo',
        vision_personality: 'friendly',
        voice_enabled: false,
        auto_speak: false,
        theme_color: '#10B981',
        has_customized_name: true,
        customization_date: '2024-12-20T14:30:00Z',
        created_at: '2024-12-20T14:30:00Z',
        updated_at: '2024-12-20T14:30:00Z',
        is_active: true
      },
      {
        id: 'emergency-3',
        user_id: 'user-3',
        vision_name: 'Social',
        vision_personality: 'social',
        voice_enabled: true,
        auto_speak: true,
        theme_color: '#F59E0B',
        has_customized_name: true,
        customization_date: '2025-01-01T09:15:00Z',
        created_at: '2025-01-01T09:15:00Z',
        updated_at: '2025-01-01T09:15:00Z',
        is_active: true
      },
      {
        id: 'emergency-4',
        user_id: 'user-4',
        vision_name: 'Nova',
        vision_personality: 'creative',
        voice_enabled: false,
        auto_speak: false,
        theme_color: '#8B5CF6',
        has_customized_name: true,
        customization_date: '2025-01-05T16:45:00Z',
        created_at: '2025-01-05T16:45:00Z',
        updated_at: '2025-01-05T16:45:00Z',
        is_active: true
      }
    ];
    
    return emergencyData;
  }
}
