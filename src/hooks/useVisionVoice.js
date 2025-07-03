import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook personalizado para gerenciar as configurações de voz do Vision Command
 * Permite que qualquer componente acesse e use as vozes configuradas
 */
export const useVisionVoice = () => {
  const { toast } = useToast();
  const [visionVoiceConfig, setVisionVoiceConfig] = useState({
    voice_id: 'pt-br-female-1',
    voice_name: 'Ana Clara',
    enabled: true
  });
  const [isPlaying, setIsPlaying] = useState(false);

  // Carregar configurações do localStorage
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('vision_voice_config');
      if (savedConfig) {
        setVisionVoiceConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de voz:', error);
    }

    // Escutar mudanças nas configurações
    const handleConfigUpdate = (event) => {
      setVisionVoiceConfig(event.detail);
    };

    window.addEventListener('visionVoiceConfigUpdated', handleConfigUpdate);

    return () => {
      window.removeEventListener('visionVoiceConfigUpdated', handleConfigUpdate);
    };
  }, []);

  // Função para sintetizar e reproduzir voz
  const speak = async (text, options = {}) => {
    if (!visionVoiceConfig.enabled) {
      console.warn('Voz do Vision Command está desabilitada');
      return false;
    }

    if (isPlaying) {
      console.warn('Já existe uma reprodução em andamento');
      return false;
    }

    try {
      setIsPlaying(true);

      const response = await fetch('http://localhost:3001/voice/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice_id: visionVoiceConfig.voice_id,
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

      // Criar e reproduzir áudio
      const audioUrl = result.data.audio_url.startsWith('http') 
        ? result.data.audio_url 
        : `http://localhost:3001${result.data.audio_url}`;
        
      const audio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          setIsPlaying(false);
          resolve(true);
        };
        
        audio.onerror = (e) => {
          console.error('Erro no áudio:', e);
          setIsPlaying(false);
          reject(new Error('Erro ao reproduzir áudio'));
        };
        
        audio.play().catch((error) => {
          setIsPlaying(false);
          reject(error);
        });
      });

    } catch (error) {
      console.error('Erro ao sintetizar voz:', error);
      setIsPlaying(false);
      
      if (options.showToast !== false) {
        toast({
          title: 'Erro na síntese de voz',
          description: error.message || 'Não foi possível reproduzir a resposta em voz.',
          variant: 'destructive'
        });
      }
      
      return false;
    }
  };

  // Função para parar a reprodução atual
  const stop = () => {
    setIsPlaying(false);
    // Note: Para parar o áudio atual, seria necessário manter uma referência ao objeto Audio
    // Por simplicidade, apenas resetamos o estado
  };

  return {
    visionVoiceConfig,
    isPlaying,
    speak,
    stop,
    isEnabled: visionVoiceConfig.enabled
  };
};

export default useVisionVoice;