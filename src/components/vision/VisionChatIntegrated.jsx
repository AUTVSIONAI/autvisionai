/**
 * 🔥 VISION CHAT INTEGRADO - COMPONENTE COMPLETO
 * Chat inteligente com avatar reativo e LLM integrado
 */

import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Brain, Mic, Volume2, VolumeX, Sparkles, MessageSquare } from "lucide-react";
import { InvokeLLM } from "@/api/integrations";
import ReactiveVisionAgent from './ReactiveVisionAgent';

export default function VisionChatIntegrated({ 
  className = "",
  size = "normal", // "compact", "normal", "large"
  showAvatar = true,
  autoSpeak = true
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Olá! Eu sou o **Vision**, seu assistente inteligente da AUTVISION. Como posso ajudar você hoje?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [silentMode, setSilentMode] = useState(!autoSpeak);
  const [visionExpression, setVisionExpression] = useState('neutro');
  const [visionContext, setVisionContext] = useState('idle');
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Estado para controlar scroll automático - DESABILITADO para manter Vision visível
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  
  // Auto scroll apenas dentro do chat (não da página toda)
  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      const timer = setTimeout(() => {
        // Scroll apenas dentro do container do chat, não da página
        const chatContainer = messagesEndRef.current.closest('.overflow-y-auto');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        setShouldAutoScroll(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [shouldAutoScroll]);

  // Atualizar expressão do Vision baseado no estado
  useEffect(() => {
    if (isListening) {
      setVisionContext('listening');
    } else if (isLoading) {
      setVisionContext('processing');
    } else {
      setVisionContext('idle');
    }
  }, [isListening, isLoading]);

  // Função de fala
  const speakText = (text) => {
    if (!('speechSynthesis' in window) || silentMode) return;

    speechSynthesis.cancel();

    // Remove markdown básico para fala
    const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 0.8;
    utterance.volume = 0.8;

    const voices = speechSynthesis.getVoices();
    const ptVoice = voices.find(voice => voice.lang.includes('pt'));
    if (ptVoice) utterance.voice = ptVoice;

    // Atualizar expressão durante a fala
    utterance.onstart = () => setVisionContext('speaking');
    utterance.onend = () => setVisionContext('idle');

    speechSynthesis.speak(utterance);
  };

  // Função de reconhecimento de voz
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Reconhecimento de voz não suportado neste navegador.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      handleSendMessage(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // Enviar mensagem para LLM
  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setVisionContext('processing');
    // NÃO fazer scroll para mensagem do usuário - manter Vision visível

    try {
      console.log('🧠 Enviando mensagem para Vision:', messageText);

      const response = await InvokeLLM({
        prompt: messageText,
        systemPrompt: `Você é VISION, um assistente inteligente da plataforma AUTVISION.

Personalidade:
- Conversa de forma natural e fluida como um humano
- Seja útil, preciso e amigável
- Responda sempre em português brasileiro
- Use linguagem direta e conversacional
- Evite narrar suas ações ou usar emojis excessivamente

Instruções:
- NUNCA diga coisas como "Vou analisar" ou "Estou processando"
- Responda diretamente às perguntas
- Mantenha respostas concisas mas informativas
- Seja proativo em sugerir soluções
- Explique funcionalidades da AUTVISION quando relevante

Contexto: O usuário está interagindo através do chat integrado da AUTVISION.`,
        context: {
          source: 'vision-chat-integrated',
          conversationLength: messages.length
        }
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.response || response.message || 'Desculpe, não consegui processar sua mensagem.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setShouldAutoScroll(true); // Scroll sutil apenas dentro do chat
      setVisionContext('happy');

      // Falar resposta se não estiver em modo silencioso
      if (!silentMode) {
        setTimeout(() => speakText(assistantMessage.content), 500);
      }

    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: '⚠️ Desculpe, ocorreu um erro. O backend pode estar offline. Tente novamente em alguns instantes.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
      setShouldAutoScroll(true); // Scroll sutil apenas dentro do chat
      setVisionContext('idle');
    }

    setIsLoading(false);
  };

  // Função para pressionar Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Configurações de tamanho
  const sizeConfig = {
    compact: {
      container: "h-48 sm:h-56",
      messages: "h-24 sm:h-32",
      avatar: 50,
      input: "text-sm"
    },
    normal: {
      container: "h-80",
      messages: "h-44",
      avatar: 100,
      input: "text-base"
    },
    large: {
      container: "h-96",
      messages: "h-64",
      avatar: 140,
      input: "text-lg"
    }
  };

  const config = sizeConfig[size] || sizeConfig.normal;

  return (
    <Card className={`${config.container} bg-gradient-to-br from-gray-900/95 to-blue-900/20 border-blue-500/30 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-1 pt-2 px-3">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            {showAvatar && (
              <ReactiveVisionAgent
                type="vision"
                size={config.avatar}
                context={visionContext}
                isActive={true}
                className="flex-shrink-0"
              />
            )}
            <div>
              <div className="flex items-center space-x-2">
                <Brain className="w-3 h-3 text-blue-400" />
                <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Vision AI
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0">{isLoading ? 'Processando...' : isListening ? 'Escutando...' : 'Pronto para ajudar'}
                {isLoading ? 'Processando...' : isListening ? 'Escutando...' : 'Pronto para ajudar'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setSilentMode(!silentMode)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              {silentMode ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={startListening}
              variant={isListening ? "destructive" : "ghost"}
              size="sm"
              disabled={isLoading}
              className="text-gray-400 hover:text-white"
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col h-full p-2 pt-0">
        {/* Área de mensagens */}
        <div className={`${config.messages} overflow-y-auto mb-2 space-y-3 scrollbar-thin scrollbar-thumb-blue-600/50 scrollbar-track-gray-800/50`}>
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${config.input} ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gradient-to-r from-gray-700/80 to-gray-600/80 text-white border border-gray-600/50'
                }`}>
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-blue-300 font-medium">Vision</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">
                    {message.content.split('**').map((part, i) => 
                      i % 2 === 0 ? part : <strong key={i} className="font-semibold">{part}</strong>
                    )}
                  </div>
                  <p className="text-xs opacity-60 mt-2">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Indicador de carregamento */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gradient-to-r from-gray-700/80 to-gray-600/80 text-white px-4 py-3 rounded-2xl border border-gray-600/50">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-blue-300 font-medium">Vision</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span className="text-sm">Pensando...</span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input do chat */}
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem para o Vision..."
            disabled={isLoading}
            className={`flex-1 bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 ${config.input}`}
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

VisionChatIntegrated.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['compact', 'normal', 'large']),
  showAvatar: PropTypes.bool,
  autoSpeak: PropTypes.bool
};