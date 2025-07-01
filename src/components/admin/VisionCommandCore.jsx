import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import {
  Mic,
  VolumeX,
  Volume2,
  Send,
  Loader2,
  Server,
  Sparkles,
  Key,
  Eye,
  Activity,
  Users,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Settings,
  Database,
  Monitor,
  BarChart3,
  FileText,
  RefreshCw,
  Shield,
  Clock,
  Globe,
  Bot,
  Play,
  Pause,
  X,
  Info,
  MessageSquare,
  Wifi
} from 'lucide-react';
import { InvokeLLM } from '@/api/integrations';
import { VISION_COMMANDER_IMAGE } from '../../constants/images';
import VisionChatIntegrated from '../vision/VisionChatIntegrated';
import { useAdminData } from './AdminDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { VisionCompanion, Agent, SystemLog, Analytics, User } from "../../api/entities";
import axios from 'axios';



// VISION COMMAND CORE - FUSÃO ÉPICA DO VISION COMMAND + VISION CORE
// Super Agente Cerebral estilo Jarvis com visão completa da operação

const CosmicSphere3D = ({ isListening, isSpeaking, isProcessing }) => {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{
          scale: isListening ? [1, 1.1, 1] : isSpeaking ? [1, 1.05, 1] : [1, 1.02, 1],
          rotate: isProcessing ? 360 : 0,
          y: [0, -10, 0]
        }}
        transition={{
          scale: { duration: 2, repeat: Infinity },
          rotate: { duration: 4, repeat: Infinity, ease: "linear" },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <img 
          src="/assets/images/vision/visioncommand.PNG" 
          alt="Vision Command" 
          className={`w-48 h-48 object-contain transition-all duration-300 drop-shadow-2xl ${
            isListening ? 'filter brightness-125 hue-rotate-[320deg] drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]' :
            isSpeaking ? 'filter brightness-125 hue-rotate-[90deg] drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]' :
            isProcessing ? 'filter brightness-125 hue-rotate-[45deg] drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]' :
            'filter brightness-110 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]'
          }`}
        />
      </motion.div>
    </div>
  );
};

