/**
 * 🔥 TESTE LLM INTEGRATION - VISION COMMANDER
 * Teste da integração LLM real no painel admin
 */

import { InvokeLLM } from '../src/api/integrations.js';

console.log('🔥 TESTANDO INTEGRAÇÃO LLM...');

async function testLLMIntegration() {
  console.log('\n=== 🧠 TESTE 1: LLM BÁSICA ===');
  
  try {
    const response1 = await InvokeLLM({
      prompt: 'Olá, você é o Vision Commander. Responda brevemente quem você é.',
      systemPrompt: 'Você é o VISION, assistente inteligente da AUTVISION.'
    });
    
    console.log('✅ Teste 1 - Resposta recebida:');
    console.log(response1.response || response1);
    
  } catch (error) {
    console.log('⚠️ Teste 1 - Modo fallback (backend offline):');
    console.log(error.message);
  }
  
  console.log('\n=== 🧠 TESTE 2: LLM COM JSON SCHEMA ===');
  
  try {
    const response2 = await InvokeLLM({
      prompt: 'Analise o sistema AUTVISION e gere 2 insights estratégicos.',
      systemPrompt: 'Você é o VISION, assistente estratégico da AUTVISION.',
      response_json_schema: {
        type: "object",
        properties: {
          insights: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string" },
                message: { type: "string" },
                priority: { type: "string" }
              }
            }
          }
        }
      }
    });
    
    console.log('✅ Teste 2 - JSON Schema:');
    console.log(JSON.stringify(response2, null, 2));
    
  } catch (error) {
    console.log('⚠️ Teste 2 - Modo fallback:');
    console.log(error.message);
  }
}

// Para executar no browser ou Node.js
if (typeof window !== 'undefined') {
  // Browser
  console.log('🌐 Executando no browser...');
  window.testLLM = testLLMIntegration;
  console.log('💡 Execute: testLLM() no console para testar');
} else {
  // Node.js
  console.log('⚙️ Executando no Node.js...');
  testLLMIntegration().then(() => {
    console.log('\n🎉 Teste finalizado!');
  });
}
