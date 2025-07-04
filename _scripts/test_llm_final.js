#!/usr/bin/env node

const axios = require('axios');

async function testLLM() {
    try {
        console.log('🧠 Testando LLM do backend AUTVISION...');
        
        const response = await axios.post('http://localhost:3001/llm/ask', {
            prompt: 'Olá! Você está funcionando? Responda em português de forma breve.'
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        
        console.log('✅ LLM funcionando!');
        console.log('📝 Resposta:', response.data.data.response);
        console.log('⚡ Tempo:', response.data.data.latency, 'ms');
        console.log('🔧 Modelo:', response.data.data.modelUsed);
        console.log('🏢 Provedor:', response.data.data.provider);
        console.log('🎯 Tokens:', response.data.data.tokensUsed);
        
    } catch (error) {
        console.error('❌ Erro no teste LLM:', error.response?.data || error.message);
    }
}

testLLM();
