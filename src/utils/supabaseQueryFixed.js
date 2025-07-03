/**
 * 🔧 SUPABASE QUERY FIXES - CORREÇÃO DEFINITIVA COM ESTRUTURAS REAIS
 * Queries corrigidas que funcionam com o banco real
 * Estruturas REAIS das tabelas visions e agents confirmadas!
 */

import { supabase } from '@/utils/supabase';

// 🔍 QUERIES CORRIGIDAS PARA USAR AS ESTRUTURAS REAIS
const SupabaseQueryFixed = {
  // ✅ VISIONS - Estrutura REAL: id, user_id, name, description, avatar_url, personality, expertise_areas, is_public, is_active, shared_with, configuration, performance_metrics, created_at, updated_at
  async getVisions(userId) {
    try {
      console.log('🔍 [SUPABASE-VISIONS] Buscando visions para usuário:', userId);
      console.log('🔍 [SUPABASE-VISIONS] Tipo do userId:', typeof userId);
      console.log('🔍 [SUPABASE-VISIONS] UserId é válido?', !!userId);
      
      if (!userId) {
        console.warn('⚠️ [SUPABASE-VISIONS] userId não fornecido, buscando TODAS as visions do sistema...');
        
        // Buscar TODAS as visions para debug (usando estrutura real)
        console.log('🔍 [SUPABASE-VISIONS] Executando query SEM filtros com estrutura real...');
        const { data, error } = await supabase
          .from('visions')
          .select(`
            id,
            user_id,
            name,
            description,
            avatar_url,
            personality,
            expertise_areas,
            is_public,
            is_active,
            shared_with,
            configuration,
            performance_metrics,
            created_at,
            updated_at
          `)
          .order('created_at', { ascending: false })
          .limit(50);
        
        console.log('🔍 [SUPABASE-VISIONS] Query executada, verificando resultado...');
        console.log('🔍 [SUPABASE-VISIONS] Error:', error);
        console.log('🔍 [SUPABASE-VISIONS] Data:', data);
        console.log('🔍 [SUPABASE-VISIONS] Data length:', data?.length);
        
        if (error) {
          console.error('❌ [SUPABASE-VISIONS] Erro ao buscar TODAS as visions:', error);
          console.error('❌ [SUPABASE-VISIONS] Error details:', JSON.stringify(error, null, 2));
          return [];
        }
        
        console.log('✅ [SUPABASE-VISIONS] TODAS as visions carregadas:', data?.length || 0);
        if (data && data.length > 0) {
          console.log('🔍 [SUPABASE-VISIONS] Primeira vision como exemplo:', data[0]);
        }
        return data || [];
      }
      
      // Buscar visions do usuário específico (usando estrutura real)
      console.log('🔍 [SUPABASE-VISIONS] Buscando visions para usuário específico:', userId);
      const { data, error } = await supabase
        .from('visions')
        .select(`
          id,
          user_id,
          name,
          description,
          avatar_url,
          personality,
          expertise_areas,
          is_public,
          is_active,
          shared_with,
          configuration,
          performance_metrics,
          created_at,
          updated_at
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      
      console.log('🔍 [SUPABASE-VISIONS] Query para usuário executada...');
      console.log('🔍 [SUPABASE-VISIONS] Error:', error);
      console.log('🔍 [SUPABASE-VISIONS] Data:', data);
      console.log('🔍 [SUPABASE-VISIONS] Data length:', data?.length);

      if (error) {
        console.error('❌ [SUPABASE-VISIONS] Erro na query de visions:', error);
        console.error('❌ [SUPABASE-VISIONS] Error details:', JSON.stringify(error, null, 2));
        return [];
      }

      console.log('✅ [SUPABASE-VISIONS] Visions carregadas para usuário:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('🔍 [SUPABASE-VISIONS] Primeira vision do usuário:', data[0]);
      }
      return data || [];
    } catch (error) {
      console.error('❌ [SUPABASE-VISIONS] Erro geral:', error.message);
      return [];
    }
  },

  // ✅ AGENTS - Estrutura REAL: id, name, description, icon, color, type, created_date, status, config, capabilities, image_url
  async getAgents() {
    try {
      console.log('🔍 [SUPABASE-AGENTS] Buscando agents da tabela REAL...');
      
      const { data, error } = await supabase
        .from('agents')
        .select(`
          id,
          name,
          description,
          icon,
          color,
          type,
          created_date,
          status,
          config,
          capabilities,
          image_url
        `)
        .eq('status', 'active')
        .order('created_date', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('❌ [SUPABASE-AGENTS] Erro ao buscar agents:', error);
        console.error('❌ [SUPABASE-AGENTS] Error details:', JSON.stringify(error, null, 2));
        return [];
      }
      
      console.log('✅ [SUPABASE-AGENTS] Agents carregados:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('🔍 [SUPABASE-AGENTS] Primeiro agent como exemplo:', data[0]);
      }
      
      return data || [];
    } catch (error) {
      console.error('❌ [SUPABASE-AGENTS] Erro geral:', error.message);
      return [];
    }
  },

  // ✅ PROFILES - Estrutura REAL confirmada
  async getProfiles() {
    try {
      console.log('🔍 [SUPABASE-PROFILES] Buscando profiles...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          avatar_url,
          role,
          created_at,
          updated_at,
          tutorial_completed,
          plan_type,
          company_id
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('❌ [SUPABASE-PROFILES] Erro ao buscar profiles:', error);
        return [];
      }
      
      console.log('✅ [SUPABASE-PROFILES] Profiles carregados:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ [SUPABASE-PROFILES] Erro geral:', error.message);
      return [];
    }
  },

  // ✅ USER VISION CONFIGS - Estrutura REAL confirmada
  async getUserVisionConfigs(userId) {
    try {
      console.log('🔍 [SUPABASE-CONFIGS] Buscando configs para usuário:', userId);
      
      if (!userId) {
        console.warn('⚠️ [SUPABASE-CONFIGS] userId não fornecido');
        return [];
      }
      
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
          is_active,
          created_at,
          updated_at
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ [SUPABASE-CONFIGS] Erro ao buscar configs:', error);
        return [];
      }
      
      console.log('✅ [SUPABASE-CONFIGS] Configs carregadas:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ [SUPABASE-CONFIGS] Erro geral:', error.message);
      return [];
    }
  }
};

// 🔥 EXPORT CORRETO - BOTH NAMED AND DEFAULT
export { SupabaseQueryFixed };
export default SupabaseQueryFixed;
