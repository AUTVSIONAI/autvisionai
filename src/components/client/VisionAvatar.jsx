import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Loader2, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Brain,
  Sparkles,
  Heart,
  X,
  Maximize2
} from 'lucide-react';
import { InvokeLLM } from "@/api/integrations";

// AVATAR EXPRESSIONS BASEADO NO NÍVEL E ESTADO
const getAvatarExpression = (level, state) => {
  const expressions = {
    1: { idle: '😊', talking: '😄', listening: '🤔', thinking: '💭' },
    2: { idle: '😎', talking: '😁', listening: '👂', thinking: '🧠' },
    3: { idle: '🤖', talking: '🗣️', listening: '👁️', thinking: '⚡' },
    4: { idle: '🌟', talking: '✨', listening: '🎯', thinking: '🔮' },
    5: { idle: '👑', talking: '💫', listening: '🌀', thinking: '🌌' }
  };
  
  const levelExpressions = expressions[level] || expressions[1];
  return levelExpressions[state] || levelExpressions.idle;
};

// AVATAR 3D ALTERNATIVA (QUANDO THREE.JS NÃO CARREGOU)
const Avatar2D = ({ level, state, isImmersive = false }) => {
  const expression = getAvatarExpression(level, state);
  
  return (
    <motion.div
      animate={{
        scale: state === 'talking' ? [1, 1.1, 1] : 1,
        rotate: state === 'thinking' ? [0, 5, -5, 0] : 0
      }}
      transition={{
        duration: state === 'talking' ? 0.5 : 2,
        repeat: state === 'talking' || state === 'thinking' ? Infinity : 0,
        ease: "easeInOut"
      }}
      className={`${isImmersive ? 'text-8xl lg:text-9xl' : 'text-6xl lg:text-8xl'} 
        flex items-center justify-center select-none cursor-pointer
        hover:scale-110 transition-transform duration-300`}
    >
      {expression}
    </motion.div>
  );
};

Avatar2D.propTypes = {
  level: PropTypes.number,
  state: PropTypes.string,
  isImmersive: PropTypes.bool
};

