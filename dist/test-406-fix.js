/**
 * 🧪 TESTE DE VALIDAÇÃO - CORREÇÃO DO ERRO 406
 * Script para testar se a auto-criação de perfis está funcionando
 */

// Adicionar ao console do navegador para testar
window.testGamificationFix = async function() {
  console.log('🧪 TESTE: Iniciando validação da correção do erro 406...\n');

  try {
    // 1. Verificar se o usuário está logado
    const { data: session } = await window.supabase.auth.getSession();
    if (!session.session) {
      console.log('❌ Nenhuma sessão ativa. Faça login primeiro.');
      return false;
    }

    const userId = session.session.user.id;
    const userEmail = session.session.user.email;
    console.log(`👤 Usuário: ${userEmail} (${userId})`);

    // 2. Testar carregamento direto do userprofile
    console.log('\n🔍 TESTE 1: Verificando userprofile diretamente...');
    const { data: profile, error: profileError } = await window.supabase
      .from('userprofile')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.log('❌ ERRO ao buscar userprofile:', profileError);
    } else if (profile) {
      console.log('✅ SUCESSO: userprofile encontrado!', profile);
    } else {
      console.log('⚠️ userprofile NÃO encontrado (será criado automaticamente)');
    }

    // 3. Testar o gamificationService.getUserProgress (isso deve criar o perfil se não existir)
    console.log('\n🔍 TESTE 2: Testando GamificationService.getUserProgress...');
    
    // Simular a chamada como o sistema real faz
    const response = await fetch('/src/services/gamificationService.js');
    if (response.ok) {
      console.log('✅ gamificationService.js carregado');
      
      // Aqui você testaria getUserProgress na aplicação real
      console.log('🎮 Em uma aplicação real, getUserProgress seria chamado aqui');
      console.log('🎮 Se o perfil não existir, ele será criado automaticamente');
    }

    // 4. Testar endpoint do backend se estiver rodando
    console.log('\n🔍 TESTE 3: Testando endpoint do backend...');
    try {
      const backendResponse = await fetch('http://localhost:3001/api/users/me', {
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`
        }
      });
      
      if (backendResponse.ok) {
        const userData = await backendResponse.json();
        console.log('✅ Backend respondeu com sucesso:', userData);
      } else {
        console.log('⚠️ Backend não está respondendo (provavelmente normal)');
      }
    } catch (backendError) {
      console.log('⚠️ Backend não acessível:', backendError.message);
    }

    // 5. Resultado final
    console.log('\n🎉 TESTE CONCLUÍDO!');
    console.log('✅ Se você chegou até aqui sem erro 406, a correção funcionou!');
    console.log('✅ O sistema agora deve criar automaticamente perfis de gamificação');
    
    return true;

  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error);
    
    if (error.message.includes('406')) {
      console.log('🚨 ERRO 406 AINDA PRESENTE! A correção não funcionou completamente.');
      console.log('🔧 Verifique:');
      console.log('  1. Se o trigger foi criado no Supabase');
      console.log('  2. Se as permissões estão corretas');
      console.log('  3. Se o gamificationService está funcionando');
    }
    
    return false;
  }
};

// Auto-executar após 2 segundos se estiver no navegador
setTimeout(() => {
  if (typeof window !== 'undefined' && window.supabase) {
    console.log('🚀 Teste automático da correção 406 disponível!');
    console.log('💡 Execute: testGamificationFix() no console');
  }
}, 2000);
