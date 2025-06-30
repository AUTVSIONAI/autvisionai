#!/usr/bin/env node

/**
 * 🔄 AUTVISION SYNC VALIDATOR
 * Valida se toda a sincronização está funcionando 100%
 */

const API_BASE_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:3002';

console.log('🔄 AUTVISION SYNC VALIDATOR - INICIANDO...\n');

// Função para testar endpoint
async function testEndpoint(url, name) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'x-api-key': 'autvision_backend_secure_key_2025'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log(`✅ ${name} - OK (${response.status})`);
      return true;
    } else {
      console.log(`⚠️ ${name} - Status ${response.status}`);
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`❌ ${name} - TIMEOUT`);
    } else {
      console.log(`❌ ${name} - ERRO: ${error.message}`);
    }
    return false;
  }
}

// Testes dos endpoints principais
async function runTests() {
  console.log('🧪 TESTANDO ENDPOINTS DO BACKEND...\n');
  
  const tests = [
    { url: `${API_BASE_URL}/config/health`, name: 'Health Check' },
    { url: `${API_BASE_URL}/config/system`, name: 'System Config' },
    { url: `${API_BASE_URL}/agents`, name: 'Agents API' },
    { url: `${API_BASE_URL}/users`, name: 'Users API' },
    { url: `${API_BASE_URL}/plans`, name: 'Plans API' },
    { url: `${API_BASE_URL}/config/llms`, name: 'LLM Config' },
    { url: `${API_BASE_URL}/command`, name: 'Command API' },
    { url: `${API_BASE_URL}/llm`, name: 'LLM API' },
    { url: `${API_BASE_URL}/integrations`, name: 'Integrations API' },
    { url: `${API_BASE_URL}/affiliates`, name: 'Affiliates API' }
  ];
  
  let passed = 0;
  
  for (const test of tests) {
    if (await testEndpoint(test.url, test.name)) {
      passed++;
    }
    // Pequena pausa entre testes
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n📊 RESULTADO: ${passed}/${tests.length} endpoints funcionando\n`);
  
  // Teste específico do SyncContext
  console.log('🔄 TESTANDO FUNCIONALIDADES DO SYNCCONTEXT...\n');
  
  try {
    // Simular chamadas que o SyncContext faz
    const healthCheck = await testEndpoint(`${API_BASE_URL}/config/health`, 'SyncContext Health');
    const agentsData = await testEndpoint(`${API_BASE_URL}/agents`, 'SyncContext Agents');
    const usersData = await testEndpoint(`${API_BASE_URL}/users`, 'SyncContext Users');
    
    if (healthCheck && agentsData && usersData) {
      console.log('✅ SyncContext pode comunicar com todos os endpoints principais!\n');
    } else {
      console.log('⚠️ SyncContext pode ter problemas com alguns endpoints\n');
    }
    
  } catch (error) {
    console.log(`❌ Erro no teste do SyncContext: ${error.message}\n`);
  }
  
  // Informações finais
  console.log('📋 CONFIGURAÇÃO DETECTADA:');
  console.log(`Backend:  ${API_BASE_URL}`);
  console.log(`Frontend: ${FRONTEND_URL}`);
  console.log(`Admin:    ${FRONTEND_URL}/admin`);
  console.log(`Client:   ${FRONTEND_URL}/dashboard\n`);
  
  if (passed === tests.length) {
    console.log('🎉 SINCRONIZAÇÃO 100% FUNCIONAL!');
    console.log('Sistema pronto para uso completo!\n');
  } else {
    console.log('⚠️ Alguns endpoints precisam de atenção');
    console.log('Verifique se o backend está rodando na porta 3001\n');
  }
  
  // Dicas de uso
  console.log('💡 DICAS DE USO:');
  console.log('1. Backend deve rodar na porta 3001');
  console.log('2. Frontend deve rodar na porta 3002');
  console.log('3. SyncContext sincroniza automaticamente a cada 30s');
  console.log('4. Use o painel admin para gerenciar dados');
  console.log('5. Use o dashboard client para interação do usuário\n');
}

// Executar os testes
runTests().catch(console.error);
