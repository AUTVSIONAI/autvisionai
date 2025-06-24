// VISION CORE - CHAT COMPACTO SINCRONIZADO
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import {
  Mic,
  Send,
  Volume2,
  Sparkles,
  Brain
} from 'lucide-react';
import ReactiveVisionAgent from './ReactiveVisionAgent';
import { LLM } from '@/api/entities';

// CONTEXTO GLOBAL PARA SINCRONIZAÇÃO
const VisionContext = React.createContext();

export default function VisionCore({ visionData, onInteraction, onVoiceModeOpen, onVisionUpdated }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([
    {
      type: 'vision',
      message: `Olá! Eu sou ${visionData?.name || 'Vision'}, seu assistente pessoal. Como posso ajudar você hoje?`,
      timestamp: new Date(),
      emotion: 'happy'
    }
  ]);
  const { toast } = useToast();

  // REAÇÕES EMOCIONAIS BASEADAS NO CONTEXTO
  const getVisionEmotion = (context, message) => {
    if (isListening) return 'listening';
    if (isSpeaking) return 'speaking';
    if (isProcessing) return 'thinking';
    
    // Análise simples de sentimento
    const positiveWords = ['obrigado', 'ótimo', 'excelente', 'perfeito', 'legal'];
    const questionWords = ['como', 'quando', 'onde', 'por que', 'qual'];
    
    if (positiveWords.some(word => message.toLowerCase().includes(word))) {
      return 'happy';
    }
    
    if (questionWords.some(word => message.toLowerCase().includes(word))) {
      return 'curious';
    }
    
    return 'neutral';
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      type: 'user',
      message: message.trim(),
      timestamp: new Date(),
      emotion: 'neutral'
    };

    setConversation(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // 🧠 CHAMADA REAL PARA A LLM
      const visionName = visionData?.name || 'Vision';
      const response = await LLM.ask({
        prompt: message.trim(),
        systemPrompt: `Você é ${visionName}, um assistente pessoal amigável e inteligente da plataforma AUTVISION. 
        Você conversa de forma natural, é prestativo e sempre pronto para ajudar o usuário.
        Mantenha respostas concisas mas úteis. Seja carismático e pessoal.`
      });

      const emotion = getVisionEmotion('response', response.response || 'Posso ajudar com mais alguma coisa?');

      const visionResponse = {
        type: 'vision',
        message: response.response || 'Desculpe, não consegui processar isso. Pode tentar de outra forma?',
        timestamp: new Date(),
        emotion: emotion,
        modelUsed: response.modelUsed || 'IA'
      };

      setConversation(prev => [...prev, visionResponse]);

      if (onInteraction) {
        onInteraction(message.trim());
      }

    } catch (error) {
      console.error('Erro na LLM:', error);
      
      // Fallback para resposta offline
      const fallbackResponse = {
        type: 'vision',
        message: 'Desculpe, estou com dificuldades de conexão. Posso ajudar com algo específico?',
        timestamp: new Date(),
        emotion: 'thinking'
      };

      setConversation(prev => [...prev, fallbackResponse]);
    } finally {
      setIsProcessing(false);
    }

    setMessage('');
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error("Reconhecimento de voz não suportado neste navegador.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setTimeout(() => {
        handleSendMessage();
      }, 100);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Erro no reconhecimento de voz. Tente novamente.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const getVisionContext = () => {
    if (isListening) return "listening";
    if (isSpeaking) return "speaking";
    if (isProcessing) return "processing";
    return "idle";
  };

  const visionName = visionData?.name || 'Vision';
  const visionPersonality = visionData?.personality_type || 'friendly';
  const visionLevel = visionData?.learning_level || 1;
  const visionInteractions = visionData?.total_interactions || 0;

  return (
    <div className="space-y-4">
      {/* VISION PRINCIPAL - MAIS PRÓXIMO DO CHAT */}
      <div className="flex justify-center">
        <ReactiveVisionAgent
          type="vision"
          variant="dashboard"
          expression={getVisionContext() === 'idle' ? 'neutro' : 'feliz'}
          context={getVisionContext()}
          size={200}
          isActive={true}
          onClick={() => console.log("Vision clicked")}
          className="drop-shadow-lg"
        />
      </div>

      {/* STATUS COMPACTO */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {visionName}
        </h2>
        <div className="flex items-center justify-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-600 dark:text-gray-400">Nível {visionLevel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-yellow-500" />
            <span className="text-gray-600 dark:text-gray-400">{visionInteractions}</span>
          </div>
        </div>
      </div>

      {/* CHAT COMPACTO E PRÓXIMO */}
      <Card className="border-gray-200 dark:border-gray-700 backdrop-blur-sm max-w-lg mx-auto" style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)'
      }}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Brain className="w-4 h-4 text-blue-500" />
            Conversa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Mini Conversation */}
          <div className="h-24 overflow-y-auto space-y-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <AnimatePresence>
              {conversation.slice(-2).map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] px-2 py-1 rounded text-xs ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 shadow-sm'
                  }`}>
                    <p>{msg.message}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input Compacto */}
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => e.target.value.length <= 100 && setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite aqui..."
              className="flex-1 text-sm"
              maxLength={100}
              disabled={isListening || isProcessing}
            />
            <Button
              onClick={startListening}
              disabled={isListening || isProcessing}
              variant={isListening ? "destructive" : "outline"}
              size="sm"
            >
              <Mic className="w-3 h-3" />
            </Button>
            <Button onClick={handleSendMessage} disabled={!message.trim() || isProcessing} size="sm">
              <Send className="w-3 h-3" />
            </Button>
          </div>

          {/* Botão Modo Voz */}
          <Button
            onClick={onVoiceModeOpen}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-sm"
            disabled={isProcessing}
          >
            <Volume2 className="w-3 h-3 mr-2" />
            Modo Voz Imersivo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}