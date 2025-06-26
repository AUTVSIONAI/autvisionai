/**
 * 🔥 TESTE RÁPIDO LLM - DIAGNÓSTICO
 * Teste para verificar se a integração LLM está funcionando
 */

console.log('🔥 TESTE LLM - INICIANDO DIAGNÓSTICO...');

// Teste 1: Verificar se a função está disponível
try {
  const { InvokeLLM } = await import('../src/api/integrations.js');
  console.log('✅ InvokeLLM importada com sucesso:', typeof InvokeLLM);
  
  // Teste 2: Chamar função com mock
  console.log('🧪 Testando chamada LLM...');
  
  const response = await InvokeLLM({
    prompt: 'Teste simples',
    systemPrompt: 'Você é um assistente de teste'
  });
  
  console.log('✅ Resposta recebida:', response);
  
} catch (error) {
  console.error('❌ Erro no teste:', error);
  console.log('📝 Detalhes do erro:', {
    message: error.message,
    stack: error.stack,
    name: error.name
  });
}

console.log('🎯 Teste finalizado - verifique resultados acima');

// Instruções para executar
console.log('\n💡 COMO RESOLVER:');
console.log('1. Abra DevTools (F12)');
console.log('2. Vá para Application > Storage > Clear storage');
console.log('3. Clique "Clear site data"');
console.log('4. Recarregue a página (Ctrl+F5)');
console.log('5. Tente novamente');

// Para executar no browser
if (typeof window !== 'undefined') {
  window.testLLMDiagnostic = async () => {
    console.log('🔧 Executando diagnóstico...');
    // Repete o teste no contexto do browser
  };
}
