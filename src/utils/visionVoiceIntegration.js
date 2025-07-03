/**
 * Utilitário para integração das vozes do sistema com o Vision Command
 * Fornece funções para fácil integração em qualquer componente
 */

// Função para obter as configurações atuais de voz
export const getVisionVoiceConfig = () => {
  try {
    const config = localStorage.getItem('vision_voice_config');
    return config ? JSON.parse(config) : {
      voice_id: 'pt-br-female-1',
      voice_name: 'Ana Clara',
      enabled: true
    };
  } catch (error) {
    console.error('Erro ao carregar configurações de voz:', error);
    return {
      voice_id: 'pt-br-female-1',
      voice_name: 'Ana Clara',
      enabled: true
    };
  }
};

// Função para sintetizar voz (versão standalone)
export const synthesizeVisionVoice = async (text, options = {}) => {
  const config = getVisionVoiceConfig();
  
  if (!config.enabled) {
    console.warn('Voz do Vision Command está desabilitada');
    return false;
  }

  try {
    const response = await fetch('http://localhost:3001/voice/synthesize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voice_id: config.voice_id,
        speed: options.speed || 1.0,
        pitch: options.pitch || 0
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha na síntese de voz: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Erro na síntese');
    }

    return result.data;
  } catch (error) {
    console.error('Erro ao sintetizar voz:', error);
    return false;
  }
};

// Função para reproduzir voz diretamente
export const playVisionVoice = async (text, options = {}) => {
  try {
    const audioData = await synthesizeVisionVoice(text, options);
    
    if (!audioData) {
      return false;
    }

    const audioUrl = audioData.audio_url.startsWith('http') 
      ? audioData.audio_url 
      : `http://localhost:3001${audioData.audio_url}`;
      
    const audio = new Audio(audioUrl);
    
    return new Promise((resolve, reject) => {
      audio.onended = () => resolve(true);
      audio.onerror = (e) => {
        console.error('Erro no áudio:', e);
        reject(new Error('Erro ao reproduzir áudio'));
      };
      
      audio.play().catch(reject);
    });

  } catch (error) {
    console.error('Erro ao reproduzir voz:', error);
    return false;
  }
};

// Função para verificar se a voz está habilitada
export const isVisionVoiceEnabled = () => {
  const config = getVisionVoiceConfig();
  return config.enabled;
};

// Função para escutar mudanças nas configurações
export const onVisionVoiceConfigChange = (callback) => {
  const handleConfigUpdate = (event) => {
    callback(event.detail);
  };

  window.addEventListener('visionVoiceConfigUpdated', handleConfigUpdate);

  return () => {
    window.removeEventListener('visionVoiceConfigUpdated', handleConfigUpdate);
  };
};

// Exemplo de uso em componentes:
/*
import { useEffect } from 'react';
import { playVisionVoice, onVisionVoiceConfigChange } from '@/utils/visionVoiceIntegration';

const VisionCommandComponent = () => {
  useEffect(() => {
    // Escutar mudanças nas configurações
    const unsubscribe = onVisionVoiceConfigChange((newConfig) => {
      console.log('Configuração de voz atualizada:', newConfig);
    });

    return unsubscribe;
  }, []);

  const handleVisionResponse = async (responseText) => {
    // Reproduzir resposta do Vision Command
    try {
      await playVisionVoice(responseText);
      console.log('Resposta reproduzida com sucesso');
    } catch (error) {
      console.error('Erro ao reproduzir resposta:', error);
    }
  };

  return (
    // Seu componente aqui
  );
};
*/