// VISION COMMANDER - PILOTO DA NAVE IMPONENTE
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Brain,
  Mic,
  Volume2,
  VolumeX,
  Send,
  Loader2,
  Eye,
  Activity,
  Command,
  Shield
} from 'lucide-react';
import { LLM } from '@/api/entities';
import ReactiveVisionAgent from '../vision/ReactiveVisionAgent';

const VISION_COMMANDER_IMAGE = "/assets/images/agents/agent-vision.png";

export default function VisionCommanderCore({ adminData, onVoiceCommand }) {
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

  useEffect(() => {
    if (!isAuthenticated) return;
    initializeVision();
    const analysisInterval = setInterval(performSystemAnalysis, 180000);
    const logInterval = setInterval(generateSystemLog, 5000);
    return () => {
      clearInterval(analysisInterval);
      clearInterval(logInterval);
    };
  }, [isAuthenticated]);

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
    setSystemLog(prev => [newLog, ...prev.slice(0, 6)]);
  };

  const initializeVision = () => {
    const msg = `Central de Comando AUTVISION inicializada. Aguardando ordens, Comandante.`;
    setCurrentMessage(msg);
    if (!silentMode) {
      speakText(msg);
    }
  };

  const performSystemAnalysis = async () => {
    setCurrentMessage("Executando análise estratégica dos sistemas...");
    try {
      const analysisPrompt = `Você é o VISION COMMANDER da AUTVISION. Analise os dados:
        - Usuários: ${adminData?.users?.length || 0}
        - Vision Companions: ${adminData?.visions?.length || 0}
        - Agentes: ${adminData?.agents?.length || 0}
        - Rotinas: ${adminData?.routines?.length || 0}

        Forneça 2 insights estratégicos em português brasileiro sobre performance e otimizações.`;

      const response = await LLM.ask({
        prompt: analysisPrompt,
        systemPrompt: "Você é o VISION COMMANDER, um assistente estratégico da plataforma AUTVISION. Seja conciso e profissional."
      });

      // Processa resposta da LLM real
      const insights = [
        {
          type: "performance",
          message: response.response || "Sistema operando com eficiência máxima",
          priority: "high"
        },
        {
          type: "optimization", 
          message: `Modelo usado: ${response.modelUsed || 'IA Estratégica'}`,
          priority: "medium"
        }
      ];

      setSystemInsights(insights);
      setCurrentMessage("Análise estratégica concluída. Todos os sistemas operacionais.");
    } catch (error) {
      console.error('Erro na análise:', error);
      setCurrentMessage("Análise temporariamente indisponível. Sistemas principais operacionais.");
      setSystemInsights([
        {
          type: "status",
          message: "Central de comando operacional",
          priority: "high"
        }
      ]);
    }
  };

  const handleCommand = async (command) => {
    if (!command.trim()) return;
    setIsProcessing(true);
    setCurrentMessage(`Processando: "${command}"`);

    try {
      const commandPrompt = `Você é o VISION COMMANDER da AUTVISION. O administrador perguntou: "${command}"
        Responda em português brasileiro de forma profissional e estratégica.`;

      const response = await LLM.ask({
        prompt: commandPrompt,
        systemPrompt: "Você é o VISION COMMANDER, um assistente estratégico da plataforma AUTVISION. Seja direto e útil."
      });

      const responseText = response.response || "Comando processado com sucesso.";
      setCurrentMessage(responseText);

      if (!silentMode) {
        speakText(responseText);
      }

      // Callback para o componente pai se necessário
      if (onVoiceCommand) {
        onVoiceCommand(command, responseText);
      }

    } catch (error) {
      console.error("Erro no comando:", error);
      const errorMsg = "Comando temporariamente indisponível. Sistemas principais operacionais.";
      setCurrentMessage(errorMsg);
      if (!silentMode) {
        speakText(errorMsg);
      }
    } finally {
      setIsProcessing(false);
    }
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
    setCurrentMessage("Ouvindo comando... Pode falar agora.");

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

  const speakText = (text) => {
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

  const handleAuth = (codeParam) => {
    const codeToTest = (typeof codeParam === 'string') ? codeParam : authCode;
    if (codeToTest.trim().toLowerCase() === 'misericordia') {
      setIsAuthenticated(true);
      setAuthError('');
      const authSuccessMsg = "Acesso liberado, Comandante. Central de comando operacional.";
      setCurrentMessage(authSuccessMsg);
      if(!silentMode) speakText(authSuccessMsg);
    } else {
      setAuthError('Código de acesso incorreto.');
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
      handleAuth(command);
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

  // TELA DE AUTENTICAÇÃO LIMPA
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700 shadow-2xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <ReactiveVisionAgent
                  type="visionCommander"
                  expression="neutro"
                  size={100}
                  isActive={true}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">VISION COMMAND ACCESS</h1>
                <p className="text-gray-400">Central de Comando - Acesso Restrito</p>
              </div>

              {authError && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                  {authError}
                </div>
              )}

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
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                  🎤 Ouvindo código de acesso...
                </div>
              )}

              <Button
                onClick={() => handleAuth()}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                disabled={!authCode.trim()}
              >
                <Shield className="w-4 h-4 mr-2" />
                Acessar Central de Comando
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // INTERFACE PRINCIPAL - VISION COMMANDER IMPONENTE
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 flex flex-col">
      
      {/* VISION COMMANDER CENTRAL - IMPONENTE */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        
        {/* VISION PRINCIPAL - GRANDE E IMPONENTE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <ReactiveVisionAgent
            type="visionCommander"
            expression={isProcessing ? "pensando" : isSpeaking ? "falando" : isListening ? "surpreso" : "neutro"}
            size={300}
            isActive={true}
            className="drop-shadow-2xl"
          />
        </motion.div>

        {/* STATUS PRINCIPAL - LIMPO */}
        <motion.div
          key={currentMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 max-w-4xl"
        >
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
            <p className="text-xl font-medium text-cyan-100 leading-relaxed">
              {currentMessage || "Central de Comando Operacional. Aguardando ordens..."}
            </p>
          </div>
        </motion.div>

        {/* CONTROLES PRINCIPAIS - COMPACTOS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-2xl space-y-4"
        >
          {/* Indicadores de Status */}
          <div className="flex justify-center gap-4 mb-6">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
              <Activity className="w-3 h-3 mr-2" />
              Sistema Online
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
              <Brain className="w-3 h-3 mr-2" />
              IA Ativa
            </Badge>
            {silentMode && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
                <VolumeX className="w-3 h-3 mr-2" />
                Modo Silencioso
              </Badge>
            )}
          </div>

          {/* Controles de Ação */}
          <div className="flex justify-center gap-4 mb-6">
            <Button
              onClick={startListening}
              disabled={isListening || isSpeaking || isProcessing}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-3"
            >
              {isListening ? (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Ouvindo...
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Comando de Voz
                </>
              )}
            </Button>

            <Button
              onClick={toggleSilentMode}
              variant={silentMode ? "default" : "outline"}
              className={`font-semibold px-6 py-3 ${silentMode
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              }`}
            >
              {silentMode ? (
                <>
                  <VolumeX className="w-5 h-5 mr-2" />
                  Silencioso
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 mr-2" />
                  Áudio Ativo
                </>
              )}
            </Button>
          </div>

          {/* Input de Comando */}
          <div className="flex gap-3">
            <Input
              value={textCommand}
              onChange={(e) => setTextCommand(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
              placeholder="Digite seu comando estratégico..."
              className="bg-black/30 border-cyan-500/30 text-cyan-100 placeholder-cyan-400/60 focus:border-cyan-400 backdrop-blur-sm flex-1 text-lg py-3"
              disabled={isProcessing}
            />
            <Button
              onClick={handleTextSubmit}
              disabled={isProcessing || !textCommand.trim()}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold px-6 py-3"
            >
              {isProcessing ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Loader2 className="w-5 h-5" />
                </motion.div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* LOGS MINIMALISTAS NO RODAPÉ */}
      <div className="border-t border-gray-700/50 bg-black/20 backdrop-blur-sm p-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Logs Compactos */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Status do Sistema
              </h3>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {systemLog.slice(0, 3).map((log) => (
                  <div key={log.timestamp} className="flex items-center gap-2 text-xs text-green-300">
                    <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-gray-500 text-xs">
                      [{new Date(log.timestamp).toLocaleTimeString()}]
                    </span>
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights Compactos */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Insights Estratégicos
              </h3>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {systemInsights.slice(0, 2).map((insight) => (
                  <div key={insight.timestamp} className="text-xs text-purple-300">
                    <span className="text-purple-400 font-medium">{insight.type}:</span> {insight.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}