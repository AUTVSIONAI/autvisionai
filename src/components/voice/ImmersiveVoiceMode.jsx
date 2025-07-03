
// MODO IMERSÃO - NAVEGAÇÃO MOBILE CORRIGIDA + SWIPE + SISTEMA DE VOZES
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Mic,
  Volume2,
  VolumeX,
  X,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import { LLM } from '@/api/entities';
import ReactiveVisionAgent from '../vision/ReactiveVisionAgent';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from '@/lib/UserContext';
import { useVisionContext } from '@/lib/VisionContext';
import { useToast } from '@/components/ui/use-toast';
import VoiceSelector from './VoiceSelector';

// LISTA COMPLETA DE AGENTES
const ORBITAL_AGENTS = [
  { id: "echo", name: "Echo", type: "echo", active: true, description: "Comunicação por voz" },
  { id: "guardian", name: "Guardian", type: "guardian", active: false, description: "Segurança" },
  { id: "nova", name: "Nova", type: "nova", active: true, description: "Criatividade" },
  { id: "social", name: "Social", type: "social", active: true, description: "Redes sociais" },
  { id: "auto", name: "Auto", type: "auto", active: false, description: "Assistente veicular" },
  { id: "ada", name: "Ada", type: "ada", active: true, description: "Casa inteligente" },
  { id: "friend", name: "Friend", type: "friend", active: false, description: "Companhia emocional" },
  { id: "ads", name: "Ads", type: "ads", active: true, description: "Marketing" }
];

