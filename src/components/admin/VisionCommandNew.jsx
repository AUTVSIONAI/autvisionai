
import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Send,
  Loader2,
  Brain,
  Mic,
  Volume2,
  VolumeX,
  Sparkles,
  Server,
  Key
} from "lucide-react";
import { InvokeLLM } from "@/api/integrations";

// VISION COMMANDER - NOVA IMAGEM ÉPICA COM ÓCULOS  
const VISION_COMMANDER_IMAGE = "/assets/images/agents/agent-vision.png";

// ESFERA DE PLASMA 3D ÉPICA
const CosmicSphere3D = ({ isListening, isSpeaking, isProcessing }) => {
  const sphereRef = useRef();

  useEffect(() => {
    if (!sphereRef.current) return;

    // Animação contínua da esfera (rotação e pulsação suave)
    const animate = () => {
      if (sphereRef.current) {
        // Simple 2D transform for rotation and breathing effect
        const time = Date.now() * 0.001;
        const scaleEffect = 1 + Math.sin(time * 0.5) * 0.05; // Gentle breathing
        sphereRef.current.style.transform = `rotate(${time * 0.1}rad) scale(${scaleEffect})`;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const getSphereState = () => {
    if (isProcessing) return 'processing';
    if (isSpeaking) return 'speaking';
    if (isListening) return 'listening';
    return 'idle';
  };

  const sphereState = getSphereState();

  const stateColors = {
    idle: {
      primary: '#1e40af', // Dark blue
      secondary: '#3b82f6', // Medium blue
      glow: '#60a5fa', // Light blue
      shadow: '0 0 60px rgba(59, 130, 246, 0.8), 0 0 120px rgba(96, 165, 250, 0.6), inset 0 0 40px rgba(30, 64, 175, 0.9)'
    },
    listening: {
      primary: '#dc2626', // Dark red
      secondary: '#ef4444', // Medium red
      glow: '#f87171', // Light red
      shadow: '0 0 60px rgba(239, 68, 68, 0.8), 0 0 120px rgba(248, 113, 113, 0.6), inset 0 0 40px rgba(220, 38, 38, 0.9)'
    },
    speaking: {
      primary: '#059669', // Dark green
      secondary: '#10b981', // Medium green
      glow: '#34d399', // Light green
      shadow: '0 0 60px rgba(16, 185, 129, 0.8), 0 0 120px rgba(52, 211, 153, 0.6), inset 0 0 40px rgba(5, 150, 105, 0.9)'
    },
    processing: {
      primary: '#7c2d12', // Dark orange-brown
      secondary: '#ea580c', // Medium orange
      glow: '#fb923c', // Light orange
      shadow: '0 0 60px rgba(234, 88, 12, 0.8), 0 0 120px rgba(251, 146, 60, 0.6), inset 0 0 40px rgba(124, 45, 18, 0.9)'
    }
  };

  const currentState = stateColors[sphereState];

  return (
    <div className="relative w-64 h-64 mx-auto mb-8">
      {/* Anéis de energia externos */}
      <div className="absolute inset-0 rounded-full border-2 opacity-20 animate-ping"
           style={{ borderColor: currentState.glow, animationDuration: '3s' }} />
      <div className="absolute inset-4 rounded-full border-2 opacity-30 animate-ping"
           style={{ borderColor: currentState.secondary, animationDuration: '2s', animationDelay: '0.5s' }} />
      <div className="absolute inset-8 rounded-full border-2 opacity-40 animate-ping"
           style={{ borderColor: currentState.primary, animationDuration: '1.5s', animationDelay: '1s' }} />

      {/* Esfera principal */}
      <motion.div
        ref={sphereRef}
        className="absolute inset-12 rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${currentState.glow}, ${currentState.secondary} 50%, ${currentState.primary} 100%)`,
          boxShadow: currentState.shadow,
        }}
        animate={{
          scale: sphereState === 'listening' ? [1, 1.1, 1] : sphereState === 'speaking' ? [1, 1.05, 1] : 1,
        }}
        transition={{
          scale: {
            duration: sphereState === 'listening' ? 0.8 : 1.2,
            repeat: (sphereState === 'listening' || sphereState === 'speaking') ? Infinity : 0,
            ease: "easeInOut"
          }
        }}
      >
        {/* Reflexos internos */}
        <div className="absolute top-4 left-4 w-8 h-8 bg-white/30 rounded-full blur-sm" />
        <div className="absolute top-8 left-12 w-4 h-4 bg-white/20 rounded-full blur-sm" />
        <div className="absolute bottom-8 right-6 w-6 h-6 bg-white/15 rounded-full blur-sm" />

        {/* Padrões de energia */}
        <div className="absolute inset-2 rounded-full border border-white/10 animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute inset-4 rounded-full border border-white/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />

        {/* Núcleo central */}
        <div className="absolute inset-8 rounded-full flex items-center justify-center"
             style={{ background: `radial-gradient(circle, ${currentState.glow}40, transparent)` }}>
          <Brain className="w-8 h-8 text-white animate-pulse" />
        </div>
      </motion.div>

      {/* Partículas flutuantes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: currentState.glow,
            left: `${30 + Math.cos(i * 45 * Math.PI / 180) * 80}px`,
            top: `${30 + Math.sin(i * 45 * Math.PI / 180) * 80}px`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};


export default function VisionCommandNew({ adminData, onVoiceCommand }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [authError, setAuthError] = useState("");
  const [isListeningForPassword, setIsListeningForPassword] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [silentMode, setSilentMode] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [systemInsights, setSystemInsights] = useState([]);
  const [textCommand, setTextCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [systemLog, setSystemLog] = useState([]);
  // Removed isImmersiveMode state as per new design

  // Definir speakText ANTES do useEffect
  const speakText = useCallback((text) => {
    if (!('speechSynthesis' in window) || silentMode) return;

    speechSynthesis.cancel();

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 0.8;
    utterance.volume = 0.8;

    const voices = speechSynthesis.getVoices();
    const ptVoice = voices.find(voice => voice.lang.includes('pt'));
    if (ptVoice) utterance.voice = ptVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [silentMode]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const generateSystemLog = () => {
      const logs = [
        `Sistema AUTVISION operacional - ${Math.floor(Math.random() * 500) + 200} usuários conectados`,
        `Processamento neural ativo - Latência: ${Math.floor(Math.random() * 20) + 5}ms`,
        `Análise preditiva executada - Precisão: ${Math.floor(Math.random() * 10) + 90}%`,
        `Cache otimizado - Hit rate: ${Math.floor(Math.random() * 8) + 92}%`,
        `Sincronização com base de conhecimento concluída`,
        `Monitoramento de agentes ativo - Todos os sistemas funcionais`
      ];
      const newLog = {
        message: logs[Math.floor(Math.random() * logs.length)],
        timestamp: new Date().toISOString()
      };
      setSystemLog(prev => [newLog, ...prev.slice(0, 10)]);
    };

    const initializeVision = () => {
      const msg = `Sistema AUTVISION inicializado com sucesso. Central de comando operacional.`;
      setCurrentMessage(msg);
      if (!silentMode) {
        speakText(msg);
      }
    };

    const performSystemAnalysis = async () => {
      setCurrentMessage("Executando análise profunda dos sistemas...");

      try {
        const analysis = await InvokeLLM({
          prompt: `Você é o VISION, assistente de IA da AUTVISION. Analise os dados:
          - Usuários: ${adminData?.users?.length || 0}
          - Vision Companions: ${adminData?.visions?.length || 0}
          - Agentes: ${adminData?.agents?.length || 0}
          - Rotinas: ${adminData?.routines?.length || 0}

          Forneça 3 insights estratégicos em português brasileiro de forma profissional.`,
          response_json_schema: {
            type: "object",
            properties: {
              insights: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    message: { type: "string" },
                    priority: { type: "string" }
                  }
                }
              }
            }
          }
        });

        const newInsights = analysis.insights.map(insight => ({
          ...insight,
          timestamp: new Date().toISOString()
        }));

        setSystemInsights(prev => [...newInsights, ...prev.slice(0, 6)]);
        setCurrentMessage("Análise completa. Insights estratégicos disponíveis.");

        if (!silentMode) {
          speakText(`Análise concluída. ${newInsights.length} insights gerados.`);
        }
      } catch (error) {
        console.error("Erro na análise:", error);
        setCurrentMessage("Erro na análise. Tentando novamente...");
      }
    };

    initializeVision();
    const analysisInterval = setInterval(performSystemAnalysis, 180000); // 3 min
    const logInterval = setInterval(generateSystemLog, 5000); // 5 seg
    return () => {
      clearInterval(analysisInterval);
      clearInterval(logInterval);
    };
  }, [isAuthenticated, adminData, silentMode, speakText]);

  const handleCommand = async (command) => {
    if (!command.trim()) return;

    setIsProcessing(true);
    setCurrentMessage(`Processando: "${command}"`);

    try {
      const response = await InvokeLLM({
        prompt: `Você é o VISION, assistente de IA da AUTVISION. O administrador perguntou: "${command}"

        Responda em português brasileiro de forma profissional e útil. Você tem acesso a dados da plataforma.`,
        response_json_schema: {
          type: "object",
          properties: {
            action: { type: "string" },
            response: { type: "string" },
            execute: { type: "boolean" }
          }
        }
      });

      setCurrentMessage(response.response);

      if (response.execute && onVoiceCommand) {
        onVoiceCommand(response.action);
      }

      if (!silentMode) {
        speakText(response.response);
      }

    } catch (error) {
      console.error("Erro no comando:", error);
      const errorMsg = "Desculpe, ocorreu um erro. Tente novamente.";
      setCurrentMessage(errorMsg);
      if (!silentMode) {
        speakText(errorMsg);
      }
    }

    setIsProcessing(false);
  };

  const handleTextSubmit = () => {
    handleCommand(textCommand);
    setTextCommand("");
  };

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
    setCurrentMessage("Ouvindo... Pode falar agora.");

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript;
      setTextCommand(command);
      handleCommand(command);
    };

    recognition.onerror = () => {
      setCurrentMessage("Erro no reconhecimento de voz. Tente novamente.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const toggleSilentMode = () => {
    setSilentMode(!silentMode);
    if (!silentMode) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentMessage("Modo silencioso ativado.");
    } else {
      setCurrentMessage("Modo de voz ativado.");
      speakText("Modo de voz reativado.");
    }
  };

  // Removed toggleImmersiveMode function as the feature is removed

  const handleAuth = (codeParam) => {
    // FIX: Garante que o código a ser testado seja sempre uma string, tratando o caso do 'event' do onClick
    const codeToTest = (typeof codeParam === 'string') ? codeParam : authCode;

    if (codeToTest.trim().toLowerCase() === 'misericordia') {
      setIsAuthenticated(true);
      setAuthError('');
      const authSuccessMsg = "Acesso liberado, Senhor Gomes. A Central de comando está à sua disposição. Deseja um relatório verbal sobre o status atual da plataforma?";
      setCurrentMessage(authSuccessMsg);
      if(!silentMode) speakText(authSuccessMsg);
    } else {
      setAuthError('Código de acesso incorreto. Tente novamente.');
      setAuthCode('');
    }
  };

  const startPasswordListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Reconhecimento de voz não suportado neste navegador.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListeningForPassword(true);
    setAuthError("");

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript;
      setAuthCode(command);
      handleAuth(command); // Tenta autenticar imediatamente
    };

    recognition.onerror = () => {
      setAuthError("Erro no reconhecimento de voz. Tente digitar.");
      setIsListeningForPassword(false);
    };

    recognition.onend = () => {
      setIsListeningForPassword(false);
    };

    recognition.start();
  };

  // TELA DE AUTENTICAÇÃO
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700 shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <img
                  src={VISION_COMMANDER_IMAGE}
                  alt="AutVision Logo"
                  className="w-20 h-20 rounded-full border-2 border-blue-500 shadow-lg"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                VISION Command Access
              </CardTitle>
              <p className="text-gray-400">
                Olá, <span className="text-blue-400 font-semibold">Senhor Oseias Gomes</span>. É você?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Fale ou digite o código para ter acesso ao comando central.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {authError && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm text-center">
                  {authError}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Digite o código de acesso..."
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 pr-12"
                  />
                  <Button
                    onClick={startPasswordListening}
                    disabled={isListeningForPassword}
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {isListeningForPassword ? (
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                        <Mic className="w-4 h-4 text-red-400" />
                      </motion.div>
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {isListeningForPassword && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm text-center">
                    🎤 Ouvindo... Fale o código de acesso
                  </div>
                )}

                <Button
                  onClick={() => handleAuth()}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  disabled={!authCode.trim()}
                >
                  <Key className="w-4 h-4 mr-2" />
                  Acessar Comando Central
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Interface principal do Vision Command
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex justify-center mb-4">
            <img
              src={VISION_COMMANDER_IMAGE}
              alt="AutVision Commander"
              className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">VISION Command</h1>
          <p className="text-xl text-blue-400">
            Bem-vindo de volta, <span className="font-semibold">Comandante Oseias</span>
          </p>
          <p className="text-gray-400 mt-2">
            Sistema operacional. Aguardando suas ordens para análise da plataforma.
          </p>
        </motion.div>

        {/* Vision Sphere */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <CosmicSphere3D
            isListening={isListening}
            isSpeaking={isSpeaking}
            isProcessing={isProcessing}
          />
        </motion.div>

        {/* Status Message */}
        <motion.div
          key={currentMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full text-center px-4"
        >
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/30">
            <p className="text-base font-medium text-cyan-100 leading-relaxed min-h-[3rem] flex items-center justify-center">
              {currentMessage || "Sistema aguardando comandos..."}
            </p>
          </div>
        </motion.div>

        {/* Command Controls */}
        <Card className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 border border-cyan-500/30 text-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Comando Rápido
              </span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ml-auto text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1" />
                ONLINE
              </Badge>
              {silentMode && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                  <VolumeX className="w-3 h-3 mr-1" />
                  MUDO
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={startListening}
                disabled={isListening || isSpeaking || isProcessing}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-4 py-2"
                size="sm"
              >
                {isListening ? (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Ouvindo...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Voz</span>
                  </>
                )}
              </Button>

              <Button
                onClick={toggleSilentMode}
                variant={silentMode ? "default" : "outline"}
                className={`font-semibold px-4 py-2 ${silentMode
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                }`}
                size="sm"
              >
                {silentMode ? (
                  <>
                    <VolumeX className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Mudo</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Som</span>
                  </>
                )}
              </Button>
            </div>

            <div className="flex gap-3 w-full">
              <Input
                value={textCommand}
                onChange={(e) => setTextCommand(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                placeholder="Digite seu comando..."
                className="bg-black/30 border-cyan-500/30 text-cyan-100 placeholder-cyan-400/60 focus:border-cyan-400 backdrop-blur-sm flex-1"
                disabled={isProcessing}
              />
              <Button
                onClick={handleTextSubmit}
                disabled={isProcessing || !textCommand.trim()}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold px-4"
              >
                {isProcessing ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Loader2 className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* LOGS E INSIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LOGS */}
          <Card className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 border border-green-500/30 text-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-green-400" />
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  LOG DO SISTEMA
                </span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ml-auto text-xs">
                  TEMPO REAL
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black/50 rounded-lg p-4 font-mono text-sm h-64 overflow-y-auto space-y-2 border border-green-500/20">
                <AnimatePresence>
                  {systemLog.map((log) => (
                    <motion.div
                      key={log.timestamp}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-2 text-green-300"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                      <span className="text-gray-500 text-xs">
                        [{new Date(log.timestamp).toLocaleTimeString()}]
                      </span>
                      <span className="text-sm">{log.message}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* INSIGHTS */}
          <Card className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 border border-purple-500/30 text-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  INSIGHTS ESTRATÉGICOS
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 h-64 overflow-y-auto">
                {systemInsights.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Gerando análises estratégicas...</p>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {systemInsights.map((insight) => (
                      <motion.div
                        key={insight.timestamp}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-4 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-lg border-l-4 border-purple-500"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                            insight.priority === 'high' ? 'bg-red-400' :
                            insight.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                          }`} />
                          <div className="flex-1">
                            <p className="font-medium text-purple-300 mb-1">{insight.type}</p>
                            <p className="text-gray-300 text-sm">{insight.message}</p>
                            <p className="text-gray-500 text-xs mt-2">
                              {new Date(insight.timestamp).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// PropTypes
CosmicSphere3D.propTypes = {
  isListening: PropTypes.bool.isRequired,
  isSpeaking: PropTypes.bool.isRequired,
  isProcessing: PropTypes.bool.isRequired,
};

VisionCommandNew.propTypes = {
  adminData: PropTypes.object,
  onVoiceCommand: PropTypes.func,
};
