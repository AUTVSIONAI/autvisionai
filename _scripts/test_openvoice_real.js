/**
 * 🎤 Teste OpenVoice Real - Síntese de Áudio
 * Testa a engine real do OpenVoice via Docker
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testOpenVoiceReal() {
  console.log('🎤 Testando OpenVoice Real...\n');
  
  const testCases = [
    {
      text: 'Olá! Este é um teste do OpenVoice real rodando via Docker.',
      voice: 'pt-br-female-1',
      description: 'Teste básico com voz feminina'
    },
    {
      text: 'O sistema AUTVISION está funcionando perfeitamente com áudio real.',
      voice: 'pt-br-male-1', 
      description: 'Teste com voz masculina'
    },
    {
      text: 'Parabéns! A integração Docker + OpenVoice foi bem-sucedida.',
      voice: 'pt-br-female-2',
      description: 'Teste de confirmação'
    }
  ];

  let successCount = 0;
  let totalTests = testCases.length;

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    
    try {
      console.log(`\n📝 Teste ${i + 1}/${totalTests}: ${testCase.description}`);
      console.log(`🎯 Texto: "${testCase.text}"`);
      console.log(`🎙️ Voz: ${testCase.voice}`);
      
      const startTime = Date.now();
      
      const response = await axios.post('http://localhost:3005/api/tts/synthesize', {
        text: testCase.text,
        voice: testCase.voice,
        speed: 1.0,
        pitch: 0,
        volume: 0.8,
        lang: 'pt-BR'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'audio/wav'
        },
        responseType: 'arraybuffer',
        timeout: 30000
      });

      const endTime = Date.now();
      const processingTime = endTime - startTime;
      
      // Verificar se recebemos áudio
      if (response.data && response.data.length > 0) {
        const audioBase64 = Buffer.from(response.data).toString('base64');
        const audioSize = response.data.length;
        
        console.log(`✅ Sucesso! Áudio recebido:`);
        console.log(`   📊 Tamanho: ${audioSize} bytes`);
        console.log(`   ⏱️ Tempo: ${processingTime}ms`);
        console.log(`   🎵 Base64: ${audioBase64.substring(0, 50)}...`);
        
        // Salvar áudio para teste (opcional)
        const audioPath = path.join(__dirname, `test_audio_${i + 1}.wav`);
        fs.writeFileSync(audioPath, response.data);
        console.log(`   💾 Salvo: ${audioPath}`);
        
        successCount++;
      } else {
        console.log(`❌ Falha: Nenhum áudio recebido`);
      }
      
    } catch (error) {
      console.log(`❌ Erro no teste ${i + 1}:`);
      console.log(`   🔴 ${error.message}`);
      if (error.response) {
        console.log(`   📡 Status: ${error.response.status}`);
        console.log(`   📄 Resposta: ${error.response.data}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`🎯 RESULTADO FINAL:`);
  console.log(`✅ Sucessos: ${successCount}/${totalTests}`);
  console.log(`❌ Falhas: ${totalTests - successCount}/${totalTests}`);
  
  if (successCount === totalTests) {
    console.log(`🎉 TODOS OS TESTES PASSARAM! OpenVoice Real está funcionando perfeitamente!`);
  } else if (successCount > 0) {
    console.log(`⚠️ Alguns testes falharam. Verifique as configurações.`);
  } else {
    console.log(`🔴 Todos os testes falharam. Verifique se o container está rodando.`);
  }
  
  console.log('='.repeat(60));
}

// Executar teste
testOpenVoiceReal().catch(console.error);
