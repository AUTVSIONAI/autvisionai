/**
 * 🔧 SUPABASE QUERY HELPER - VERSÃO SIMPLES E FUNCIONAL
 * Funções auxiliares para queries corretas (SEM interceptação)
 */

import { supabase } from '@/utils/supabase';

// 🚨 ERROR HANDLER ESPECÍFICO PARA ERRO 400 DO SUPABASE
export const handleSupabaseError = (error, context = {}) => {
  if (error?.status === 400 || error?.message?.includes('400')) {
    console.error('🚨 [SUPABASE-400] Erro 400 detectado:', {
      error: error.message,
      context,
      possibleCause: 'Query malformada com :1 no final',
      solution: 'Verificar sintaxe da query'
    });
    
    // Se for erro de query malformada, tentar fallback
    if (error.message?.includes(':1')) {
      console.log('🔄 [SUPABASE-400] Tentando query de fallback...');
      return null; // Retorna null para usar fallback
    }
  }
  
  throw error; // Re-throw se não for erro 400 conhecido
};

// 🔧 QUERIES CORRIGIDAS PARA USAR NO LUGAR DAS ORIGINAIS
export const SupabaseQueryFixed = {
  // Buscar visions com query corrigida
  async getVisions(userId) {
    try {
      console.log('🔍 [SUPABASE-VISIONS] Executando query corrigida para user:', userId);
      
      if (!userId) {
        console.warn('⚠️ [SUPABASE-VISIONS] UserId não fornecido');
        return [];
      }
      
      const { data, error } = await supabase
        .from('visions')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false }); // ✅ SEM :1
      
      if (error) {
        console.error('❌ [SUPABASE-VISIONS] Erro na query:', error);
        return [];
      }
      
      console.log('✅ [SUPABASE-VISIONS] Dados carregados:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ [SUPABASE-VISIONS] Erro crítico:', error.message);
      return [];
    }
  },
  
  // Buscar agents com query corrigida (COLUNA CORRETA)
  async getAgents() {
    try {
      console.log('🔍 [SUPABASE-AGENTS] Executando query com coluna correta: status');
      
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('status', 'active'); // ✅ CORRIGIDO: usar 'status' em vez de 'is_active'
      
      if (error) {
        console.error('❌ [SUPABASE-AGENTS] Erro na query:', error);
        return [];
      }
      
      console.log('✅ [SUPABASE-AGENTS] Dados carregados:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ [SUPABASE-AGENTS] Erro crítico:', error.message);
      return [];
    }
  },
  
  // Buscar profiles com query corrigida
  async getProfiles() {
    try {
      console.log('🔍 [SUPABASE-PROFILES] Executando query corrigida');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*'); // ✅ SEM :1
      
      if (error) {
        console.error('❌ [SUPABASE-PROFILES] Erro na query:', error);
        return [];
      }
      
      console.log('✅ [SUPABASE-PROFILES] Dados carregados:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ [SUPABASE-PROFILES] Erro crítico:', error.message);
      return [];
    }
  }
};

export default SupabaseQueryFixed;
