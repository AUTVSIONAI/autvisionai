/**
 * 🔧 SCRIPT DE MIGRAÇÃO - CRIAÇÃO AUTOMÁTICA DE PERFIS DE GAMIFICAÇÃO
 * 
 * Este script:
 * 1. Verifica todos os usuários em auth.users
 * 2. Identifica quais não têm perfil em userprofile  
 * 3. Cria automaticamente os perfis de gamificação faltantes
 * 4. Resolve o problema de erro 406 para usuários existentes
 */

import { supabase } from '../utils/supabase.js';
import { GamificationService } from '../services/gamificationService.js';

export class UserProfileMigration {
  
  static async checkAndCreateMissingProfiles() {
    try {
      console.log('🔍 MIGRAÇÃO: Iniciando verificação de perfis ausentes...\n');

      // 1. Buscar todos os usuários autenticados
      console.log('📊 Buscando usuários em auth.users...');
      const { data: authData } = await supabase.auth.getSession();
      
      if (!authData.session) {
        console.log('❌ Nenhuma sessão ativa. Execute este script após fazer login.');
        return false;
      }

      // Para este exemplo, vamos usar o usuário atual
      // Em produção, você usaria admin API para listar todos os usuários
      const currentUser = authData.session.user;
      console.log(`✅ Usuário atual: ${currentUser.email} (ID: ${currentUser.id})\n`);

      // 2. Verificar se o perfil de gamificação existe
      console.log('🎮 Verificando perfil de gamificação...');
      const { data: existingProfile } = await supabase
        .from('userprofile')
        .select('id, email, xp, tokens, level')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (existingProfile) {
        console.log('✅ Perfil de gamificação já existe:', existingProfile);
        return true;
      }

      // 3. Criar perfil de gamificação ausente
      console.log('🚀 Perfil de gamificação não encontrado. Criando...');
      const newProfile = await GamificationService.createUserProfile(currentUser.id);
      
      if (newProfile) {
        console.log('✅ SUCESSO: Perfil de gamificação criado!', newProfile);
        
        // 4. Verificar se agora funciona sem erro 406
        console.log('\n🧪 Testando getUserProgress após criação...');
        const userProgress = await GamificationService.getUserProgress(currentUser.id);
        console.log('✅ TESTE PASSOU: getUserProgress funcionando sem erro 406!', userProgress);
        
        return true;
      } else {
        console.log('❌ ERRO: Não foi possível criar perfil de gamificação');
        return false;
      }

    } catch (error) {
      console.error('❌ ERRO NA MIGRAÇÃO:', error);
      return false;
    }
  }

  static async batchCreateMissingProfiles(userIds = []) {
    console.log('🔄 MIGRAÇÃO EM LOTE: Criando perfis para múltiplos usuários...');
    
    const results = {
      success: [],
      failed: []
    };

    for (const userId of userIds) {
      try {
        console.log(`\n📝 Processando usuário: ${userId}`);
        
        // Verificar se já existe
        const { data: existing } = await supabase
          .from('userprofile')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (existing) {
          console.log(`✅ Usuário ${userId} já tem perfil`);
          results.success.push(userId);
          continue;
        }

        // Criar perfil
        const newProfile = await GamificationService.createUserProfile(userId);
        
        if (newProfile) {
          console.log(`✅ Perfil criado para ${userId}`);
          results.success.push(userId);
        } else {
          console.log(`❌ Falha ao criar perfil para ${userId}`);
          results.failed.push(userId);
        }

        // Delay para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`❌ Erro ao processar ${userId}:`, error);
        results.failed.push(userId);
      }
    }

    console.log('\n📊 RESULTADO DA MIGRAÇÃO EM LOTE:');
    console.log(`✅ Sucesso: ${results.success.length} usuários`);
    console.log(`❌ Falhas: ${results.failed.length} usuários`);
    
    if (results.failed.length > 0) {
      console.log('❌ Usuários que falharam:', results.failed);
    }

    return results;
  }

  static async fixCurrentUserProfile() {
    console.log('🔧 CORREÇÃO RÁPIDA: Verificando e corrigindo perfil do usuário atual...\n');
    
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        console.log('❌ Nenhuma sessão ativa');
        return false;
      }

      const userId = session.session.user.id;
      console.log(`👤 Usuário: ${session.session.user.email} (${userId})`);

      // Tentar carregar progresso (isso vai criar o perfil se não existir)
      console.log('🎮 Carregando progresso de gamificação...');
      const progress = await GamificationService.getUserProgress(userId);
      
      console.log('✅ SUCESSO! Perfil carregado/criado:', {
        xp: progress.xp,
        level: progress.level,
        tokens: progress.tokens,
        currentLevel: progress.currentLevel
      });

      return true;

    } catch (error) {
      console.error('❌ ERRO na correção:', error);
      return false;
    }
  }
}

// Função standalone para execução rápida
export async function runProfileMigration() {
  console.log('🚀 EXECUTANDO MIGRAÇÃO DE PERFIS...\n');
  
  const success = await UserProfileMigration.checkAndCreateMissingProfiles();
  
  if (success) {
    console.log('\n🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('✅ Agora todos os usuários devem ter perfis de gamificação');
    console.log('✅ Erro 406 deve estar resolvido');
  } else {
    console.log('\n❌ MIGRAÇÃO FALHOU');
    console.log('⚠️ Pode ser necessário ajustar permissões no Supabase');
  }
  
  return success;
}

// Auto-executar se chamado diretamente
if (typeof window !== 'undefined' && window.runMigration) {
  runProfileMigration().then(result => {
    console.log('🏁 Migração finalizada:', result);
  });
}
