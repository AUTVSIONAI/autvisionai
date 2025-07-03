import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useVisionVoice } from '@/hooks/useVisionVoice';
import { playVisionVoice, getVisionVoiceConfig, onVisionVoiceConfigChange } from '@/utils/visionVoiceIntegration';
import { Play, Pause, Volume2, VolumeX, Mic } from 'lucide-react';

/**
 * Componente de exemplo que demonstra como integrar as vozes do sistema
 * com o Vision Command e outros componentes
 */
const VisionVoiceExample = () => {
  const { toast } = useToast();
  const { visionVoiceConfig, isPlaying, speak, isEnabled } = useVisionVoice();
  const [testText, setTestText] = useState('Olá! Eu sou o Vision Command e estou usando a voz configurada pelo administrador.');
  const [currentConfig, setCurrentConfig] = useState(null);

  useEffect(() => {
    // Carregar configuração inicial
    setCurrentConfig(getVisionVoiceConfig());

    // Escutar mudanças nas configurações
    const unsubscribe = onVisionVoiceConfigChange((newConfig) => {
      setCurrentConfig(newConfig);
      toast({
        title: 'Configuração de voz atualizada',
        description: `Nova voz: ${newConfig.voice_name}`,
        type: 'info'
      });
    });

    return unsubscribe;
  }, [toast]);

  // Teste usando o hook
  const handleTestWithHook = async () => {
    try {
      await speak(testText);
      toast({
        title: 'Teste concluído',
        description: 'Voz reproduzida usando o hook useVisionVoice',
        type: 'success'
      });
    } catch (error) {
      toast({
        title: 'Erro no teste',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Teste usando a função utilitária
  const handleTestWithUtility = async () => {
    try {
      await playVisionVoice(testText);
      toast({
        title: 'Teste concluído',
        description: 'Voz reproduzida usando a função utilitária',
        type: 'success'
      });
    } catch (error) {
      toast({
        title: 'Erro no teste',
        description: 'Falha ao reproduzir voz',
        variant: 'destructive'
      });
    }
  };

  // Exemplos de respostas do Vision Command
  const visionResponses = [
    'Olá! Como posso ajudá-lo hoje?',
    'Analisei a imagem e posso ver que há uma pessoa na foto.',
    'Baseado no que vejo, posso fornecer as seguintes informações...',
    'Desculpe, não consegui processar sua solicitação. Pode tentar novamente?',
    'Análise concluída com sucesso! Aqui estão os resultados.'
  ];

  const handleTestVisionResponse = async (response) => {
    try {
      await speak(response);
    } catch (error) {
      console.error('Erro ao reproduzir resposta:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Mic className="h-5 w-5" />
            <span>Integração de Voz do Vision Command</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Demonstração de como integrar as vozes configuradas no painel admin com o Vision Command
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status da Configuração */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
              <h4 className="text-lg font-medium text-white mb-3">Configuração Atual</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Voz:</span>
                  <span className="text-white font-medium">{visionVoiceConfig.voice_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ID:</span>
                  <span className="text-gray-300 font-mono text-sm">{visionVoiceConfig.voice_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <Badge variant={isEnabled ? "default" : "secondary"}>
                    {isEnabled ? (
                      <><Volume2 className="w-3 h-3 mr-1" /> Habilitada</>
                    ) : (
                      <><VolumeX className="w-3 h-3 mr-1" /> Desabilitada</>
                    )}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
              <h4 className="text-lg font-medium text-white mb-3">Status de Reprodução</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Estado:</span>
                  <Badge variant={isPlaying ? "destructive" : "default"}>
                    {isPlaying ? (
                      <><Pause className="w-3 h-3 mr-1" /> Reproduzindo</>
                    ) : (
                      <><Play className="w-3 h-3 mr-1" /> Pronto</>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Teste Personalizado */}
          <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
            <h4 className="text-lg font-medium text-white mb-3">Teste Personalizado</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="test-text" className="text-gray-300">Texto para teste</Label>
                <Input
                  id="test-text"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="Digite o texto para testar a voz..."
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleTestWithHook}
                  disabled={!isEnabled || isPlaying}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isPlaying ? (
                    <><Pause className="w-4 h-4 mr-2" /> Reproduzindo...</>
                  ) : (
                    <><Play className="w-4 h-4 mr-2" /> Testar com Hook</>
                  )}
                </Button>
                <Button
                  onClick={handleTestWithUtility}
                  disabled={!isEnabled || isPlaying}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Testar com Utilitário
                </Button>
              </div>
            </div>
          </div>

          {/* Exemplos de Respostas do Vision Command */}
          <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
            <h4 className="text-lg font-medium text-white mb-3">Exemplos de Respostas do Vision Command</h4>
            <div className="grid grid-cols-1 gap-2">
              {visionResponses.map((response, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                  <span className="text-gray-300 text-sm flex-1">{response}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTestVisionResponse(response)}
                    disabled={!isEnabled || isPlaying}
                    className="ml-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                  >
                    <Play className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Instruções de Uso */}
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <h4 className="text-lg font-medium text-blue-300 mb-3">Como Usar em Seus Componentes</h4>
            <div className="text-sm text-blue-200 space-y-2">
              <p><strong>1. Usando o Hook:</strong></p>
              <code className="block bg-gray-800 p-2 rounded text-xs text-gray-300">
                {`const { speak, isPlaying, isEnabled } = useVisionVoice();
await speak('Sua mensagem aqui');`}
              </code>
              
              <p><strong>2. Usando Funções Utilitárias:</strong></p>
              <code className="block bg-gray-800 p-2 rounded text-xs text-gray-300">
                {`import { playVisionVoice } from '@/utils/visionVoiceIntegration';
await playVisionVoice('Sua mensagem aqui');`}
              </code>
              
              <p><strong>3. Escutando Mudanças de Configuração:</strong></p>
              <code className="block bg-gray-800 p-2 rounded text-xs text-gray-300">
                {`import { onVisionVoiceConfigChange } from '@/utils/visionVoiceIntegration';
const unsubscribe = onVisionVoiceConfigChange((config) => {
  console.log('Nova configuração:', config);
});`}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisionVoiceExample;