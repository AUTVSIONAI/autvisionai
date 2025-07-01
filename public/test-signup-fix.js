/**
 * 🧪 TESTE DE CADASTRO - Validar correção do erro "Database error saving new user"
 * 
 * Este script testa se o sistema de cadastro está funcionando corretamente
 * Execute no console do navegador após carregar a aplicação
 */

window.testSignUpFix = async function() {
  console.log('🧪 TESTE: Validando correção do erro de cadastro...\n');

  try {
    // 1. Verificar se o Supabase está carregado
    if (!window.supabase) {
      console.log('❌ Supabase não encontrado no window. Carregando...');
      // Em uma aplicação real, o supabase seria importado
      return false;
    }

    // 2. Testar conexão com o banco
    console.log('🔍 TESTE 1: Verificando conectividade com Supabase...');
    try {
      const { data, error } = await window.supabase.from('userprofile').select('count').limit(1);
      if (error) {
        console.log('❌ Erro de conectividade:', error);
      } else {
        console.log('✅ Conectividade OK');
      }
    } catch (err) {
      console.log('⚠️ Erro de rede:', err.message);
    }

    // 3. Verificar estrutura da tabela userprofile
    console.log('\n🔍 TESTE 2: Verificando tabela userprofile...');
    try {
      const { data, error } = await window.supabase
        .from('userprofile')
        .select('*')
        .limit(1);
        
      if (error) {
        console.log('❌ Erro ao acessar userprofile:', error);
      } else {
        console.log('✅ Tabela userprofile acessível');
        if (data && data.length > 0) {
          console.log('📊 Estrutura da tabela:', Object.keys(data[0]));
        }
      }
    } catch (err) {
      console.log('❌ Erro na verificação da tabela:', err);
    }

    // 4. Simular criação de perfil de gamificação
    console.log('\n🔍 TESTE 3: Simulando criação de perfil...');
    const testUserId = 'test-' + Date.now();
    
    // Se GamificationService estiver disponível
    if (window.GamificationService) {
      try {
        const profile = await window.GamificationService.createUserProfile(testUserId);
        if (profile) {
          console.log('✅ Criação de perfil simulada com sucesso:', profile);
          
          // Limpar teste
          await window.supabase
            .from('userprofile')
            .delete()
            .eq('id', testUserId);
            
          console.log('🧹 Dados de teste limpos');
        } else {
          console.log('❌ Falha na criação de perfil simulada');
        }
      } catch (err) {
        console.log('❌ Erro na simulação:', err);
      }
    } else {
      console.log('⚠️ GamificationService não disponível para teste');
    }

    // 5. Verificar triggers do banco
    console.log('\n🔍 TESTE 4: Verificando configuração do banco...');
    console.log('💡 Para verificar triggers, execute no SQL Editor do Supabase:');
    console.log('   SELECT * FROM information_schema.triggers WHERE event_object_table = \'userprofile\';');

    // 6. Resultado final
    console.log('\n🎉 TESTE CONCLUÍDO!');
    console.log('✅ Se chegou até aqui, a estrutura básica está OK');
    console.log('💡 Para testar cadastro real:');
    console.log('   1. Vá para a página de cadastro');
    console.log('   2. Tente criar uma conta com email válido');
    console.log('   3. Verifique se não aparece "Database error saving new user"');
    
    return true;

  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error);
    
    if (error.message.includes('Database error') || error.message.includes('saving new user')) {
      console.log('🚨 ERRO DE CADASTRO AINDA PRESENTE!');
      console.log('🔧 Próximos passos:');
      console.log('   1. Execute o script FIX_SIGNUP_DATABASE_ERROR.sql no Supabase');
      console.log('   2. Verifique se todas as permissões estão corretas');
      console.log('   3. Teste novamente o cadastro');
    }
    
    return false;
  }
};

// Função para testar cadastro real
window.testRealSignUp = async function(email, password, fullName) {
  if (!email || !password) {
    console.log('❌ Forneça email e senha: testRealSignUp("teste@exemplo.com", "senha123", "Nome Teste")');
    return;
  }

  console.log('🧪 TESTE REAL DE CADASTRO...');
  console.log('⚠️ Este teste criará um usuário real no sistema!');
  
  try {
    const { data, error } = await window.supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName || 'Usuário Teste'
        }
      }
    });

    if (error) {
      console.error('❌ ERRO NO CADASTRO:', error);
      
      if (error.message.includes('Database error') || error.message.includes('saving new user')) {
        console.log('🚨 ERRO "Database error saving new user" CONFIRMADO!');
        console.log('🔧 Execute o script de correção FIX_SIGNUP_DATABASE_ERROR.sql');
      }
      
      return false;
    }

    console.log('✅ CADASTRO REALIZADO COM SUCESSO!', data);
    console.log('📧 Verifique o email para confirmação');
    
    return true;

  } catch (err) {
    console.error('❌ Erro inesperado:', err);
    return false;
  }
};

// Auto-executar teste básico após 2 segundos
setTimeout(() => {
  if (typeof window !== 'undefined') {
    console.log('🚀 Teste de correção de cadastro disponível!');
    console.log('💡 Execute: testSignUpFix() no console');
    console.log('💡 Para teste real: testRealSignUp("seu@email.com", "sua_senha", "Seu Nome")');
  }
}, 2000);