export default function VisionCommandCore({ adminData, onVoiceCommand }) {
  const { user } = useAuth();
  
  // Estados de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isListeningForPassword, setIsListeningForPassword] = useState(false);

  // Estados do Vision Core
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [silentMode, setSilentMode] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Estados para gerenciamento de Visions
  const [visions, setVisions] = useState([]);
  const [selectedVision, setSelectedVision] = useState(null);
  const [visionForm, setVisionForm] = useState({
    name: '',
    description: '',
    prompt: '',
    personality: 'assistente',
    capabilities: [],
    status: 'active'
  });
  const [isEditingVision, setIsEditingVision] = useState(false);
  const [isCreatingVision, setIsCreatingVision] = useState(false);
  
  // Estados para logs e monitoramento
  const [systemLogs, setSystemLogs] = useState([
    { 
      id: 'init-1', 
      level: 'info', 
      type: 'info', 
      message: 'Vision Command Core inicializado', 
      timestamp: new Date().toISOString() 
    },
    { 
      id: 'init-2', 
      level: 'success', 
      type: 'success', 
      message: 'Sistema operacional e pronto para uso', 
      timestamp: new Date().toISOString() 
    }
  ]);
  const [platformInsights, setPlatformInsights] = useState([]);
  const [realTimeData, setRealTimeData] = useState({
    agents: [],
    users: [],
    interactions: 0,
    activeUsers: 0,
    onlineVisions: 0,
    totalMessages: 0,
    systemHealth: 'optimal'
  });
  
  const [systemMetrics, setSystemMetrics] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalInteractions: 0,
    systemLoad: 0,
    uptime: '0h 0m'
  });

  // Hook para dados administrativos
  const { data, isLoading, refreshAll } = useAdminData();

  // Função para síntese de fala - mantida para compatibilidade com a esfera 3D
  const speakText = useCallback((text) => {
    if (!('speechSynthesis' in window) || silentMode) return;

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  }, [silentMode]);

  // Funções para carregar dados reais
  const loadVisions = useCallback(async () => {
    try {
      setLoading(true);
      const visionsData = await VisionCompanion.filter({ created_by: user?.id });
      setVisions(visionsData || []);
    } catch (error) {
      console.error('Erro ao carregar Visions:', error);
      setError('Erro ao carregar Visions');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const loadSystemLogs = async () => {
    console.log('🔄 Carregando logs do sistema...');
    try {
      setLoading(true);
      const logsData = await SystemLog.list({ limit: 50 });
      setSystemLogs(logsData || []);
      console.log('✅ Logs carregados:', logsData?.length || 0);
    } catch (error) {
      console.warn('Backend indisponível, usando dados mock para logs:', error.message);
      // Dados mock para logs quando backend não estiver disponível
      const mockLogs = [
        { id: 1, level: 'info', type: 'info', message: 'Sistema iniciado com sucesso', timestamp: new Date().toISOString() },
        { id: 2, level: 'warning', type: 'warning', message: 'Backend temporariamente indisponível', timestamp: new Date().toISOString() },
        { id: 3, level: 'info', type: 'info', message: 'Modo offline ativado', timestamp: new Date().toISOString() },
        { id: 4, level: 'error', type: 'error', message: 'Erro de conexão com API externa', timestamp: new Date().toISOString() },
        { id: 5, level: 'success', type: 'success', message: 'Backup realizado com sucesso', timestamp: new Date().toISOString() }
      ];
      setSystemLogs(mockLogs);
      console.log('📝 Usando dados mock para logs:', mockLogs.length);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    console.log('📊 Carregando dados do dashboard...');
    try {
      setLoading(true);
      const [agentsData, analyticsData] = await Promise.all([
        Agent.list(),
        Analytics.list()
      ]);
      
      setRealTimeData(prev => ({
        ...prev,
        agents: agentsData || [],
        onlineVisions: (visions || []).filter(v => v.status === 'active').length,
        activeUsers: analyticsData?.activeUsers || 0,
        interactions: analyticsData?.totalInteractions || 0
      }));
      console.log('✅ Dados do dashboard carregados');
    } catch (error) {
      console.warn('Backend indisponível, usando dados mock para dashboard:', error.message);
      // Dados mock quando backend não estiver disponível
      const mockData = {
        agents: [
          { id: 1, name: 'Vision Assistant', status: 'online', type: 'assistant', last_seen: new Date().toISOString() },
          { id: 2, name: 'Vision Companion', status: 'online', type: 'companion', last_seen: new Date().toISOString() },
          { id: 3, name: 'Vision Specialist', status: 'offline', type: 'specialist', last_seen: new Date(Date.now() - 300000).toISOString() },
          { id: 4, name: 'Vision Analytics', status: 'online', type: 'analytics', last_seen: new Date().toISOString() }
        ],
        onlineVisions: 3,
        activeUsers: 24,
        interactions: 1847,
        systemHealth: 'optimal',
        totalMessages: 156
      };
      setRealTimeData(prev => ({ ...prev, ...mockData }));
      console.log('📝 Usando dados mock para dashboard:', mockData);
    } finally {
      setLoading(false);
    }
  };

  const createVision = async (visionData) => {
    try {
      setLoading(true);
      const newVision = await VisionCompanion.create({
        ...visionData,
        created_by: user?.id
      });
      setVisions(prev => [...prev, newVision]);
      setVisionForm({
        name: '',
        description: '',
        prompt: '',
        personality: 'assistente',
        capabilities: [],
        status: 'active'
      });
      setIsCreatingVision(false);
      addSystemLog('Vision criado', `Novo vision "${visionData.name}" foi criado com sucesso`);
      return newVision;
    } catch (error) {
      console.error('Erro ao criar Vision:', error);
      setError('Erro ao criar Vision');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateVision = async (id, visionData) => {
    try {
      setLoading(true);
      const updatedVision = await VisionCompanion.update(id, visionData);
      setVisions(prev => prev.map(v => v.id === id ? updatedVision : v));
      setIsEditingVision(false);
      setSelectedVision(null);
      addSystemLog('Vision atualizado', `Vision "${visionData.name}" foi atualizado`);
      return updatedVision;
    } catch (error) {
      console.error('Erro ao atualizar Vision:', error);
      setError('Erro ao atualizar Vision');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteVision = async (visionId) => {
    try {
      const vision = visions.find(v => v.id === visionId);
      setVisions(prev => prev.filter(v => v.id !== visionId));
      addSystemLog('Vision removido', `Vision "${vision?.name}" foi removido do sistema`);
    } catch (error) {
      console.error('Erro ao deletar vision:', error);
    }
  };

  // Sistema de logs e monitoramento
  const addSystemLog = useCallback((type, message, level = 'info') => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type,
      message,
      level
    };
    setSystemLogs(prev => [newLog, ...prev.slice(0, 99)]); // Manter apenas 100 logs
  }, []);

  const generatePlatformInsights = useCallback(() => {
    const insights = [
      {
        id: 1,
        type: 'performance',
        title: 'Pico de Atividade Detectado',
        description: 'Aumento de 35% nas interações nas últimas 2 horas',
        severity: 'info',
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        type: 'optimization',
        title: 'Oportunidade de Melhoria',
        description: 'Vision Companion pode ser otimizado para respostas mais rápidas',
        severity: 'warning',
        timestamp: new Date().toISOString()
      },
      {
        id: 3,
        type: 'success',
        title: 'Meta Alcançada',
        description: 'Satisfação dos usuários atingiu 94% esta semana',
        severity: 'success',
        timestamp: new Date().toISOString()
      }
    ];
    setPlatformInsights(insights);
  }, []);

  // Calcular métricas do sistema
  const calculateSystemMetrics = useCallback(() => {
    if (!data) return;

    const agents = data.agents || [];
    const dataVisions = data.visions || [];
    const users = data.users || [];

    // Combinar com visions locais
    const allVisions = [...dataVisions, ...visions];
    
    setSystemMetrics({
      totalAgents: agents.length + allVisions.length,
      activeAgents: (agents || []).filter(a => a.status === 'active').length + (allVisions || []).filter(v => v.status === 'active').length,
      totalInteractions: allVisions.reduce((sum, v) => sum + (v.total_interactions || v.interactions_today || 0), 0),
      systemLoad: Math.round(45 + Math.random() * 30),
      uptime: '24h 15m' // Simulado
    });

    // Atualizar dados em tempo real
    setRealTimeData({
      activeUsers: users.filter(u => u.last_seen && new Date(u.last_seen) > new Date(Date.now() - 5 * 60 * 1000)).length,
      onlineVisions: (allVisions || []).filter(v => v.status === 'active').length,
      totalMessages: allVisions.reduce((sum, v) => sum + (v.interactions_today || 0), 0),
      systemHealth: 'optimal'
    });
  }, [data, visions]);

  // Inicialização do sistema
  useEffect(() => {
    if (user?.id) {
      loadVisions();
      loadSystemLogs();
      loadDashboardData();
      generatePlatformInsights();
      addSystemLog('Sistema iniciado', 'Vision Command Core ativado com sucesso');
    }
  }, [user?.id, loadVisions, generatePlatformInsights, addSystemLog]);

  // Atualizar métricas quando dados mudarem
  useEffect(() => {
    calculateSystemMetrics();
    const interval = setInterval(() => {
      calculateSystemMetrics();
      // Simular logs em tempo real
      if (Math.random() > 0.7) {
        const logTypes = ['Interação processada', 'Usuário conectado', 'Vision ativado', 'Análise concluída'];
        const randomType = logTypes[Math.floor(Math.random() * logTypes.length)];
        addSystemLog('Sistema', randomType);
      }
    }, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, [calculateSystemMetrics, addSystemLog]);

  // Atualizar insights periodicamente
  useEffect(() => {
    const interval = setInterval(generatePlatformInsights, 300000); // A cada 5 minutos
    return () => clearInterval(interval);
  }, [generatePlatformInsights]);

  // Função para alternar modo silencioso
  const toggleSilentMode = () => {
    setSilentMode(!silentMode);
    if (!silentMode) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Autenticação
  const handleAuth = (code = authCode) => {
    const validCodes = ['vision123', 'admin', 'jarvis', 'autvision'];
    if (validCodes.includes(code.toLowerCase())) {
      setIsAuthenticated(true);
      setAuthError('');
      setCurrentMessage('Bem-vindo de volta, Comandante. Sistemas operacionais. Aguardando suas ordens.');
      if (!silentMode) {
        setTimeout(() => speakText('Bem-vindo de volta, Comandante. Todos os sistemas operacionais.'), 1000);
      }
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
                VISION Command Core
              </CardTitle>
              <p className="text-gray-400">
                Olá, <span className="text-blue-400 font-semibold">Comandante</span>. Acesso ao cérebro central.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Fale ou digite o código para acessar o sistema neural.
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
                  Acessar Command Core
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Interface principal do Vision Command Core
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
              alt="AutVision Command Core"
              className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">VISION Command Core</h1>
          <p className="text-xl text-blue-400">
            Bem-vindo de volta, <span className="font-semibold">Comandante</span>
          </p>
          <p className="text-gray-400 mt-2">
            Sistema neural central operacional. Cérebro da operação ativo.
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <Badge variant="outline" className="text-green-400 border-green-400">
              <Activity className="w-3 h-3 mr-1" />
              {realTimeData.onlineVisions} Visions Online
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              <Users className="w-3 h-3 mr-1" />
              {realTimeData.activeUsers} Usuários Ativos
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              <Globe className="w-3 h-3 mr-1" />
              Sistema {realTimeData.systemHealth === 'optimal' ? 'Ótimo' : 'Normal'}
            </Badge>
          </div>
        </motion.div>

        {/* Seção Superior: Vision Sphere + Vision Chat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Vision Sphere */}
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center"
            >
              <div className="relative">
                <CosmicSphere3D
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  isProcessing={isProcessing}
                />
              </div>
            </motion.div>

            {/* Botão de Modo Silencioso */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center"
            >
              <Button
                onClick={toggleSilentMode}
                variant="ghost"
                size="sm"
                className={`rounded-full p-3 transition-all duration-300 ${
                  silentMode
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                }`}
              >
                {silentMode ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </Button>
            </motion.div>

            {/* Status Message */}
            <motion.div
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full text-center px-4"
            >
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/30">
                <p className="text-sm font-medium text-cyan-100 leading-relaxed min-h-[2rem] flex items-center justify-center">
                  {currentMessage || "Sistema neural aguardando comandos..."}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Vision Chat Integrado - Achatado */}
          <div className="flex flex-col">
            <VisionChatIntegrated
              className="w-full h-96"
              size="compact"
              showAvatar={false}
              autoSpeak={!silentMode}
              isAdminMode={true}
            />
          </div>
        </motion.div>

        {/* Sistema de Abas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={(value) => {
            console.log('🔄 Mudando aba para:', value);
            setActiveTab(value);
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="visions" className="data-[state=active]:bg-blue-600">
                <Database className="w-4 h-4 mr-2" />
                Visions
              </TabsTrigger>
              <TabsTrigger value="logs" className="data-[state=active]:bg-blue-600">
                <FileText className="w-4 h-4 mr-2" />
                Logs
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="data-[state=active]:bg-blue-600">
                <Monitor className="w-4 h-4 mr-2" />
                Monitoramento
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Dashboard do Sistema</h3>
                <Button 
                  onClick={loadDashboardData}
                  size="sm" 
                  variant="outline"
                  disabled={loading}
                  className="border-slate-600 text-slate-400"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
              </div>

              {error && (
                <Alert className="bg-red-900/50 border-red-700 mb-4">
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              {/* Métricas do Sistema */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/30 hover:from-blue-800/50 hover:to-cyan-800/50 transition-all">
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{realTimeData.activeUsers}</p>
                    <p className="text-sm text-blue-300">Usuários Ativos</p>
                    <p className="text-xs text-blue-200/70 mt-1">Últimas 24h</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 hover:from-purple-800/50 hover:to-pink-800/50 transition-all">
                  <CardContent className="p-4 text-center">
                    <Bot className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{realTimeData.onlineVisions}</p>
                    <p className="text-sm text-purple-300">Visions Ativos</p>
                    <p className="text-xs text-purple-200/70 mt-1">Total: {visions.length}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 hover:from-green-800/50 hover:to-emerald-800/50 transition-all">
                  <CardContent className="p-4 text-center">
                    <MessageSquare className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{realTimeData.interactions}</p>
                    <p className="text-sm text-green-300">Interações</p>
                    <p className="text-xs text-green-200/70 mt-1">Total hoje</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/30 hover:from-orange-800/50 hover:to-red-800/50 transition-all">
                  <CardContent className="p-4 text-center">
                    <Activity className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{realTimeData.systemHealth}%</p>
                    <p className="text-sm text-orange-300">Saúde do Sistema</p>
                    <Progress value={realTimeData.systemHealth} className="mt-2 h-2" />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Métricas Detalhadas e Visions Recentes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                      Métricas do Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">CPU:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={realTimeData.cpuUsage} className="w-20 h-2" />
                          <span className="text-white font-semibold">{realTimeData.cpuUsage}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Memória:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={realTimeData.memoryUsage} className="w-20 h-2" />
                          <span className="text-white font-semibold">{realTimeData.memoryUsage}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Latência:</span>
                        <span className="text-white font-semibold">{realTimeData.networkLatency}ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Agentes:</span>
                        <span className="text-white font-semibold">{realTimeData.agents?.length || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Uptime:</span>
                        <span className="text-white font-semibold">{systemMetrics.uptime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                      Visions Recentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {visions.slice(0, 5).map((vision) => (
                        <div key={vision.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded border border-slate-600 hover:bg-slate-700/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              vision.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                            }`} />
                            <div>
                              <p className="text-white font-medium text-sm">{vision.name}</p>
                              <p className="text-slate-400 text-xs truncate max-w-[200px]">{vision.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white text-sm">{vision.total_interactions || 0}</p>
                            <p className="text-slate-400 text-xs">interações</p>
                          </div>
                        </div>
                      ))}
                      {visions.length === 0 && (
                        <div className="text-center text-slate-400 py-4 text-sm">
                          Nenhum Vision criado ainda
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Visions Tab */}
            <TabsContent value="visions" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lista de Visions */}
                <Card className="bg-gray-800/50 border border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span className="flex items-center">
                        <Database className="w-5 h-5 mr-2 text-blue-400" />
                        Visions Ativos
                      </span>
                      <Dialog open={isCreatingVision} onOpenChange={setIsCreatingVision}>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => {
                              setIsEditingVision(false);
                              setSelectedVision(null);
                              setVisionForm({
                                name: '',
                                description: '',
                                prompt: '',
                                personality: 'assistente',
                                capabilities: [],
                                status: 'active'
                              });
                              setIsCreatingVision(true);
                            }}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Novo Vision
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-white">Criar Novo Vision</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="name" className="text-white">Nome</Label>
                                <Input
                                  id="name"
                                  value={visionForm.name}
                                  onChange={(e) => setVisionForm(prev => ({ ...prev, name: e.target.value }))}
                                  className="bg-gray-700 border-gray-600 text-white"
                                  placeholder="Nome do Vision"
                                />
                              </div>
                              <div>
                                <Label htmlFor="personality" className="text-white">Personalidade</Label>
                                <Select value={visionForm.personality} onValueChange={(value) => setVisionForm(prev => ({ ...prev, personality: value }))}>
                                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-700 border-gray-600">
                                    <SelectItem value="assistente">Assistente</SelectItem>
                                    <SelectItem value="amigavel">Amigável</SelectItem>
                                    <SelectItem value="profissional">Profissional</SelectItem>
                                    <SelectItem value="analitico">Analítico</SelectItem>
                                    <SelectItem value="criativo">Criativo</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="description" className="text-white">Descrição</Label>
                              <Textarea
                                id="description"
                                value={visionForm.description}
                                onChange={(e) => setVisionForm(prev => ({ ...prev, description: e.target.value }))}
                                className="bg-gray-700 border-gray-600 text-white"
                                placeholder="Descrição do Vision"
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="prompt" className="text-white">Prompt do Sistema</Label>
                              <Textarea
                                id="prompt"
                                value={visionForm.prompt}
                                onChange={(e) => setVisionForm(prev => ({ ...prev, prompt: e.target.value }))}
                                className="bg-gray-700 border-gray-600 text-white"
                                placeholder="Prompt personalizado para o Vision"
                                rows={5}
                              />
                            </div>
                            <div>
                              <Label className="text-white">Capacidades</Label>
                              <div className="grid grid-cols-3 gap-2 mt-2">
                                {['chat', 'analise', 'suporte', 'relatorios', 'insights', 'automacao'].map((cap) => (
                                  <div key={cap} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={cap}
                                      checked={visionForm.capabilities.includes(cap)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setVisionForm(prev => ({ ...prev, capabilities: [...prev.capabilities, cap] }));
                                        } else {
                                          setVisionForm(prev => ({ ...prev, capabilities: prev.capabilities.filter(c => c !== cap) }));
                                        }
                                      }}
                                    />
                                    <Label htmlFor={cap} className="text-white capitalize">{cap}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setIsCreatingVision(false)}>
                                Cancelar
                              </Button>
                              <Button 
                                onClick={() => createVision(visionForm)}
                                disabled={loading || !visionForm.name || !visionForm.description}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                {loading ? 'Criando...' : 'Criar Vision'}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert className="bg-red-900/50 border-red-700">
                        <AlertDescription className="text-red-200">{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {loading ? (
                      <div className="text-center text-gray-400 py-8">
                        Carregando Visions...
                      </div>
                    ) : visions.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        Nenhum Vision encontrado. Crie seu primeiro Vision!
                      </div>
                    ) : (
                      visions.map((vision) => (
                        <div
                          key={vision.id}
                          className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-semibold">{vision.name}</h3>
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => {
                                  setSelectedVision(vision);
                                  setVisionForm(vision);
                                  setIsEditingVision(true);
                                }}
                                size="sm"
                                variant="ghost"
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => deleteVision(vision.id)}
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{vision.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex space-x-4">
                              <span className="text-green-400">
                                <Users className="w-4 h-4 inline mr-1" />
                                {vision.users_count || 0} usuários
                              </span>
                              <span className="text-blue-400">
                                <Activity className="w-4 h-4 inline mr-1" />
                                {vision.interactions_today || 0} interações
                              </span>
                            </div>
                            <Badge
                              variant={vision.status === 'active' ? 'default' : 'secondary'}
                              className={vision.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}
                            >
                              {vision.status === 'active' ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                          {vision.capabilities && vision.capabilities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {vision.capabilities.map((cap) => (
                                <Badge key={cap} variant="outline" className="text-xs">
                                  {cap}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Formulário de Vision */}
                <Card className="bg-gray-800/50 border border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-purple-400" />
                      {isEditingVision ? 'Editar Vision' : 'Criar Novo Vision'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Nome do Vision</label>
                      <Input
                        value={visionForm.name}
                        onChange={(e) => setVisionForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Vision Assistant"
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Descrição</label>
                      <Input
                        value={visionForm.description}
                        onChange={(e) => setVisionForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Breve descrição do Vision"
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Prompt do Sistema</label>
                      <Textarea
                        value={visionForm.prompt}
                        onChange={(e) => setVisionForm(prev => ({ ...prev, prompt: e.target.value }))}
                        placeholder="Defina a personalidade e comportamento do Vision..."
                        className="bg-gray-700/50 border-gray-600 text-white h-32"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        onClick={() => {
                          if (isEditingVision && selectedVision) {
                            updateVision(selectedVision.id, visionForm);
                          } else {
                            createVision(visionForm);
                          }
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        disabled={!visionForm.name || !visionForm.description}
                      >
                        {isEditingVision ? 'Atualizar' : 'Criar'} Vision
                      </Button>
                      {isEditingVision && (
                        <Button
                          onClick={() => {
                            setIsEditingVision(false);
                            setSelectedVision(null);
                            setVisionForm({
                              name: '',
                              description: '',
                              prompt: '',
                              personality: 'assistente',
                              capabilities: [],
                              status: 'active'
                            });
                          }}
                          variant="outline"
                          className="border-gray-600 text-gray-400"
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Logs Tab - NOVA IMPLEMENTAÇÃO FUNCIONAL */}
            <TabsContent value="logs" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <FileText className="w-6 h-6 mr-3 text-blue-400" />
                    Sistema de Logs
                  </h3>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => {
                        console.log('🔄 Botão Atualizar Logs clicado!');
                        loadSystemLogs();
                      }}
                      size="sm" 
                      variant="outline"
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-600/20 hover:border-blue-400 transition-all duration-200"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Atualizar Logs
                    </Button>
                    <Button 
                      onClick={() => {
                        console.log('🗑️ Botão Limpar Logs clicado!');
                        setSystemLogs([]);
                      }}
                      size="sm" 
                      variant="outline"
                      className="border-red-500/50 text-red-400 hover:bg-red-600/20 hover:border-red-400 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Limpar Logs
                    </Button>
                  </div>
                </div>

                {/* Logs em Tempo Real */}
                <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-600/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-green-400" />
                        Logs em Tempo Real
                      </div>
                      <Badge variant="outline" className="border-green-500/50 text-green-400">
                        {systemLogs.length} registros
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96 w-full">
                      <div className="space-y-3">
                        {loading ? (
                          <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-400 mr-3" />
                            <span className="text-gray-400">Carregando logs...</span>
                          </div>
                        ) : systemLogs.length === 0 ? (
                          <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-400">Nenhum log encontrado</p>
                            <p className="text-gray-500 text-sm mt-1">Clique em "Atualizar Logs" para carregar</p>
                          </div>
                        ) : (
                          systemLogs.map((log, index) => (
                            <motion.div
                              key={log.id || index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`p-4 rounded-lg border-l-4 hover:bg-gray-700/30 transition-all duration-200 cursor-pointer ${
                                log.level === 'ERROR' || log.type === 'error' ? 'bg-red-900/20 border-red-500 hover:bg-red-900/30' :
                                log.level === 'WARN' || log.type === 'warning' ? 'bg-yellow-900/20 border-yellow-500 hover:bg-yellow-900/30' :
                                log.level === 'SUCCESS' || log.type === 'success' ? 'bg-green-900/20 border-green-500 hover:bg-green-900/30' :
                                'bg-blue-900/20 border-blue-500 hover:bg-blue-900/30'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${
                                    log.level === 'ERROR' || log.type === 'error' ? 'bg-red-500' :
                                    log.level === 'WARN' || log.type === 'warning' ? 'bg-yellow-500' :
                                    log.level === 'SUCCESS' || log.type === 'success' ? 'bg-green-500' :
                                    'bg-blue-500'
                                  }`} />
                                  <span className="text-white font-medium">{log.action || log.event || log.type || 'Sistema'}</span>
                                  {log.level && (
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${
                                        log.level === 'ERROR' ? 'border-red-500/50 text-red-400' :
                                        log.level === 'WARN' ? 'border-yellow-500/50 text-yellow-400' :
                                        log.level === 'INFO' ? 'border-blue-500/50 text-blue-400' :
                                        'border-green-500/50 text-green-400'
                                      }`}
                                    >
                                      {log.level}
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-xs text-gray-400">
                                  {log.timestamp ? new Date(log.timestamp).toLocaleString() : new Date().toLocaleString()}
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm leading-relaxed">{log.details || log.message}</p>
                              {(log.user_id || log.source) && (
                                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                  {log.user_id && <span>👤 Usuário: {log.user_id}</span>}
                                  {log.source && <span>📍 Origem: {log.source}</span>}
                                </div>
                              )}
                            </motion.div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Estatísticas e Alertas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Alertas Críticos */}
                  <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                        Alertas Críticos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {systemLogs.filter(log => log.type === 'error' || log.level === 'ERROR').slice(0, 3).map((log, index) => (
                          <div key={index} className="p-3 bg-red-900/30 rounded-lg border border-red-500/30">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                              <span className="text-red-300 font-medium text-sm">{log.action || log.type}</span>
                            </div>
                            <p className="text-red-200 text-xs">{log.details || log.message}</p>
                          </div>
                        ))}
                        {systemLogs.filter(log => log.type === 'error' || log.level === 'ERROR').length === 0 && (
                          <div className="text-center py-6">
                            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                            <p className="text-green-400 text-sm">Nenhum erro crítico</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Estatísticas de Logs */}
                  <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                        Estatísticas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-900/30 rounded-lg">
                          <p className="text-2xl font-bold text-white">{systemLogs.length}</p>
                          <p className="text-blue-300 text-sm">Total</p>
                        </div>
                        <div className="text-center p-3 bg-red-900/30 rounded-lg">
                          <p className="text-2xl font-bold text-red-400">
                            {systemLogs.filter(log => log.type === 'error' || log.level === 'ERROR').length}
                          </p>
                          <p className="text-red-300 text-sm">Erros</p>
                        </div>
                        <div className="text-center p-3 bg-yellow-900/30 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-400">
                            {systemLogs.filter(log => log.type === 'warning' || log.level === 'WARN').length}
                          </p>
                          <p className="text-yellow-300 text-sm">Avisos</p>
                        </div>
                        <div className="text-center p-3 bg-green-900/30 rounded-lg">
                          <p className="text-2xl font-bold text-green-400">
                            {systemLogs.filter(log => log.type === 'success' || log.level === 'SUCCESS').length}
                          </p>
                          <p className="text-green-300 text-sm">Sucessos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>

            {/* Monitoramento Tab - NOVA IMPLEMENTAÇÃO FUNCIONAL */}
            <TabsContent value="monitoring" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Monitor className="w-6 h-6 mr-3 text-green-400" />
                    Monitoramento do Sistema
                  </h3>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => {
                        console.log('📊 Botão Atualizar Monitoramento clicado!');
                        loadDashboardData();
                      }}
                      size="sm" 
                      variant="outline"
                      className="border-green-500/50 text-green-400 hover:bg-green-600/20 hover:border-green-400 transition-all duration-200"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Atualizar Dados
                    </Button>
                    <Button 
                      onClick={() => {
                        console.log('🗑️ Botão Limpar Alertas clicado!');
                        setRealTimeData(prev => ({ ...prev, alerts: [] }));
                      }}
                      size="sm" 
                      variant="outline"
                      className="border-orange-500/50 text-orange-400 hover:bg-orange-600/20 hover:border-orange-400 transition-all duration-200"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Limpar Alertas
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert className="bg-red-900/50 border-red-700 mb-6">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription className="text-red-200">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Métricas em Tempo Real */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/30">
                    <CardContent className="p-6 text-center">
                      <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-white">{systemMetrics.uptime}</p>
                      <p className="text-blue-300 text-sm">Uptime do Sistema</p>
                      <div className="mt-2 h-1 bg-blue-900/50 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full" style={{ width: '95%' }} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30">
                    <CardContent className="p-6 text-center">
                      <Activity className="w-8 h-8 text-green-400 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-white">{realTimeData.cpuUsage || systemMetrics.systemLoad}%</p>
                      <p className="text-green-300 text-sm">Uso de CPU</p>
                      <Progress value={realTimeData.cpuUsage || systemMetrics.systemLoad} className="mt-2 h-2" />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30">
                    <CardContent className="p-6 text-center">
                      <Server className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-white">{realTimeData.memoryUsage || 45}%</p>
                      <p className="text-purple-300 text-sm">Uso de Memória</p>
                      <Progress value={realTimeData.memoryUsage || 45} className="mt-2 h-2" />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/30">
                    <CardContent className="p-6 text-center">
                      <Zap className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-white">{realTimeData.networkLatency || 120}ms</p>
                      <p className="text-orange-300 text-sm">Latência de Rede</p>
                      <div className="mt-2 h-1 bg-orange-900/50 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 rounded-full" style={{ width: '80%' }} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Status dos Agentes e Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Status dos Agentes */}
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-600/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <div className="flex items-center">
                          <Bot className="w-5 h-5 mr-2 text-blue-400" />
                          Status dos Agentes
                        </div>
                        <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                          {(realTimeData.agents || []).length} agentes
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-green-900/30 rounded-lg p-4 text-center border border-green-500/30">
                          <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                          <p className="text-xl font-bold text-white">{(realTimeData.agents || []).filter(a => a.status === 'online').length}</p>
                          <p className="text-green-300 text-sm">Online</p>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-4 text-center border border-gray-500/30">
                          <div className="w-4 h-4 bg-gray-500 rounded-full mx-auto mb-2"></div>
                          <p className="text-xl font-bold text-white">{(realTimeData.agents || []).filter(a => a.status === 'offline').length}</p>
                          <p className="text-gray-300 text-sm">Offline</p>
                        </div>
                      </div>
                      
                      <ScrollArea className="h-64">
                        <div className="space-y-2">
                          {(realTimeData.agents || []).map((agent, index) => (
                            <motion.div 
                              key={index} 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/50 hover:bg-gray-700/50 transition-all duration-200"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  agent.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                                }`} />
                                <span className="text-white font-medium">{agent.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {agent.type || 'assistant'}
                                </Badge>
                              </div>
                              <span className="text-gray-400 text-xs">
                                {agent.last_seen || 'Agora'}
                              </span>
                            </motion.div>
                          ))}
                          {(realTimeData.agents || []).length === 0 && (
                            <div className="text-center py-8">
                              <Bot className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                              <p className="text-gray-400">Nenhum agente encontrado</p>
                              <p className="text-gray-500 text-sm mt-1">Clique em "Atualizar Dados" para carregar</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Resumo do Sistema */}
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-600/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-green-400" />
                        Resumo do Sistema
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-900/30 rounded-lg p-4 text-center border border-blue-500/30">
                          <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                          <p className="text-xl font-bold text-white">{realTimeData.activeUsers}</p>
                          <p className="text-blue-300 text-sm">Usuários Ativos</p>
                        </div>
                        <div className="bg-purple-900/30 rounded-lg p-4 text-center border border-purple-500/30">
                          <Database className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                          <p className="text-xl font-bold text-white">{realTimeData.onlineVisions}</p>
                          <p className="text-purple-300 text-sm">Visions Online</p>
                        </div>
                      </div>

                      <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                        <h4 className="text-white font-medium mb-3 flex items-center">
                          <Activity className="w-4 h-4 mr-2 text-green-400" />
                          Status Geral
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Saúde do Sistema</span>
                            <Badge className={`${
                              realTimeData.systemHealth === 'optimal' ? 'bg-green-600' : 'bg-yellow-600'
                            }`}>
                              {realTimeData.systemHealth === 'optimal' ? 'Ótimo' : 'Normal'}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Interações Hoje</span>
                            <span className="text-white font-semibold">{realTimeData.interactions}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Mensagens Processadas</span>
                            <span className="text-white font-semibold">{realTimeData.totalMessages}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Última Atualização</span>
                            <span className="text-white text-sm">{new Date().toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>


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

VisionCommandCore.propTypes = {
  adminData: PropTypes.object,
  onVoiceCommand: PropTypes.func,
};