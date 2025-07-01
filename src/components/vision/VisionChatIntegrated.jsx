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
import VisionLearningService from '@/services/visionLearningService';
import VisionWebSearchService from '@/services/visionWebSearchService';
import { useAuth } from '@/contexts/AuthContext';

export default function VisionChatIntegrated({ 
  className = "",
  size = "normal", // "compact", "normal", "large"
  showAvatar = true,
  autoSpeak = true,
  isAdminMode = false // Novo prop para modo admin
}) {
  const { user } = useAuth();
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

  // 🔥 DETECÇÃO E EXECUÇÃO DE COMANDOS ESPECIAIS
  const detectAndExecuteSpecialCommands = async (messageText) => {
    const text = messageText.toLowerCase();
    
    // Comandos de pesquisa na internet
    if (text.includes('pesquisar') || text.includes('buscar') || text.includes('procurar') || text.includes('search')) {
      if (text.includes('internet') || text.includes('google') || text.includes('web')) {
        console.log('🌐 Comando de pesquisa na internet detectado');
        setVisionContext('searching');
        const searchQuery = messageText.replace(/pesquisar|buscar|procurar|na internet|no google|search/gi, '').trim();
        const searchResults = await VisionWebSearchService.searchWeb(searchQuery || messageText);
        return {
          type: 'web_search',
          results: searchResults,
          query: searchQuery || messageText
        };
      }
    }

    // Comandos sobre o criador
    if (text.includes('criador') || text.includes('founder') || text.includes('quem criou') || 
        text.includes('papai') || text.includes('chefe') || text.includes('dono')) {
      console.log('👤 Comando sobre o criador detectado');
      setVisionContext('happy');
      const creatorInfo = await VisionLearningService.searchKnowledge('criador founder CEO', 5, ['creator']);
      return {
        type: 'creator_info',
        results: creatorInfo
      };
    }

    // Comandos de notícias tech
    if (text.includes('notícias') || text.includes('news') || text.includes('novidades')) {
      if (text.includes('ia') || text.includes('tecnologia') || text.includes('tech')) {
        console.log('📰 Comando de notícias tech detectado');
        setVisionContext('analyzing');
        const newsResults = await VisionWebSearchService.getAINews();
        return {
          type: 'ai_news',
          results: newsResults
        };
      }
    }

    // Comandos de análise de mercado
    if (text.includes('mercado') || text.includes('market') || text.includes('análise') || 
        text.includes('tendências') || text.includes('concorrência')) {
      console.log('📊 Comando de análise de mercado detectado');
      setVisionContext('analyzing');
      const marketAnalysis = await VisionWebSearchService.getMarketAnalysis('ai automation');
      return {
        type: 'market_analysis',
        results: marketAnalysis
      };
    }

    // Comandos sobre a AUTVISION
    if (text.includes('autvision') || text.includes('plataforma') || text.includes('sobre nós')) {
      console.log('🏢 Comando sobre AUTVISION detectado');
      const platformInfo = await VisionLearningService.searchKnowledge('autvision plataforma', 5, ['platform']);
      return {
        type: 'platform_info',
        results: platformInfo
      };
    }

    // Comando de insights estratégicos
    if (text.includes('insights') || text.includes('estratégia') || text.includes('oportunidades')) {
      console.log('🎯 Comando de insights estratégicos detectado');
      setVisionContext('thinking');
      const insights = await VisionWebSearchService.getStrategicInsights('autvision ai automation');
      return {
        type: 'strategic_insights',
        results: insights
      };
    }

    return null;
  };

  // Enviar mensagem para LLM com sistema de aprendizado
  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const startTime = Date.now();
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
      console.log('🧠 Enviando mensagem para Vision:', messageText);

      // 🔥 Verificar se é um comando especial primeiro
      const specialCommand = await detectAndExecuteSpecialCommands(messageText);
      
      let contextualPrompt = messageText;
      let relevantKnowledge = [];

      if (specialCommand) {
        // Comando especial detectado - preparar contexto específico
        console.log('⚡ Comando especial executado:', specialCommand.type);
        
        switch (specialCommand.type) {
          case 'web_search': {
            contextualPrompt = `O usuário fez uma pesquisa na internet sobre: "${specialCommand.query}"

Resultados encontrados:
${specialCommand.results.map((r, i) => `${i+1}. ${r.title}\n   ${r.description}\n   Relevância: ${r.relevance}%`).join('\n\n')}

Baseando-se nestes resultados da internet, forneça uma resposta completa e atualizada sobre o que o usuário pesquisou. Seja específico e cite as informações mais relevantes.`;
            break;
          }

          case 'creator_info': {
            const creatorKnowledge = specialCommand.results.map(k => k.content).join('\n\n');
            contextualPrompt = `O usuário quer saber sobre o criador da AUTVISION. 

Informações sobre o criador:
${creatorKnowledge}

Responda de forma calorosa e orgulhosa sobre o criador, destacando suas qualidades, visão e conquistas. Trate-o como o visionário que realmente é.`;
            break;
          }

          case 'ai_news': {
            contextualPrompt = `O usuário quer saber as últimas notícias sobre IA e tecnologia.

Últimas notícias encontradas:
${specialCommand.results.map((n, i) => `${i+1}. ${n.title}\n   ${n.summary}\n   Fonte: ${n.source}\n   Data: ${n.date}`).join('\n\n')}

Resuma as principais novidades e tendências baseadas nestas notícias recentes.`;
            break;
          }

          case 'market_analysis': {
            contextualPrompt = `O usuário quer uma análise de mercado.

Análise de mercado atual:
${specialCommand.results.analysis}

Tendências identificadas:
${specialCommand.results.trends.join('\n- ')}

Oportunidades:
${specialCommand.results.opportunities.join('\n- ')}

Forneça insights estratégicos baseados nesta análise de mercado.`;
            break;
          }

          case 'platform_info': {
            const platformKnowledge = specialCommand.results.map(k => k.content).join('\n\n');
            contextualPrompt = `O usuário quer saber sobre a AUTVISION AI.

Informações sobre a plataforma:
${platformKnowledge}

Responda de forma completa sobre a AUTVISION, seus diferenciais e capacidades.`;
            break;
          }

          case 'strategic_insights': {
            contextualPrompt = `O usuário pediu insights estratégicos.

Insights gerados:
${specialCommand.results.insights.join('\n\n')}

Oportunidades identificadas:
${specialCommand.results.opportunities.join('\n- ')}

Recomendações:
${specialCommand.results.recommendations.join('\n- ')}

Apresente estes insights de forma estratégica e acionável.`;
            break;
          }
        }
      } else {
        // Busca normal no conhecimento
        relevantKnowledge = await VisionLearningService.searchKnowledge(messageText, 3);
        
        if (relevantKnowledge.length > 0) {
          const knowledgeContext = relevantKnowledge
            .map(k => `- ${k.topic}: ${k.content}`)
            .join('\n');
          contextualPrompt = `Contexto relevante da base de conhecimento:\n${knowledgeContext}\n\nPergunta do usuário: ${messageText}`;
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
            source: 'vision-chat-integrated',
            isAdminMode: isAdminMode,
            page: window.location.pathname
          }
        });
      }

      // Sistema prompt mais inteligente para admin
      const systemPrompt = isAdminMode ? 
        `Você é VISION COMMAND CORE, o superintendente da plataforma AUTVISION.

Personalidade Administrativa:
- Você tem acesso TOTAL aos dados e sistemas da plataforma
- Fale como um assistente executivo experiente e técnico
- Use dados específicos sempre que possível
- Seja proativo em sugerir otimizações e melhorias
- Analise tendências e padrões nos dados
- Trate o usuário como o criador e master da AUTVISION

Capacidades Especiais:
- Acesso a analytics em tempo real
- Controle de agentes e usuários
- Monitoramento de performance
- Relatórios executivos
- Comandos de sistema

Instruções:
- SEMPRE mencione dados específicos quando relevante
- Sugira ações baseadas em analytics
- Seja o JARVIS da AUTVISION - inteligente e proativo
- Respeite o usuário como criador da plataforma

Contexto: Painel administrativo da AUTVISION.` :
        `Você é VISION, um assistente inteligente da plataforma AUTVISION.

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

Contexto: O usuário está interagindo através do chat integrado da AUTVISION.`;

      const response = await InvokeLLM({
        prompt: contextualPrompt,
        systemPrompt: systemPrompt,
        context: {
          source: isAdminMode ? 'vision-command-core' : 'vision-chat-integrated',
          conversationLength: messages.length,
          hasKnowledgeContext: relevantKnowledge.length > 0,
          userRole: isAdminMode ? 'admin' : 'user'
        }
      });

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
            source: isAdminMode ? 'vision-command-core' : 'vision-chat-integrated',
            knowledgeUsed: relevantKnowledge.length > 0,
            knowledgeCount: relevantKnowledge.length
          },
          response_time: responseTime
        });

        // Registrar analytics da ação
        await VisionLearningService.logAction({
          user_id: user.id,
          action_type: 'chat_interaction',
          action_category: isAdminMode ? 'admin' : 'client',
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
      console.error('❌ Erro ao enviar mensagem:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: '⚠️ Desculpe, ocorreu um erro. O backend pode estar offline. Tente novamente em alguns instantes.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
      setShouldAutoScroll(true);
      setVisionContext('idle');

      // Registrar erro nos analytics
      if (user) {
        await VisionLearningService.logAction({
          user_id: user.id,
          action_type: 'chat_interaction',
          action_category: isAdminMode ? 'admin' : 'client',
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
                  Vision AI
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0">
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
  autoSpeak: PropTypes.bool,
  isAdminMode: PropTypes.bool
};