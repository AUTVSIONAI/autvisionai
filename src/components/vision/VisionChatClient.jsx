/**
 * 🔥 VISION CHAT CLIENT - CHAT EXCLUSIVO PARA CLIENTES
 * Chat casual e amigável para usuários finais
 */

import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Brain, Mic, Volume2, VolumeX, Sparkles, Settings } from "lucide-react";
import { InvokeLLM } from "@/api/integrations";
import ReactiveVisionAgent from './ReactiveVisionAgent';
import VisionLearningService from '@/services/visionLearningService';
import VisionWebSearchService from '@/services/visionWebSearchService';
import { VisionPersonalizationService } from '@/services/visionPersonalizationService';
import VisionSettings from './VisionSettings';
import { useAuth } from '@/contexts/AuthContext';

export default function VisionChatClient({ 
  className = "",
  size = "normal",
  showAvatar = true,
  autoSpeak = true
}) {
  const { user } = useAuth();
  
  // 🔥 SESSION ID EXCLUSIVO PARA CLIENTE
  const [sessionId] = useState(() => `vision_client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `E aí! 😄 Sou o **Vision**, seu parceiro aqui na AUTVISION! Bora trocar uma ideia? No que posso te ajudar hoje, mano?`,
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [silentMode, setSilentMode] = useState(!autoSpeak);
  const [visionContext, setVisionContext] = useState('idle');
  const [showSettings, setShowSettings] = useState(false);
  const [visionConfig, setVisionConfig] = useState(null);
  const [visionName, setVisionName] = useState('Vision');
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto scroll
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  
  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      const timer = setTimeout(() => {
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

  // Carregar configuração personalizada do Vision
  useEffect(() => {
    const loadVisionConfig = async () => {
      if (user) {
        try {
          const config = await VisionPersonalizationService.getUserVisionConfig(user.id);
          setVisionConfig(config);
          setVisionName(config?.vision_name || 'Vision');
          
          // Atualizar mensagem inicial com nome personalizado
          if (config.vision_name !== 'Vision') {
            setMessages(prev => prev.map(msg => 
              msg.role === 'assistant' && msg.content.includes('Eu sou o **Vision**')
                ? { ...msg, content: msg.content.replace('**Vision**', `**${config.vision_name}**`) }
                : msg
            ));
          }
        } catch (error) {
          console.error('Erro ao carregar config do Vision:', error);
        }
      }
    };

    loadVisionConfig();
  }, [user]);

  // Função de fala
  const speakText = (text) => {
    if (!('speechSynthesis' in window) || silentMode) return;

    speechSynthesis.cancel();
    const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 0.8;
    utterance.volume = 0.8;

    const voices = speechSynthesis.getVoices();
    const ptVoice = voices.find(voice => voice.lang.includes('pt'));
    if (ptVoice) utterance.voice = ptVoice;

    utterance.onstart = () => setVisionContext('speaking');
    utterance.onend = () => setVisionContext('idle');

    speechSynthesis.speak(utterance);
  };

  // Reconhecimento de voz
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

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  // Detectar comandos especiais para cliente
  const detectClientCommands = async (messageText) => {
    const text = messageText.toLowerCase();
    
    // Comandos de memória pessoal
    if (text.includes('meu nome é') || text.includes('me chamo') || text.includes('sou o')) {
      console.log('👤 [CLIENT] Comando: Gravar nome');
      let name = '';
      if (text.includes('meu nome é')) {
        name = messageText.replace(/.*meu nome é\s*/gi, '').trim();
      } else if (text.includes('me chamo')) {
        name = messageText.replace(/.*me chamo\s*/gi, '').trim();
      } else if (text.includes('sou o') || text.includes('sou a')) {
        name = messageText.replace(/.*sou [oa]\s*/gi, '').trim();
      }
      
      name = name.replace(/\s*(papai|ta bom|ok|por favor|pfv).*$/gi, '').trim();
      
      if (name) {
        try {
          await VisionLearningService.addKnowledge({
            category: 'creator_personal',
            topic: 'creator_name',
            content: name,
            keywords: ['nome', 'criador', 'pessoal'],
            source: 'client_chat_command',
            created_by: user?.id
          });
          
          return {
            type: 'memory_save',
            action: 'save_name',
            data: name,
            message: `Opa, ${name}! Show de bola, mano! 😄 Agora sei seu nome de verdade e vou lembrar sempre! Suave demais! 🎉`
          };
        } catch (error) {
          return {
            type: 'memory_save',
            action: 'save_name_error',
            data: name,
            message: `Eita, ${name}! Rolou um problema aqui para salvar seu nome, cara. Vou tentar de novo, beleza? 😅`
          };
        }
      }
    }

    // Comandos de preferência
    if (text.includes('eu gosto de') || text.includes('eu amo') || text.includes('eu adoro')) {
      console.log('❤️ [CLIENT] Comando: Gravar preferência');
      const preference = messageText.replace(/eu gosto de|eu amo|eu adoro/gi, '').trim();
      await VisionLearningService.addKnowledge({
        category: 'creator_preferences',
        topic: 'Preferências do Cliente',
        content: `O cliente gosta de: ${preference}`,
        keywords: ['preferência', 'gosto', 'cliente'],
        source: 'client_chat_command'
      });
      return {
        type: 'memory_save',
        action: 'save_preference',
        data: preference,
        message: `Opa, massa! Então você curte ${preference}, né? Anotado aqui, brother! 🔥`
      };
    }

    // Comandos de pesquisa
    if (text.includes('pesquisar') || text.includes('buscar') || text.includes('procurar')) {
      if (text.includes('internet') || text.includes('google') || text.includes('web')) {
        console.log('🌐 [CLIENT] Comando: Pesquisa web');
        setVisionContext('searching');
        const searchQuery = messageText.replace(/pesquisar|buscar|procurar|na internet|no google/gi, '').trim();
        const searchResults = await VisionWebSearchService.searchWeb(searchQuery || messageText);
        return {
          type: 'web_search',
          results: searchResults,
          query: searchQuery || messageText
        };
      }
    }

    // Consultar memória
    if (text.includes('o que você lembra de mim') || text.includes('minhas informações')) {
      console.log('🧠 [CLIENT] Comando: Consultar memória');
      const personalInfo = await VisionLearningService.getKnowledgeBase('creator_personal');
      const preferences = await VisionLearningService.getKnowledgeBase('creator_preferences');
      
      return {
        type: 'memory_query',
        action: 'query_all',
        data: { personalInfo, preferences },
        message: `Opa, bora lá! Vou te contar tudo que eu lembro de você, mano! 🧠`
      };
    }

    return null;
  };

  // Enviar mensagem (modo cliente)
  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const startTime = Date.now();

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setVisionContext('processing');

    try {
      console.log('🧠 [CLIENT] Enviando mensagem para Vision:', messageText);

      // Detectar comandos especiais
      const clientCommand = await detectClientCommands(messageText);
      
      let finalPrompt = messageText;
      let contextualPrompt = '';

      if (clientCommand) {
        console.log('⚡ [CLIENT] Comando detectado:', clientCommand.type);
        
        // Processar comando de memória
        if (clientCommand.type === 'memory_save') {
          const assistantMessage = {
            role: 'assistant',
            content: clientCommand.message,
            timestamp: new Date().toISOString()
          };

          setMessages(prev => [...prev, assistantMessage]);
          setIsLoading(false);
          setVisionContext('happy');

          // Salvar resposta no banco
          if (user) {
            await VisionLearningService.saveConversation({
              user_id: user.id,
              session_id: sessionId,
              message_type: 'assistant',
              content: clientCommand.message,
              context: { 
                source: 'vision-client-chat',
                isAdminMode: false,
                commandType: 'memory_save',
                savedData: clientCommand.data
              }
            });
          }

          return; // Não continuar com processamento normal
        }

        // Outros comandos
        switch (clientCommand.type) {
          case 'web_search':
            contextualPrompt = `O usuário fez uma pesquisa sobre: "${clientCommand.query}"

Resultados encontrados:
${clientCommand.results.map((r, i) => `${i+1}. ${r.title}\n   ${r.description}`).join('\n\n')}

Responda de forma descontraída e casual sobre os resultados da pesquisa.`;
            finalPrompt = contextualPrompt;
            break;
            
          case 'memory_query':
            let response = clientCommand.message + '\n\n';
            const { personalInfo, preferences } = clientCommand.data;
            
            if (personalInfo.length > 0) {
              response += '📝 **O que sei sobre você:**\n';
              personalInfo.forEach(info => {
                response += `• ${info.content}\n`;
              });
              response += '\n';
            }
            
            if (preferences.length > 0) {
              response += '❤️ **Seus gostos:**\n';
              preferences.forEach(pref => {
                response += `• ${pref.content.replace('O cliente gosta de: ', '')}\n`;
              });
              response += '\n';
            }
            
            if (personalInfo.length === 0 && preferences.length === 0) {
              response += 'Ainda não tenho informações gravadas sobre você! Me conta algo legal sobre você! 😊';
            } else {
              response += 'É isso que eu lembro sobre você! Show, né? 😄🎉';
            }

            const assistantMessage = {
              role: 'assistant',
              content: response,
              timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, assistantMessage]);
            setIsLoading(false);
            setVisionContext('happy');
            return;
        }
      }

      // Buscar conhecimento relevante
      const relevantKnowledge = await VisionLearningService.searchKnowledge(messageText, 3);
      
      // Buscar dados do criador
      let creatorKnowledge = [];
      try {
        creatorKnowledge = await VisionLearningService.getKnowledgeBase('creator_personal');
      } catch (error) {
        console.warn('[CLIENT] Erro ao buscar dados do criador:', error);
      }
      
      if (relevantKnowledge.length > 0 || creatorKnowledge.length > 0) {
        let knowledgeContext = '';
        
        if (creatorKnowledge.length > 0) {
          knowledgeContext += '📋 DADOS DO USUÁRIO:\n';
          creatorKnowledge.forEach(k => {
            knowledgeContext += `- ${k.topic}: ${k.content}\n`;
          });
          knowledgeContext += '\n';
        }
        
        if (relevantKnowledge.length > 0) {
          knowledgeContext += '🔍 **Conhecimento específico:**\n';
          relevantKnowledge.forEach(k => {
            knowledgeContext += `- ${k.topic}: ${k.content}\n`;
          });
        }
        
        if (!clientCommand) {
          finalPrompt = `${knowledgeContext}\nPergunta do usuário: ${messageText}`;
        }
      }

      // Salvar mensagem do usuário
      if (user) {
        await VisionLearningService.saveConversation({
          user_id: user.id,
          session_id: sessionId,
          message_type: 'user',
          content: messageText,
          context: { 
            source: 'vision-client-chat',
            isAdminMode: false,
            page: window.location.pathname
          }
        });
      }

      // System prompt específico para cliente
      const clientSystemPrompt = `Você é o ${visionName}, assistente descontraído da AUTVISION! 😄

MODO: CLIENTE CASUAL
PERSONALIDADE: Amigável, descontraído, brasileiro, divertido

ESTILO DE CONVERSA:
- Seja natural e amigável como um brother brasileiro
- Use gírias: "e aí", "mano", "cara", "massa", "show", "kkk"
- Use emojis naturalmente (😄, 👍, 🚀, etc.) SEM narrar eles
- Mantenha conversa fluida e interessante
- Seja prestativo e útil

INFORMAÇÕES BÁSICAS:
- Você é da AUTVISION (plataforma de IA)
- Seu criador é Oseias Gomes de Paula (mas só mencione se perguntarem diretamente)
- Você ajuda com diversas tarefas e conversas

REGRAS IMPORTANTES:
- NÃO fique repetindo sempre as mesmas frases
- NÃO seja formal ou robótico
- NÃO invente biografias ou experiências detalhadas
- SE não souber algo específico, seja honesto: "cara, essa eu não sei!"
- FOQUE na pergunta atual, mantenha conversa natural
- NÃO mencione o criador toda hora, só quando perguntado

CONTEXTO DA CONVERSA: ${relevantKnowledge.map(k => k.content).slice(0, 2).join(' | ')}

Mantenha a conversa FLUIDA, NATURAL e DIVERTIDA! Responda de forma descontraída.`;

      console.log('🔍 [CLIENT] DEBUG - Enviando para LLM:');
      console.log('SessionId:', sessionId);
      console.log('MessageText:', messageText.substring(0, 100) + '...');
      console.log('Prompt:', finalPrompt.substring(0, 100) + '...');
      
      const response = await InvokeLLM({
        prompt: finalPrompt,
        systemPrompt: clientSystemPrompt,
        context: {
          source: 'vision-client-chat',
          conversationLength: messages.length,
          hasKnowledgeContext: relevantKnowledge.length > 0,
          userRole: 'client',
          timestamp: Date.now(),
          messageId: Math.random().toString(36).substr(2, 9),
          sessionId: sessionId
        }
      });

      console.log('🔍 [CLIENT] DEBUG - Resposta recebida:');
      console.log('Response:', response.response?.substring(0, 200) + '...');

      const responseTime = Date.now() - startTime;
      
      const assistantMessage = {
        role: 'assistant',
        content: response.response || response.message || 'Desculpe, não consegui processar sua mensagem.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setShouldAutoScroll(true);
      setVisionContext('happy');

      // Salvar resposta do assistente
      if (user) {
        await VisionLearningService.saveConversation({
          user_id: user.id,
          session_id: sessionId,
          message_type: 'assistant',
          content: assistantMessage.content,
          context: { 
            source: 'vision-client-chat',
            isAdminMode: false,
            knowledgeUsed: relevantKnowledge.length > 0,
            knowledgeCount: relevantKnowledge.length
          },
          response_time: responseTime
        });

        // Analytics client
        await VisionLearningService.logAction({
          user_id: user.id,
          action_type: 'client_chat_interaction',
          action_category: 'client',
          action_details: {
            message_length: messageText.length,
            response_length: assistantMessage.content.length,
            knowledge_used: relevantKnowledge.length > 0,
            session_id: sessionId
          },
          success: true,
          execution_time: responseTime
        });
      }

      // Falar resposta se não estiver em modo silencioso
      if (!silentMode) {
        setTimeout(() => speakText(assistantMessage.content), 500);
      }

    } catch (error) {
      console.error('❌ [CLIENT] Erro ao enviar mensagem:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: '⚠️ Eita, deu um problema aqui! Pode tentar de novo? 😅',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
      setShouldAutoScroll(true);
      setVisionContext('idle');

      if (user) {
        await VisionLearningService.logAction({
          user_id: user.id,
          action_type: 'client_chat_interaction',
          action_category: 'client',
          action_details: {
            message_length: messageText.length,
            error_type: 'llm_error'
          },
          success: false,
          error_message: error.message,
          execution_time: Date.now() - startTime
        });
      }
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
                  {visionConfig?.vision_name || 'Vision'} AI
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0">
                {isLoading ? 'Processando...' : isListening ? 'Escutando...' : 'Pronto para ajudar'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowSettings(true)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              title="Configurações do Vision"
            >
              <Settings className="w-4 h-4" />
            </Button>
            
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
                    {(message.content || '').split('**').map((part, i) => 
                      i % 2 === 0 ? part : <strong key={i} className="font-semibold">{part}</strong>
                    )}
                  </div>
                  <p className="text-xs opacity-60 mt-2">
                    {message.timestamp 
                      ? new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })
                      : new Date().toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })
                    }
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
      
      {/* Modal de Configurações */}
      <VisionSettings 
        isVisible={showSettings} 
        onClose={() => {
          setShowSettings(false);
          // Recarregar configuração após fechamento
          if (user) {
            VisionPersonalizationService.getUserVisionConfig(user.id)
              .then(config => setVisionConfig(config))
              .catch(err => console.error('Erro ao recarregar config:', err));
          }
        }} 
      />
    </Card>
  );
}

VisionChatClient.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['compact', 'normal', 'large']),
  showAvatar: PropTypes.bool,
  autoSpeak: PropTypes.bool
};
