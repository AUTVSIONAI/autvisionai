/**
 * 🔥 VISION CHAT SIMPLE - VERSÃO SEM IMPORTS EXTERNOS
 * Chat básico para testar sem dependências problemáticas
 */

import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Brain, Mic, Volume2, VolumeX } from "lucide-react";

export default function VisionChatSimple({ className = "" }) {
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
  const [silentMode, setSilentMode] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
  };

  // Função simplificada de LLM mock (sem imports externos)
  const invokeLLMSimple = async (prompt) => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const responses = [
      `🤖 Entendi sua pergunta: "${prompt}". Como assistente da AUTVISION, estou aqui para ajudar com agentes IA, rotinas e automações!`,
      `💡 Interessante! Sobre "${prompt}" - a AUTVISION oferece ferramentas poderosas para isso. Que tal explorar nossos agentes especializados?`,
      `🚀 Perfeito! "${prompt}" é uma ótima questão. Na AUTVISION, você pode criar agentes personalizados para automatizar essas tarefas.`,
      `✨ Ótima pergunta sobre "${prompt}"! Como seu assistente Vision, recomendo verificar nossos recursos de automação e IA.`,
      `🎯 Sobre "${prompt}" - posso ajudar você a configurar agentes inteligentes para otimizar essa funcionalidade na AUTVISION!`
    ];

    return {
      response: responses[Math.floor(Math.random() * responses.length)]
    };
  };

  // Enviar mensagem para LLM simplificada
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

    try {
      console.log('🧠 Enviando mensagem para Vision (modo simples):', messageText);

      const response = await invokeLLMSimple(messageText);

      const assistantMessage = {
        role: 'assistant',
        content: response.response || 'Desculpe, não consegui processar sua mensagem.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Falar resposta se não estiver em modo silencioso
      if (!silentMode) {
        speakText(assistantMessage.content);
      }

    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: '⚠️ Desculpe, ocorreu um erro. Tente novamente em alguns instantes.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className={`flex flex-col h-96 ${className}`}>
      <CardHeader className="border-b border-gray-200 pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span className="text-lg text-gray-900">Vision Chat (Modo Simples)</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSilentMode(!silentMode)}
            className={silentMode ? 'text-gray-400' : 'text-blue-600'}
          >
            {silentMode ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm">
                  {message.content.split('\n').map((line, i) => (
                    <div key={i}>
                      {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </div>
                  ))}
                </div>
                <div className={`text-xs mt-1 opacity-70`}>
                  {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-600">Vision está pensando...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={startListening}
              disabled={isLoading || isListening}
              variant="outline"
              size="icon"
              className={isListening ? 'bg-red-100 border-red-300' : ''}
            >
              <Mic className={`w-4 h-4 ${isListening ? 'text-red-600' : 'text-gray-600'}`} />
            </Button>
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

VisionChatSimple.propTypes = {
  className: PropTypes.string
};