export default function ImmersiveVoiceMode({ isOpen, onClose }) {
  const { toast } = useToast();
  const supabase = useSupabaseClient();
  const { user } = useUser();
  const { currentVision } = useVisionContext();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [connectedAgents, setConnectedAgents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [userVoiceProfile, setUserVoiceProfile] = useState(null);
  const [isCustomVoice, setIsCustomVoice] = useState(false);
  const audioRef = useRef(null);

  // TOUCH/SWIPE HANDLING
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const agentsPerPage = 4;
  const totalPages = Math.ceil(ORBITAL_AGENTS.length / agentsPerPage);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (user && currentVision) {
        loadUserVoiceProfile();
      }
    } else {
      document.body.style.overflow = 'unset';
      if (audioRef.current) {
        audioRef.current.pause();
        setIsSpeaking(false);
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isOpen, user, currentVision]);
  
  // Carregar perfil de voz do usuário
  const loadUserVoiceProfile = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('voice/profiles/' + user.id, {
        body: { vision_id: currentVision?.id }
      });
      
      if (error) throw error;
      
      setUserVoiceProfile(data);
      setIsCustomVoice(!!data);
      
    } catch (error) {
      console.error('Erro ao carregar perfil de voz:', error);
      setIsCustomVoice(false);
    }
  };

  // NAVEGAÇÃO COM TOUCH/SWIPE
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentPage < totalPages - 1) {
      nextPage();
    }
    if (isRightSwipe && currentPage > 0) {
      prevPage();
    }
  };

  const speakText = async (text) => {
    if (!voiceEnabled) return;
    
    setIsSpeaking(true);
    
    try {
      // Parar áudio anterior se estiver tocando
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      if (isCustomVoice && userVoiceProfile) {
        // Usar sistema de vozes personalizadas
        const { data, error } = await supabase.functions.invoke('voice/synthesize', {
          body: {
            text,
            voice_id: userVoiceProfile.voice_id,
            user_id: user?.id,
            vision_id: currentVision?.id
          }
        });
        
        if (error) throw error;
        
        // Reproduzir áudio
        const audio = new Audio(`/api${data.audio_url}`);
        audioRef.current = audio;
        
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = (event) => {
          console.error("Custom Voice Error:", event);
          setIsSpeaking(false);
          // Fallback para voz do navegador
          speakWithBrowserVoice(text);
        };
        
        await audio.play();
        
      } else {
        // Usar voz padrão do navegador
        speakWithBrowserVoice(text);
      }
    } catch (error) {
      console.error('Erro ao sintetizar voz:', error);
      setIsSpeaking(false);
      // Fallback para voz do navegador
      speakWithBrowserVoice(text);
    }
  };
  
  // Função de fallback para usar a voz do navegador
  const speakWithBrowserVoice = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        if (event.error !== 'canceled') {
          console.error("Speech Synthesis Error:", event.error);
        }
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
      toast({
        title: "Erro de voz",
        description: "Seu navegador não suporta síntese de voz.",
        variant: "destructive"
      });
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      speakText("Reconhecimento de voz não suportado neste navegador.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'pt-BR';

    setIsListening(true);

    recognition.onresult = async (event) => {
      const command = event.results[0][0].transcript;
      setIsListening(false);
      
      try {
        // 🎤 PROCESSAMENTO REAL COM LLM 
        speakText("Processando comando...");
        
        const agentsContext = connectedAgents.length > 0 
          ? `Agentes conectados: ${connectedAgents.map(a => a.name).join(', ')}`
          : 'Nenhum agente conectado';
          
        const response = await LLM.ask({
          prompt: command,
          systemPrompt: `Você é Vision, o assistente principal da plataforma AUTVISION em modo de voz imersivo.
          ${agentsContext}
          
          Responda de forma conversacional e natural. Se o comando for sobre:
          - Conectar/desconectar agentes: mencione qual agente específico
          - Comandos de voz: execute ou explique como fazer
          - Perguntas gerais: responda de forma amigável
          
          Mantenha respostas curtas para áudio (máximo 2 frases).`
        });

        const responseText = response.response || 'Comando processado com sucesso.';
        speakText(responseText);
        
      } catch (error) {
        console.error('Erro no processamento de voz:', error);
        speakText('Desculpe, tive dificuldades para processar esse comando. Pode tentar novamente?');
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      speakText('Erro no reconhecimento de voz. Tente novamente.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const toggleAgentConnection = (agent) => {
    const isConnected = connectedAgents.find(a => a.id === agent.id);
    
    if (isConnected) {
      setConnectedAgents(prev => prev.filter(a => a.id !== agent.id));
      speakText(`${agent.name} desconectado.`);
    } else {
      setConnectedAgents(prev => [...prev, agent]);
      speakText(`${agent.name} conectado ao Vision.`);
    }
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getVisionContext = () => {
    if (isListening) return "listening";
    if (isSpeaking) return "speaking";
    return "idle";
  };

  const getCurrentAgents = () => {
    const startIndex = currentPage * agentsPerPage;
    return ORBITAL_AGENTS.slice(startIndex, startIndex + agentsPerPage);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      {/* Header - Botão Fechar */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* LAYOUT PRINCIPAL */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        
        {/* VISION CENTRAL - GRANDE E CENTRALIZADO */}
        <div className="mb-16">
          <ReactiveVisionAgent
            type="vision"
            variant="immersive"
            expression={getVisionContext() === "listening" ? "surpreso" : 
                      getVisionContext() === "speaking" ? "falando" : "neutro"}
            size={280}
            isActive={true}
            className="drop-shadow-2xl"
          />
        </div>

        {/* CONTROLES COMPACTOS */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={startListening}
            disabled={isListening || isSpeaking}
            className={`w-14 h-14 rounded-full ${isListening 
              ? 'bg-red-600 animate-pulse' 
              : 'bg-white/10 hover:bg-white/20'
            } border-2 border-white/20`}
          >
            <Mic className="w-6 h-6 text-white" />
          </Button>

          <Button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border-2 border-white/20"
          >
            {voiceEnabled ? (
              <Volume2 className="w-6 h-6 text-white" />
            ) : (
              <VolumeX className="w-6 h-6 text-white" />
            )}
          </Button>
          
          {user && (
            <Button
              onClick={() => setShowVoiceSelector(true)}
              className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border-2 border-white/20"
              title="Personalizar voz"
            >
              <Settings className="w-6 h-6 text-white" />
            </Button>
          )}
        </div>
        
        {/* Seletor de Vozes */}
        {user && (
          <VoiceSelector 
            showDialog={showVoiceSelector} 
            onClose={() => setShowVoiceSelector(false)}
            onVoiceSelected={(voiceId) => {
              loadUserVoiceProfile();
              toast({
                title: "Voz atualizada",
                description: "Sua voz personalizada foi atualizada com sucesso!"
              });
            }}
          />
        )}
      </div>

      {/* AGENTES NA PARTE INFERIOR - COM SWIPE */}
      <div className="pb-8">
        {/* NAVEGAÇÃO MOBILE - SETAS GRANDES */}
        <div className="flex justify-between items-center px-4 mb-4">
          <Button
            onClick={prevPage}
            disabled={currentPage === 0}
            variant="ghost"
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </Button>

          {/* INDICADOR DE PÁGINA */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentPage ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            variant="ghost"
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </Button>
        </div>

        {/* CONTAINER DE AGENTES COM SWIPE */}
        <div
          className="px-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="grid grid-cols-4 gap-4"
          >
            {getCurrentAgents().map((agent) => {
              const isConnected = connectedAgents.find(a => a.id === agent.id);
              
              return (
                <motion.div
                  key={agent.id}
                  className="flex flex-col items-center"
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => toggleAgentConnection(agent)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 transition-all ${
                      isConnected
                        ? 'border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-400/30'
                        : 'border-white/30 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <ReactiveVisionAgent
                      type={agent.type}
                      expression="neutro"
                      size={60}
                      isActive={isConnected}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </button>
                  
                  <span className="text-white text-xs mt-2 text-center font-medium">
                    {agent.name}
                  </span>
                  
                  {isConnected && (
                    <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs mt-1">
                      Conectado
                    </Badge>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* HINT DE SWIPE PARA MOBILE */}
        <div className="text-center mt-4 md:hidden">
          <p className="text-white/60 text-xs">
            👆 Deslize para ver mais agentes
          </p>
        </div>
      </div>
    </motion.div>
  );
}

ImmersiveVoiceMode.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};
