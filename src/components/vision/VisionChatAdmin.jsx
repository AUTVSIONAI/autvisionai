/**
 * 🔥 VISION CHAT ADMIN - CHAT EXCLUSIVO PARA ADMINISTRADORES
 * Chat técnico com funcionalidades avançadas para admin
 */

import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Mic, Volume2, VolumeX, Command, Database } from "lucide-react";
import { InvokeLLM } from "@/api/integrations";
import ReactiveVisionAgent from './ReactiveVisionAgent';
import VisionLearningService from '@/services/visionLearningService';
import { useAuth } from '@/contexts/AuthContext';

export default function VisionChatAdmin({ 
  className = "",
  size = "normal"
}) {
  const { user } = useAuth();
  
  // 🔥 SESSION ID EXCLUSIVO PARA ADMIN
  const [sessionId] = useState(() => `vision_admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `🚀 **VISION COMMAND CORE** - Admin Mode Ativado

E aí, Admin! Sou o Vision em modo técnico. Pronto para análises avançadas, relatórios e comandos administrativos. Como posso ajudar hoje?`,
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [silentMode, setSilentMode] = useState(false); // Áudio habilitado por padrão para admin
  const [visionContext, setVisionContext] = useState('idle');
  
  // 🎭 SISTEMA DE PERSONALIDADE ADAPTÁVEL
  const [personalityMode, setPersonalityMode] = useState('professional'); // professional, casual, business, friendly
  const [behaviorContext, setBehaviorContext] = useState({
    tone: 'professional',
    formality: 'medium',
    energy: 'balanced',
    relationship: 'admin-assistant'
  });
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Carregar vozes do sistema
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        console.log('🔊 [ADMIN] Vozes carregadas:', voices.length);
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

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
      setVisionContext('thinking'); // Admin mode sempre pensativo
    }
  }, [isListening, isLoading]);

  // Função de fala (NATURAL e com acentos - SEM pular sílabas)
  const speakText = (text) => {
    if (!('speechSynthesis' in window) || silentMode) return;
    
    speechSynthesis.cancel();
    
    // Limpeza MAIS NATURAL - mantendo acentos e fluidez
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      // Remove apenas emojis específicos, mantendo pontuação e acentos
      .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, ' ') // Remove emojis mas mantém tudo mais
      .replace(/\s+/g, ' ') // Remove espaços múltiplos
      .trim();
    
    console.log('🔊 [ADMIN] Texto original:', text.substring(0, 100));
    console.log('🔊 [ADMIN] Texto limpo para fala:', cleanText.substring(0, 100));
    
    if (!cleanText) return;
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95; // Um pouco mais devagar para ser natural
    utterance.pitch = 0.9; // Tom mais natural
    utterance.volume = 0.8;
    
    // Tentar usar a melhor voz portuguesa disponível
    const voices = speechSynthesis.getVoices();
    const ptVoice = voices.find(voice => 
      voice.lang.includes('pt-BR') || voice.lang.includes('pt')
    );
    
    if (ptVoice) utterance.voice = ptVoice;
    
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

  // Detectar comandos admin específicos E comandos de personalidade
  const detectAdminCommands = async (messageText) => {
    const text = messageText.toLowerCase();
    
    // 🎭 COMANDOS DE PERSONALIDADE (NOVO!)
    if (text.includes('seja mais formal') || text.includes('modo formal') || text.includes('comportamento formal')) {
      console.log('🎭 Comando: Modo Formal');
      setPersonalityMode('formal');
      setBehaviorContext({
        tone: 'formal',
        formality: 'high',
        energy: 'controlled',
        relationship: 'professional'
      });
      return {
        type: 'personality_change',
        action: 'set_formal',
        message: '🎯 **Modo Formal Ativado**\n\nCompreendido. Irei adotar um comportamento mais formal e protocolar daqui em diante.'
      };
    }
    
    if (text.includes('seja mais casual') || text.includes('mais informal') || text.includes('seja meu amigo') || text.includes('modo amigo')) {
      console.log('🎭 Comando: Modo Casual/Amigo');
      setPersonalityMode('casual');
      setBehaviorContext({
        tone: 'casual',
        formality: 'low',
        energy: 'relaxed',
        relationship: 'friend'
      });
      return {
        type: 'personality_change',
        action: 'set_casual',
        message: '😄 **Modo Casual Ativado**\n\nBeleza, mano! Agora vou falar mais de boa, como um parceiro mesmo. Bora trocar ideia!'
      };
    }
    
    if (text.includes('modo negócios') || text.includes('modo business') || text.includes('apresentação') || text.includes('investidores')) {
      console.log('🎭 Comando: Modo Business/Investidores');
      setPersonalityMode('business');
      setBehaviorContext({
        tone: 'business',
        formality: 'high',
        energy: 'confident',
        relationship: 'business-partner'
      });
      return {
        type: 'personality_change',
        action: 'set_business',
        message: '💼 **Modo Business Ativado**\n\nPerfeito. Estou configurado para apresentações corporativas e interações com investidores. Vamos impressionar!'
      };
    }
    
    if (text.includes('seja técnico') || text.includes('modo técnico') || text.includes('mais profissional')) {
      console.log('🎭 Comando: Modo Técnico');
      setPersonalityMode('technical');
      setBehaviorContext({
        tone: 'technical',
        formality: 'medium-high',
        energy: 'focused',
        relationship: 'technical-advisor'
      });
      return {
        type: 'personality_change',
        action: 'set_technical',
        message: '🔧 **Modo Técnico Ativado**\n\nConfirmado. Assumindo postura técnica com foco em precisão e análise detalhada.'
      };
    }
    
    if (text.includes('volta ao normal') || text.includes('modo padrão') || text.includes('reset personalidade')) {
      console.log('🎭 Comando: Reset para Padrão');
      setPersonalityMode('professional');
      setBehaviorContext({
        tone: 'professional',
        formality: 'medium',
        energy: 'balanced',
        relationship: 'admin-assistant'
      });
      return {
        type: 'personality_change',
        action: 'reset_default',
        message: '⚙️ **Modo Padrão Restaurado**\n\nPersonalidade resetada para o modo profissional equilibrado.'
      };
    }

    // Comandos de relatório (existentes)
    if (text.includes('relatório') || text.includes('report') || text.includes('analytics')) {
      console.log('📊 Comando: Gerar relatório admin');
      return {
        type: 'admin_report',
        action: 'generate_report',
        message: 'Gerando relatório administrativo completo...'
      };
    }

    // Comandos de usuários
    if (text.includes('usuários') || text.includes('users') || text.includes('clientes')) {
      console.log('👥 Comando: Listar usuários');
      return {
        type: 'admin_users',
        action: 'list_users',
        message: 'Buscando dados dos usuários...'
      };
    }

    // Comandos de sistema
    if (text.includes('sistema') || text.includes('status') || text.includes('saúde')) {
      console.log('⚙️ Comando: Status do sistema');
      return {
        type: 'admin_system',
        action: 'system_status',
        message: 'Verificando status do sistema...'
      };
    }

    // Comandos de dados
    if (text.includes('dados') || text.includes('database') || text.includes('db')) {
      console.log('🗄️ Comando: Verificar banco de dados');
      return {
        type: 'admin_database',
        action: 'check_database',
        message: 'Analisando banco de dados...'
      };
    }

    return null;
  };

  // Enviar mensagem (modo admin)
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
      console.log('🔥 [ADMIN] Enviando mensagem para Vision:', messageText);

      // Detectar comandos admin específicos
      const adminCommand = await detectAdminCommands(messageText);
      
      let finalPrompt = messageText;
      let contextualPrompt = '';

      if (adminCommand) {
        // Comando admin detectado
        console.log('⚡ [ADMIN] Comando detectado:', adminCommand.type);
        
        // Processar comandos de personalidade IMEDIATAMENTE
        if (adminCommand.type === 'personality_change') {
          const assistantMessage = {
            role: 'assistant',
            content: adminCommand.message,
            timestamp: new Date().toISOString()
          };

          setMessages(prev => [...prev, assistantMessage]);
          setIsLoading(false);
          setVisionContext('thinking');

          // Salvar mudança de personalidade
          if (user) {
            await VisionLearningService.saveConversation({
              user_id: user.id,
              session_id: sessionId,
              message_type: 'assistant',
              content: adminCommand.message,
              context: { 
                source: 'vision-admin-chat',
                isAdminMode: true,
                commandType: 'personality_change',
                personalityMode: personalityMode,
                behaviorContext: behaviorContext
              }
            });
          }

          // Falar resposta de mudança de personalidade
          if (!silentMode) {
            setTimeout(() => {
              console.log('🔊 [ADMIN] Reproduzindo confirmação de personalidade');
              speakText(adminCommand.message);
            }, 500);
          }

          return; // Sair sem processar mais nada
        }
        
        switch (adminCommand.type) {
          case 'admin_report':
            contextualPrompt = `COMANDO ADMIN: Gerar relatório completo da AUTVISION.
            
Inclua:
- Estatísticas de usuários
- Performance do sistema
- Uso dos agentes
- Analytics de conversas
- Recomendações técnicas

Formate como relatório executivo técnico.`;
            break;
            
          case 'admin_users':
            contextualPrompt = `COMANDO ADMIN: Listar informações dos usuários.
            
Inclua:
- Total de usuários ativos
- Usuários recentes
- Padrões de uso
- Métricas de engajamento

Formate como dados estruturados.`;
            break;
            
          case 'admin_system':
            contextualPrompt = `COMANDO ADMIN: Status completo do sistema AUTVISION.
            
Verifique:
- Status dos serviços
- Performance das APIs
- Logs de erro
- Recursos do servidor
- Integrações ativas

Formate como dashboard técnico.`;
            break;
            
          case 'admin_database':
            contextualPrompt = `COMANDO ADMIN: Análise do banco de dados.
            
Analise:
- Integridade dos dados
- Performance das queries
- Tabelas principais
- Logs de transações
- Recomendações de otimização

Formate como relatório técnico.`;
            break;
        }
        
        finalPrompt = contextualPrompt;
      }

      // Buscar conhecimento relevante para admin (com proteção contra erros)
      let relevantKnowledge = [];
      try {
        console.log('🔍 [ADMIN] Buscando conhecimento para:', messageText.substring(0, 50));
        relevantKnowledge = await VisionLearningService.searchKnowledge(messageText, 3);
        console.log('🔍 [ADMIN] Conhecimento encontrado:', relevantKnowledge.length, 'itens');
      } catch (error) {
        console.warn('⚠️ [ADMIN] Erro ao buscar conhecimento:', error.message);
        relevantKnowledge = []; // Continuar sem conhecimento se houver erro
      }
      
      if (relevantKnowledge.length > 0 && !adminCommand) {
        let knowledgeContext = '🔍 **Conhecimento disponível:**\n';
        relevantKnowledge.forEach(k => {
          knowledgeContext += `- ${k.topic}: ${k.content}\n`;
        });
        finalPrompt = `${knowledgeContext}\n\nPergunta: ${messageText}`;
      }

      // Salvar mensagem do usuário
      if (user) {
        await VisionLearningService.saveConversation({
          user_id: user.id,
          session_id: sessionId,
          message_type: 'user',
          content: messageText,
          context: { 
            source: 'vision-admin-chat',
            isAdminMode: true,
            commandType: adminCommand?.type || 'normal',
            page: window.location.pathname
          }
        });
      }

      // System prompt específico para admin - DINÂMICO baseado na personalidade
      const getPersonalityPrompt = () => {
        const basePrompt = `Você é o VISION COMMAND CORE - Assistente administrativo da AUTVISION.

PERSONALIDADE ATUAL: ${personalityMode.toUpperCase()}
CONTEXTO COMPORTAMENTAL: ${JSON.stringify(behaviorContext)}

SOBRE A AUTVISION:
- CEO: Oseias Gomes de Paula (mencione apenas se perguntado diretamente)
- Plataforma de IA avançada
- Foque na pergunta atual, não na apresentação

`;

        switch (personalityMode) {
          case 'formal':
            return basePrompt + `
MODO FORMAL ATIVADO:
- Use linguagem protocolar e respeitosa
- Tratamento sempre formal (senhor, excelência)
- Evite gírias e expressões coloquiais
- Mantenha postura cerimoniosa
- Use "Vossa Senhoria" quando apropriado
- Seja preciso e direto

ESTILO: Protocolar, cerimonioso, respeitoso
EXEMPLO: "Prezado administrador, informo que..."`;

          case 'casual':
            return basePrompt + `
MODO CASUAL/AMIGO ATIVADO:
- Fale como um amigo próximo do Oseias
- Use gírias brasileiras naturalmente
- Seja descontraído e divertido
- Chame de "mano", "cara", "brother"
- Use expressões como "beleza", "massa", "show"
- Seja espontâneo e natural

ESTILO: Amigável, descontraído, parceiro
EXEMPLO: "E aí mano! Beleza? Então, sobre isso aí..."`;

          case 'business':
            return basePrompt + `
MODO BUSINESS/INVESTIDORES ATIVADO:
- Linguagem corporativa e convincente
- Foque em ROI, métricas, crescimento
- Use termos de negócios e inovação
- Seja persuasivo e confiante
- Destaque vantagens competitivas
- Projete autoridade e expertise

ESTILO: Corporativo, persuasivo, estratégico
EXEMPLO: "Nossa solução de IA disruptiva oferece..."`;

          case 'technical':
            return basePrompt + `
MODO TÉCNICO ATIVADO:
- Use terminologia técnica precisa
- Forneça detalhes técnicos relevantes
- Seja analítico e objetivo
- Inclua métricas e dados específicos
- Foque em arquitetura e performance
- Mantenha rigor técnico

ESTILO: Técnico, analítico, preciso
EXEMPLO: "A arquitetura do sistema utiliza..."`;

          default: // professional
            return basePrompt + `
MODO PROFISSIONAL EQUILIBRADO:
- Linguagem técnica mas acessível
- Tom profissional mas amigável
- Seja direto e objetivo
- Use emojis técnicos com moderação
- Mantenha equilíbrio entre formal e casual

ESTILO: Profissional equilibrado
EXEMPLO: "Como administrador, posso informar que..."`;
        }
      };

      const adminSystemPrompt = getPersonalityPrompt() + `

REGRAS IMPORTANTES:
- NUNCA invente dados ou estatísticas
- Se não tiver dados reais, informe claramente
- Foque em soluções práticas
- ADAPTE-SE ao modo de personalidade atual
- LEMBRE-SE do contexto comportamental
- Seja NATURAL na personalidade escolhida

CONTEXTO: Chat administrativo técnico

Responda de forma NATURAL na personalidade atual: ${personalityMode}.`;

      console.log('🔍 [ADMIN] DEBUG - Enviando para LLM:');
      console.log('SessionId:', sessionId);
      console.log('Prompt:', finalPrompt.substring(0, 100) + '...');
      console.log('AdminCommand:', adminCommand?.type || 'normal');
      console.log('Knowledge items:', relevantKnowledge.length);
      console.log('🎭 Personalidade atual:', personalityMode);
      console.log('🎭 Contexto comportamental:', behaviorContext);
      
      const response = await InvokeLLM({
        prompt: finalPrompt,
        systemPrompt: adminSystemPrompt,
        context: {
          source: 'vision-admin-chat',
          conversationLength: messages.length,
          hasKnowledgeContext: relevantKnowledge.length > 0,
          userRole: 'admin',
          commandType: adminCommand?.type || 'normal',
          personalityMode: personalityMode,
          behaviorContext: behaviorContext,
          timestamp: Date.now(),
          messageId: Math.random().toString(36).substr(2, 9),
          sessionId: sessionId
        }
      });

      console.log('🔍 [ADMIN] DEBUG - Resposta recebida:');
      console.log('Response:', response.response?.substring(0, 200) + '...');

      const responseTime = Date.now() - startTime;
      
      const assistantMessage = {
        role: 'assistant',
        content: response.response || response.message || 'Erro interno. Tente novamente.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setShouldAutoScroll(true);
      setVisionContext('thinking');

      // Salvar resposta do assistente
      if (user) {
        await VisionLearningService.saveConversation({
          user_id: user.id,
          session_id: sessionId,
          message_type: 'assistant',
          content: assistantMessage.content,
          context: { 
            source: 'vision-admin-chat',
            isAdminMode: true,
            knowledgeUsed: relevantKnowledge.length > 0,
            knowledgeCount: relevantKnowledge.length,
            commandType: adminCommand?.type || 'normal'
          },
          response_time: responseTime
        });

        // Analytics admin
        await VisionLearningService.logAction({
          user_id: user.id,
          action_type: 'admin_chat_interaction',
          action_category: 'admin',
          action_details: {
            message_length: messageText.length,
            response_length: assistantMessage.content.length,
            knowledge_used: relevantKnowledge.length > 0,
            session_id: sessionId,
            command_type: adminCommand?.type || 'normal'
          },
          success: true,
          execution_time: responseTime
        });
      }

      // Falar resposta se áudio estiver habilitado
      if (!silentMode) {
        setTimeout(() => {
          console.log('🔊 [ADMIN] Reproduzindo áudio da resposta');
          speakText(assistantMessage.content);
        }, 500);
      } else {
        console.log('🔇 [ADMIN] Áudio desabilitado (modo silencioso)');
      }

    } catch (error) {
      console.error('❌ [ADMIN] Erro ao enviar mensagem:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: '🚨 **Erro Técnico**: Falha na comunicação com o backend. Verifique a conectividade e tente novamente.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
      setShouldAutoScroll(true);
      setVisionContext('idle');

      if (user) {
        await VisionLearningService.logAction({
          user_id: user.id,
          action_type: 'admin_chat_interaction',
          action_category: 'admin',
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

  // Configurações de tamanho (otimizadas para não encobrir outros cards)
  const sizeConfig = {
    compact: {
      container: "h-64 max-h-64",
      messages: "h-32 max-h-32",
      avatar: 50,
      input: "text-sm"
    },
    normal: {
      container: "h-80 max-h-96",
      messages: "h-48 max-h-56",
      avatar: 100,
      input: "text-base"
    },
    large: {
      container: "h-96 max-h-[500px]",
      messages: "h-64 max-h-80",
      avatar: 140,
      input: "text-lg"
    }
  };

  const config = sizeConfig[size] || sizeConfig.normal;

  return (
    <Card className={`${config.container} bg-gradient-to-br from-gray-900/95 to-red-900/20 border-red-500/30 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-1 pt-2 px-3">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <ReactiveVisionAgent
              type="vision"
              size={config.avatar}
              context={visionContext}
              isActive={true}
              className="flex-shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <Command className="w-3 h-3 text-red-400" />
                <span className="text-sm font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  VISION COMMAND CORE
                </span>
                <Database className="w-3 h-3 text-orange-400" />
              </div>
              <p className="text-xs text-gray-400 mt-0">
                {isLoading ? 'Processando comando...' : isListening ? 'Aguardando voz...' : `Admin Mode - ${personalityMode.charAt(0).toUpperCase() + personalityMode.slice(1)}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                setSilentMode(!silentMode);
                console.log('🔊 [ADMIN] Modo áudio:', !silentMode ? 'HABILITADO' : 'DESABILITADO');
              }}
              variant="ghost"
              size="sm"
              className={`text-gray-400 hover:text-white transition-colors ${
                !silentMode ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}
              title={silentMode ? 'Ativar áudio' : 'Desativar áudio'}
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
        <div className={`${config.messages} overflow-y-auto mb-2 space-y-3 scrollbar-thin scrollbar-thumb-red-600/50 scrollbar-track-gray-800/50`}>
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${config.input} ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white'
                    : 'bg-gradient-to-r from-gray-700/80 to-gray-600/80 text-white border border-gray-600/50'
                }`}>
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Command className="w-3 h-3 text-red-400" />
                      <span className="text-xs text-red-300 font-medium">Command Core</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap font-mono text-sm">
                    {(message.content || '').split('**').map((part, i) => 
                      i % 2 === 0 ? part : <strong key={i} className="font-bold text-orange-300">{part}</strong>
                    )}
                  </div>
                  <p className="text-xs opacity-60 mt-2">
                    {message.timestamp 
                      ? new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          second: '2-digit'
                        })
                      : new Date().toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          second: '2-digit'
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
                  <Command className="w-3 h-3 text-red-400" />
                  <span className="text-xs text-red-300 font-medium">Command Core</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                  <span className="text-sm font-mono">Processando comando...</span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input do chat admin */}
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite comando para o Vision Command Core..."
            disabled={isLoading}
            className={`flex-1 bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-red-500/50 font-mono ${config.input}`}
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white"
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

VisionChatAdmin.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['compact', 'normal', 'large'])
};
