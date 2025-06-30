/**
 * 🎯 TESTE FINAL - VERIFICAÇÃO CONTÍNUA DO ENDPOINT
 * Monitora se os erros 500 pararam no frontend
 */

console.log('🎯 Monitorando endpoint /agents por 30 segundos...');
console.log('⏰ Se não houver erros, significa que está RESOLVIDO!');

let successCount = 0;
let errorCount = 0;

const axios = require('axios');

async function testEndpoint() {
  try {
    const response = await axios.get('http://localhost:3001/agents', {
      timeout: 5000
    });
    
    successCount++;
    console.log(`✅ Sucesso ${successCount} - Status: ${response.status} - Agentes: ${response.data.data?.length || 0}`);
    
  } catch (error) {
    errorCount++;
    console.log(`❌ Erro ${errorCount} - ${error.response?.status || error.code}`);
  }
}

// Testa a cada 2 segundos por 30 segundos
const interval = setInterval(testEndpoint, 2000);

setTimeout(() => {
  clearInterval(interval);
  console.log('\n🏁 RESULTADO FINAL:');
  console.log(`✅ Sucessos: ${successCount}`);
  console.log(`❌ Erros: ${errorCount}`);
  
  if (errorCount === 0 && successCount > 0) {
    console.log('🎉 PERFEITO! Backend funcionando 100%!');
    console.log('🚀 Frontend deve parar de dar erro 500 agora!');
  } else if (errorCount > 0) {
    console.log('⚠️ Ainda há problemas no backend...');
  }
}, 30000);

// Teste inicial
testEndpoint();
