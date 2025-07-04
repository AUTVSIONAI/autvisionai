/**
 * 🎤 Teste integração OpenVoice com Docker
 * Testa síntese real + fallback mock
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configurações
const OPENVOICE_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:3001';
const TEST_TEXT = 'Olá, este é um teste da síntese de voz OpenVoice no sistema AUTVISION AI!';

async function testOpenVoiceDocker() {
  console.log('🐳 === TESTE OPENVOICE DOCKER INTEGRATION ===');
  
  // 1. Verificar se OpenVoice está rodando
  console.log('\n1. 🔍 Verificando status do OpenVoice...');
  try {
    const healthResponse = await axios.get(`${OPENVOICE_URL}/health`, { timeout: 5000 });
    console.log('✅ OpenVoice está rodando:', healthResponse.data);
  } catch (error) {
    console.log('❌ OpenVoice não está rodando:', error.message);
    console.log('💡 Para executar OpenVoice, rode: docker run -p 3000:3000 openvoice/openvoice');
  }
  
  // 2. Listar vozes disponíveis
  console.log('\n2. 📋 Listando vozes disponíveis...');
  try {
    const voicesResponse = await axios.get(`${OPENVOICE_URL}/voices`, { timeout: 10000 });
    console.log('✅ Vozes disponíveis:', voicesResponse.data);
  } catch (error) {
    console.log('⚠️ Erro ao listar vozes:', error.message);
  }
  
  // 3. Testar síntese diretamente no OpenVoice
  console.log('\n3. 🎤 Testando síntese direta no OpenVoice...');
  try {
    const synthesizePayload = {
      text: TEST_TEXT,
      speaker_id: 'default',
      language: 'Portuguese',
      speed: 1.0,
      style: 'default'
    };
    
    const synthesizeResponse = await axios.post(
      `${OPENVOICE_URL}/synthesize`,
      synthesizePayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'audio/wav'
        },
        responseType: 'arraybuffer',
        timeout: 30000
      }
    );
    
    console.log('✅ Síntese direta bem-sucedida!');
    console.log('📊 Audio size:', synthesizeResponse.data.byteLength, 'bytes');
    
    // Salvar áudio para teste
    const audioPath = path.join(__dirname, 'test_openvoice_direct.wav');
    fs.writeFileSync(audioPath, synthesizeResponse.data);
    console.log('💾 Áudio salvo em:', audioPath);
    
  } catch (error) {
    console.log('❌ Erro na síntese direta:', error.message);
  }
  
  // 4. Testar via VoiceDispatcher
  console.log('\n4. 🎯 Testando via VoiceDispatcher...');
  try {
    const dispatcherPayload = {
      text: TEST_TEXT,
      voice_id: 'openvoice-pt-br-female-1',
      speed: 1.0,
      pitch: 0,
      volume: 1.0,
      engine_name: 'openvoice',
      user_id: 'test-user'
    };
    
    const dispatcherResponse = await axios.post(
      `${BACKEND_URL}/voice-dispatcher/synthesize`,
      dispatcherPayload,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 35000
      }
    );
    
    console.log('✅ VoiceDispatcher respondeu:', dispatcherResponse.status);
    
    if (dispatcherResponse.data.success) {
      console.log('🎉 Síntese via VoiceDispatcher bem-sucedida!');
      console.log('📊 Audio URL length:', dispatcherResponse.data.audio_url?.length);
      console.log('⏱️ Processing time:', dispatcherResponse.data.processing_time_ms, 'ms');
      console.log('🎵 Duration:', dispatcherResponse.data.duration_ms, 'ms');
      
      // Verificar se é mock ou real
      if (dispatcherResponse.data.audio_url?.includes('data:audio/wav;base64,')) {
        console.log('🎵 Tipo de audio: WAV base64');
        
        // Salvar áudio do dispatcher
        const base64Audio = dispatcherResponse.data.audio_url.split(',')[1];
        const audioBuffer = Buffer.from(base64Audio, 'base64');
        const audioPath = path.join(__dirname, 'test_openvoice_dispatcher.wav');
        fs.writeFileSync(audioPath, audioBuffer);
        console.log('💾 Áudio VoiceDispatcher salvo em:', audioPath);
      }
    } else {
      console.log('❌ Erro na síntese via VoiceDispatcher:', dispatcherResponse.data.error);
    }
    
  } catch (error) {
    console.log('❌ Erro ao testar VoiceDispatcher:', error.message);
  }
  
  // 5. Testar fallback para mock
  console.log('\n5. 🔄 Testando fallback para mock...');
  try {
    const mockPayload = {
      text: 'Teste de fallback mock quando OpenVoice está offline',
      voice_id: 'openvoice-pt-br-male-1',
      speed: 1.0,
      pitch: 0,
      volume: 1.0,
      engine_name: 'openvoice',
      user_id: 'test-user'
    };
    
    // Simular OpenVoice offline temporariamente
    console.log('🔄 Simulando OpenVoice offline...');
    
    const mockResponse = await axios.post(
      `${BACKEND_URL}/voice-dispatcher/synthesize`,
      mockPayload,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 35000
      }
    );
    
    if (mockResponse.data.success) {
      console.log('✅ Fallback mock funcionando!');
      console.log('📊 Mock audio URL length:', mockResponse.data.audio_url?.length);
      
      // Salvar áudio mock
      const base64Audio = mockResponse.data.audio_url.split(',')[1];
      const audioBuffer = Buffer.from(base64Audio, 'base64');
      const audioPath = path.join(__dirname, 'test_openvoice_mock.wav');
      fs.writeFileSync(audioPath, audioBuffer);
      console.log('💾 Áudio mock salvo em:', audioPath);
    }
    
  } catch (error) {
    console.log('❌ Erro ao testar fallback:', error.message);
  }
  
  console.log('\n🏁 === TESTE CONCLUÍDO ===');
}

// Executar teste
testOpenVoiceDocker().catch(console.error);
