/**
 * 🎤 Teste Integrado Voice Dispatcher + OpenVoice Real
 * Testa o endpoint /voice-dispatcher/synthesize com OpenVoice real
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testVoiceDispatcher() {
  console.log('🎤 Testando Voice Dispatcher + OpenVoice Real...\n');
  
  // Configuração do teste
  const BACKEND_URL = 'http://localhost:3001'; // Backend da aplicação
  const OPENVOICE_URL = 'http://localhost:3005'; // OpenVoice real
  
  // Primeiro testar se o OpenVoice está rodando
  try {
    console.log('🔍 Verificando se OpenVoice está rodando...');
    const healthResponse = await axios.get(`${OPENVOICE_URL}/health`);
    console.log(`✅ OpenVoice está rodando: ${healthResponse.data.service}`);
  } catch (error) {
    console.log(`❌ OpenVoice não está rodando! Verifique o container.`);
    return;
  }
  
  // Teste direto no OpenVoice
  console.log('\n🎯 Teste 1: Direto no OpenVoice');
  try {
    const directResponse = await axios.post(`${OPENVOICE_URL}/api/tts/synthesize`, {
      text: 'Teste direto no OpenVoice real',
      voice: 'pt-br-female-1',
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
    
    console.log(`✅ Direto OpenVoice: ${directResponse.data.length} bytes`);
    
    // Salvar áudio direto
    const directPath = path.join(__dirname, 'direct_openvoice_test.wav');
    fs.writeFileSync(directPath, directResponse.data);
    console.log(`💾 Salvo: ${directPath}`);
    
  } catch (error) {
    console.log(`❌ Erro no teste direto: ${error.message}`);
  }
  
  // Teste via Voice Dispatcher
  console.log('\n🎯 Teste 2: Via Voice Dispatcher');
  try {
    const dispatcherResponse = await axios.post(`${BACKEND_URL}/voice-dispatcher/synthesize`, {
      text: 'Teste via Voice Dispatcher com OpenVoice real',
      voice_id: 'pt-br-female-1',
      speed: 1.0,
      pitch: 0,
      volume: 0.8,
      engine: 'openvoice',
      engine_config: {
        api_url: OPENVOICE_URL,
        timeout: 30000
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 35000
    });
    
    console.log(`✅ Voice Dispatcher funcionando!`);
    console.log(`📊 Resposta: ${JSON.stringify(dispatcherResponse.data, null, 2)}`);
    
    // Se temos uma URL de áudio, baixar e salvar
    if (dispatcherResponse.data.audio_url) {
      const audioBase64 = dispatcherResponse.data.audio_url.split(',')[1];
      const audioBuffer = Buffer.from(audioBase64, 'base64');
      
      const dispatcherPath = path.join(__dirname, 'dispatcher_openvoice_test.wav');
      fs.writeFileSync(dispatcherPath, audioBuffer);
      console.log(`💾 Áudio salvo: ${dispatcherPath}`);
    }
    
  } catch (error) {
    console.log(`❌ Erro no Voice Dispatcher: ${error.message}`);
    if (error.response) {
      console.log(`📡 Status: ${error.response.status}`);
      console.log(`📄 Resposta: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
  
  // Teste com múltiplas vozes
  console.log('\n🎯 Teste 3: Múltiplas vozes');
  const voices = ['pt-br-female-1', 'pt-br-male-1', 'pt-br-female-2'];
  
  for (const voice of voices) {
    try {
      console.log(`\n🎙️ Testando voz: ${voice}`);
      
      const voiceResponse = await axios.post(`${OPENVOICE_URL}/api/tts/synthesize`, {
        text: `Esta é a voz ${voice} falando no OpenVoice real.`,
        voice: voice,
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
      
      console.log(`✅ ${voice}: ${voiceResponse.data.length} bytes`);
      
      // Salvar áudio da voz
      const voicePath = path.join(__dirname, `voice_${voice.replace(/-/g, '_')}.wav`);
      fs.writeFileSync(voicePath, voiceResponse.data);
      console.log(`💾 Salvo: ${voicePath}`);
      
    } catch (error) {
      console.log(`❌ Erro na voz ${voice}: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 TESTE INTEGRADO COMPLETO!');
  console.log('🔗 OpenVoice Real: http://localhost:3005');
  console.log('🔗 Backend: http://localhost:3001');
  console.log('📁 Arquivos de áudio salvos no diretório atual');
  console.log('='.repeat(60));
}

// Executar teste
testVoiceDispatcher().catch(console.error);
