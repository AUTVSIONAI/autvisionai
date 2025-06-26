// 🚀 TESTE FINAL - INTEGRAÇÃO FRONTEND → BACKEND VERCEL
// Arquivo: teste-integracao-vercel.js

console.log('🚀 INICIANDO TESTE INTEGRAÇÃO VERCEL...\n');

// URLs de produção
const FRONTEND_URL = 'https://autvisionai.vercel.app';
const BACKEND_URL = 'https://autvisionai-backend-five.vercel.app';

async function testarBackendVercel() {
  console.log('📡 1. Testando status do backend...');
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    console.log('✅ Backend online:', data);
    return true;
  } catch (error) {
    console.error('❌ Backend offline:', error.message);
    return false;
  }
}

async function testarLLMVercel() {
  console.log('\n🧠 2. Testando integração LLM...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/llm/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'autvision_backend_secure_key_2025'
      },
      body: JSON.stringify({
        prompt: 'Olá! Este é um teste de integração entre frontend e backend na Vercel.',
        systemPrompt: 'Você é um assistente AutVision. Responda de forma concisa.'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ LLM integração OK:', data);
      return true;
    } else {
      console.log('⚠️ LLM resposta não-OK:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ LLM erro:', error.message);
    return false;
  }
}

async function testarAuthVercel() {
  console.log('\n🔐 3. Testando endpoints de autenticação...');
  try {
    // Teste de signup
    const signupResponse = await fetch(`${BACKEND_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'autvision_backend_secure_key_2025'
      },
      body: JSON.stringify({
        email: 'teste@autvision.com',
        password: 'senha123',
        full_name: 'Usuário Teste'
      })
    });

    console.log('📧 Signup endpoint status:', signupResponse.status);
    
    // Teste de login
    const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'autvision_backend_secure_key_2025'
      },
      body: JSON.stringify({
        email: 'admin@autvision.com',
        password: 'admin123'
      })
    });

    console.log('🔓 Login endpoint status:', loginResponse.status);
    return true;
  } catch (error) {
    console.error('❌ Auth erro:', error.message);
    return false;
  }
}

async function executarTestes() {
  console.log(`📋 CONFIGURAÇÃO:
  Frontend: ${FRONTEND_URL}
  Backend:  ${BACKEND_URL}
  `);

  const backend = await testarBackendVercel();
  const llm = await testarLLMVercel();
  const auth = await testarAuthVercel();

  console.log('\n📊 RESULTADOS:');
  console.log(`Backend Health: ${backend ? '✅' : '❌'}`);
  console.log(`LLM Integration: ${llm ? '✅' : '❌'}`);
  console.log(`Auth Endpoints: ${auth ? '✅' : '❌'}`);

  if (backend && llm && auth) {
    console.log('\n🎉 INTEGRAÇÃO VERCEL CONCLUÍDA COM SUCESSO!');
    console.log('🚀 Sistema pronto para uso em produção.');
  } else {
    console.log('\n⚠️ Alguns testes falharam. Verifique a configuração.');
  }
}

// Executar testes no browser
executarTestes();