// COMPONENTE PRINCIPAL DO VISION AVATAR
export default function VisionAvatar({ 
  user, 
  onCommand, 
  soundEnabled = true, 
  onSoundToggle,
  isImmersive = false,
  onExitImmersive
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [textCommand, setTextCommand] = useState('');
  const [avatarState, setAvatarState] = useState('idle');
  const [interactionCount, setInteractionCount] = useState(0);

  const recognitionRef = useRef(null);

  // MENSAGENS INICIAIS BASEADAS NO NÍVEL
  const getWelcomeMessage = (level) => {
    const messages = {
      1: "Oi! Sou seu Vision Companion! Como posso ajudar hoje? 😊",
      2: "E aí! Evoluí para o nível 2! Agora posso fazer muito mais! 😎",
      3: "Olá, parceiro! Nível 3 desbloqueado! Meus poderes estão crescendo! 🤖",
      4: "Saudações! Atingi o nível 4! Posso sentir a energia cósmica! 🌟",
      5: "Bem-vindo ao reino divino! Nível 5 - Sou quase um deus da IA! 👑"
    };
    return messages[level] || messages[1];
  };

  useEffect(() => {
    setCurrentMessage(getWelcomeMessage(user?.level || 1));
  }, [user?.level]);

  // FALA (TEXT-TO-SPEECH)
  const speak = (text) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    
    speechSynthesis.cancel();
    setIsSpeaking(true);
    setAvatarState('talking');
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = user?.level >= 3 ? 0.8 : 1.0; // Voz mais grave em níveis altos
    utterance.volume = 0.8;
    
    // Buscar voz em português
    const voices = speechSynthesis.getVoices();
    const ptVoice = voices.find(voice => 
      voice.lang.includes('pt') && voice.name.toLowerCase().includes('fem')
    ) || voices.find(voice => voice.lang.includes('pt'));
    
    if (ptVoice) utterance.voice = ptVoice;
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setAvatarState('idle');
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setAvatarState('idle');
    };
    
    speechSynthesis.speak(utterance);
  };

  // ESCUTA (SPEECH-TO-TEXT)
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setCurrentMessage("Ops! Seu navegador não suporta reconhecimento de voz 😅");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    setAvatarState('listening');
    setCurrentMessage("Estou ouvindo... fale comigo! 👂");

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript;
      setTextCommand(command);
      handleCommand(command);
    };

    recognition.onerror = (event) => {
      console.error('Erro no reconhecimento:', event.error);
      setCurrentMessage("Não consegui escutar direito... tente novamente! 😅");
      setIsListening(false);
      setAvatarState('idle');
    };

    recognition.onend = () => {
      setIsListening(false);
      setAvatarState('idle');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // PROCESSAR COMANDO
  const handleCommand = async (command) => {
    if (!command.trim()) return;
    
    setIsThinking(true);
    setAvatarState('thinking');
    setCurrentMessage(`Processando: "${command}"...`);
    
    try {
      // Incrementar contador de interações
      setInteractionCount(prev => prev + 1);
      
      const response = await InvokeLLM({
        prompt: `Você é o Vision Companion do usuário ${user?.name || 'usuário'}, um assistente de IA amigável e inteligente no nível ${user?.level || 1}.

Personalidade baseada no nível:
- Nível 1-2: Jovem, amigável, usa emojis simples
- Nível 3-4: Mais experiente, confiante, usa termos tech
- Nível 5+: Sábio, cósmico, linguagem mais elaborada

Comando do usuário: "${command}"

Responda de forma natural, útil e personalizada. Use emojis apropriados para o nível. Máximo 150 caracteres para respostas rápidas, ou mais se necessário para explicações.`,
      });

      let aiResponse = '';
      
      if (response?.response && typeof response.response === 'string') {
        aiResponse = response.response.trim();
      } else if (typeof response === 'string') {
        aiResponse = response.trim();
      } else {
        // Fallback response baseado no nível
        const fallbacks = {
          1: `Entendi! "${command}" - deixe-me processar isso... 😊`,
          2: `Legal! Sobre "${command}", posso ajudar sim! 😎`,
          3: `Comando recebido: "${command}". Analisando dados... 🤖`,
          4: `Perfeito! "${command}" ativou meus sensores cósmicos! 🌟`,
          5: `Comando divino detectado: "${command}". Poder supremo ativado! 👑`
        };
        aiResponse = fallbacks[user?.level || 1];
      }

      setCurrentMessage(aiResponse);
      
      if (soundEnabled) {
        speak(aiResponse);
      } else {
        setAvatarState('idle');
      }
      
      // Callback para componente pai
      if (onCommand) {
        onCommand(command, aiResponse);
      }
      
    } catch (error) {
      console.error('Erro no comando:', error);
      const errorMsg = "Ops! Tive um probleminha... tente novamente! 😅";
      setCurrentMessage(errorMsg);
      if (soundEnabled) speak(errorMsg);
      setAvatarState('idle');
    }
    
    setIsThinking(false);
  };

  const handleTextSubmit = () => {
    if (textCommand.trim()) {
      handleCommand(textCommand);
      setTextCommand('');
    }
  };

  // STOP LISTENING
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setAvatarState('idle');
  };

  // AVATAR CLICK INTERACTION
  const handleAvatarClick = () => {
    if (isListening) {
      stopListening();
      return;
    }
    
    const clickResponses = [
      "Oi! Precisa de alguma coisa? 😊",
      "Hey! Como posso ajudar? ✨",
      "Opa! Aqui estou! 👋",
      "Sim? O que você quer saber? 🤔",
      "Pronto para ação! 🚀"
    ];
    
    const randomResponse = clickResponses[Math.floor(Math.random() * clickResponses.length)];
    setCurrentMessage(randomResponse);
    
    if (soundEnabled) {
      speak(randomResponse);
    }
  };

  // MODO IMERSIVO FULL SCREEN
  if (isImmersive) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black flex flex-col items-center justify-center p-4">
        {/* HEADER CONTROLS */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-lg px-4 py-2">
              <Brain className="w-5 h-5 mr-2" />
              Nível {user?.level || 1}
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-lg px-4 py-2">
              <Heart className="w-5 h-5 mr-2" />
              {interactionCount} interações
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={onSoundToggle}
              variant="outline"
              size="lg"
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
            <Button
              onClick={onExitImmersive}
              variant="outline"
              size="lg"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* AVATAR PRINCIPAL */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 max-w-4xl mx-auto">
          {/* AVATAR */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div 
              onClick={handleAvatarClick}
              className="relative cursor-pointer group"
            >
              <Avatar2D 
                level={user?.level || 1} 
                state={avatarState} 
                isImmersive={true}
              />
              {/* AURA BASEADA NO NÍVEL */}
              <div className={`absolute inset-0 rounded-full animate-pulse -z-10 ${
                user?.level >= 5 ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30' :
                user?.level >= 3 ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30' :
                'bg-gradient-to-r from-green-500/30 to-yellow-500/30'
              }`} />
            </div>
            
            {/* STATUS INDICATORS */}
            <AnimatePresence>
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute -top-4 -right-4 bg-blue-500 rounded-full p-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Brain className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* MESSAGE DISPLAY */}
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/30 max-w-2xl mx-auto"
          >
            <p className="text-white text-lg lg:text-xl text-center leading-relaxed min-h-[3rem] flex items-center justify-center">
              {currentMessage}
            </p>
          </motion.div>

          {/* CONTROLS */}
          <div className="space-y-6 w-full max-w-2xl">
            {/* VOICE CONTROLS */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isSpeaking || isThinking}
                size="lg"
                className={`px-8 py-4 text-lg ${
                  isListening 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                }`}
              >
                {isListening ? (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <MicOff className="w-6 h-6 mr-3" />
                    </motion.div>
                    Parar de Escutar
                  </>
                ) : (
                  <>
                    <Mic className="w-6 h-6 mr-3" />
                    Falar com Vision
                  </>
                )}
              </Button>
            </div>

            {/* TEXT INPUT */}
            <div className="flex gap-3">
              <Input
                value={textCommand}
                onChange={(e) => setTextCommand(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                placeholder="Digite sua mensagem..."
                className="bg-black/30 border-cyan-500/30 text-white placeholder-gray-400 text-lg py-4 flex-1"
                disabled={isThinking}
              />
              <Button
                onClick={handleTextSubmit}
                disabled={isThinking || !textCommand.trim()}
                size="lg"
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 px-6"
              >
                {isThinking ? (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Loader2 className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <Send className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* BOTTOM INFO */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <p className="text-gray-400 text-sm">
            Clique no avatar • Use sua voz • Digite comandos • Explore as possibilidades
          </p>
        </div>
      </div>
    );
  }

  // MODO NORMAL (CARD)
  return (
    <Card className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 border border-cyan-500/30 text-white relative overflow-hidden">
      <CardContent className="p-6 lg:p-8">
        <div className="flex flex-col items-center space-y-6">
          {/* HEADER */}
          <div className="w-full flex justify-between items-start">
            <div>
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
                Vision Companion
              </h3>
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  <Brain className="w-3 h-3 mr-1" />
                  Nível {user?.level || 1}
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {interactionCount} chats
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={onSoundToggle}
                variant="outline"
                size="sm"
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent('openImmersive'))}
                variant="outline"
                size="sm"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* AVATAR */}
          <div 
            onClick={handleAvatarClick}
            className="relative cursor-pointer group"
          >
            <Avatar2D 
              level={user?.level || 1} 
              state={avatarState} 
            />
            
            {/* AURA */}
            <div className={`absolute inset-0 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity -z-10 ${
              user?.level >= 5 ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' :
              user?.level >= 3 ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20' :
              'bg-gradient-to-r from-green-500/20 to-yellow-500/20'
            }`} />
            
            {/* STATUS INDICATOR */}
            <AnimatePresence>
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Brain className="w-3 h-3 text-white" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* MESSAGE */}
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/20 w-full"
          >
            <p className="text-center text-sm lg:text-base text-cyan-100 leading-relaxed min-h-[2rem] flex items-center justify-center">
              {currentMessage}
            </p>
          </motion.div>

          {/* CONTROLS */}
          <div className="w-full space-y-4">
            {/* VOICE BUTTON */}
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking || isThinking}
              className={`w-full ${
                isListening 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
              }`}
            >
              {isListening ? (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <MicOff className="w-4 h-4 mr-2" />
                  </motion.div>
                  Parar Escuta
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Falar com Vision
                </>
              )}
            </Button>

            {/* TEXT INPUT */}
            <div className="flex gap-2">
              <Input
                value={textCommand}
                onChange={(e) => setTextCommand(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                placeholder="Digite aqui..."
                className="bg-black/30 border-cyan-500/30 text-white placeholder-gray-400 flex-1"
                disabled={isThinking}
              />
              <Button
                onClick={handleTextSubmit}
                disabled={isThinking || !textCommand.trim()}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              >
                {isThinking ? (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Loader2 className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

VisionAvatar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    level: PropTypes.number
  }),
  onCommand: PropTypes.func,
  soundEnabled: PropTypes.bool,
  onSoundToggle: PropTypes.func,
  isImmersive: PropTypes.bool,
  onExitImmersive: PropTypes.func
};
