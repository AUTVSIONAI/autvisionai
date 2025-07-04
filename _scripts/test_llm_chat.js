#!/usr/bin/env no        console.log('✅ LLM funcionando!');
        console.log('📝 Resposta:', response.data.data.response);
        console.log('⚡ Tempo:', response.data.data.latency, 'ms');
        console.log('🔧 Modelo:', response.data.data.modelUsed);
        console.log('🏢 Provedor:', response.data.data.provider);
        console.log('🎯 Tokens:', response.data.data.tokensUsed);
        console.log('📅 Timestamp:', response.data.data.timestamp);
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
        console.log('� Resposta completa:', JSON.stringify(response.data, null, 2));
        console.log('�📝 Resposta:', response.data.response || response.data.answer || response.data.message);
        console.log('⚡ Tempo:', response.data.processingTime || response.data.processing_time_ms, 'ms');
        console.log('🔧 Modelo:', response.data.model || response.data.modelUsed);
        
    } catch (error) {
        console.error('❌ Erro no teste LLM:', error.response?.data || error.message);
    }
}

testLLM();
