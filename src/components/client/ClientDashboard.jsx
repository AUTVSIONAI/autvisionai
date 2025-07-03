import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  Volume2, 
  VolumeX,
  Brain,
  Settings,
  Zap,
  User,
  Shield,
  Activity,
  Clock
} from 'lucide-react';
import VisionChatClient from '../vision/VisionChatClient';
import { useSync } from '@/contexts/SyncContext';

export default function ClientDashboard() {
  const { globalData } = useSync();
  
  // Estados principais do Vision
  const [isVisionActive, setIsVisionActive] = useState(false);
  const [isListening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [visionCoreConnected] = useState(true);
  const [currentExpression, setCurrentExpression] = useState('neutro');
  
  // Estados do Vision Chat Client
  
  // Estados dos agentes - sincronizados com admin
  const [activeAgents, setActiveAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  
  // Agentes disponíveis vindos do painel admin
  const availableAgents = useMemo(() => globalData.agents || [], [globalData.agents]);
  
  // 🔍 DEBUG: Log para verificar dados dos agentes
  console.log('🤖 ClientDashboard - availableAgents:', availableAgents);
  console.log('🤖 ClientDashboard - availableAgents.length:', availableAgents.length);
  console.log('🤖 ClientDashboard - globalData completo:', globalData);
  
  // Estados do usuário
  const [user] = useState({
    name: 'Paulo Silva',
    visionName: 'ATHENA',
    visionCoreId: 'VC-001'
  });

  // Configuração do Vision Core - DADOS DINÂMICOS
  const visionCore = {
    status: visionCoreConnected ? 'online' : 'offline',
    version: '2.1.4',
    uptime: '72h 15m',
    activeAgents: availableAgents.length, // 🔥 CORREÇÃO: usar dados reais do backend
    tasksCompleted: 847,
    efficiency: 94
  };

  // Animação do Vision - ciclo de expressões
  useEffect(() => {
    if (!isVisionActive) return;
    
    const expressions = ['neutro', 'sorriso', 'atento', 'pensativo', 'confiante'];
    let currentIndex = 0;
    
    const timer = setInterval(() => {
      currentIndex = (currentIndex + 1) % expressions.length;
      setCurrentExpression(expressions[currentIndex]);
    }, 3000);
    
    return () => clearInterval(timer);
  }, [isVisionActive]);

  // Função para ativar/desativar Vision
  const toggleVision = useCallback(() => {
    setIsVisionActive(prev => !prev);
    if (soundEnabled) {
      // Som de ativação/desativação
    }
  }, [soundEnabled]);

  // Função para ativar/desativar agente
  const toggleAgent = useCallback((agentId) => {
    const agent = availableAgents.find(a => a.id === agentId);
    if (!agent) return;
    
    setActiveAgents(prev => {
      const isActive = prev.find(a => a.id === agentId);
      if (isActive) {
        return prev.filter(a => a.id !== agentId);
      } else {
        return [...prev, agent];
      }
    });
  }, [availableAgents]);

  // Função para selecionar agente
  const selectAgent = useCallback((agent) => {
    setSelectedAgent(selectedAgent?.id === agent.id ? null : agent);
  }, [selectedAgent]);

  // Funções de chat agora gerenciadas pelo VisionChatClient

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950/10 to-purple-950/10 text-white overflow-hidden">
      {/* Partículas de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            animate={{
              x: [0, Math.random() * 100, 0],
              y: [0, Math.random() * 100, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Header com status do Vision Core */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                  AUTVISION
                </h1>
                <p className="text-sm text-gray-400">Vision Core {visionCore.version}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Status do Vision Core */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                visionCoreConnected ? 'bg-green-400' : 'bg-red-400'
              }`} />
              <span className="text-sm text-gray-300">
                {visionCoreConnected ? 'Online' : 'Offline'}
              </span>
            </div>
            
            {/* Controles de som */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-gray-400 hover:text-white"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            
            {/* Configurações */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Container principal - Responsivo */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Vision Principal - Flutuante e em Destaque */}
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          {/* Vision Avatar */}
          <motion.div
            className="relative mb-0 sm:mb-1 z-50 cursor-pointer"
            onClick={toggleVision}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              y: [-10, 10, -10],
              rotateY: [0, 5, 0, -5, 0],
              scale: isVisionActive ? [1, 1.05, 1] : [1, 1.02, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Glow effect quando ativo - mais intenso e maior */}
            {isVisionActive && (
              <div className="absolute inset-0 rounded-full blur-3xl bg-gradient-to-r from-blue-400/50 to-purple-400/50 scale-[1.8]" />
            )}
            
            {/* Vision Image - Responsivo e Maior */}
            <div className="relative">
              <img 
                src="/assets/images/vision/vision.PNG" 
                alt="Vision"
                className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] xl:w-[550px] xl:h-[550px] object-contain"
                style={{
                  background: 'transparent',
                  filter: `brightness(1.15) contrast(1.15) saturate(1.15) drop-shadow(0 0 40px rgba(59, 130, 246, 0.4))`,
                  // Aplica diferentes filtros baseado na expressão
                  ...(currentExpression === 'sorriso' && { filter: 'brightness(1.3) contrast(1.2) saturate(1.3) hue-rotate(10deg) drop-shadow(0 0 50px rgba(255, 215, 0, 0.5))' }),
                  ...(currentExpression === 'atento' && { filter: 'brightness(1.2) contrast(1.3) saturate(1.2) drop-shadow(0 0 45px rgba(0, 255, 255, 0.4))' }),
                  ...(currentExpression === 'pensativo' && { filter: 'brightness(1.1) contrast(1.1) saturate(1.0) drop-shadow(0 0 35px rgba(147, 51, 234, 0.4))' }),
                  ...(currentExpression === 'confiante' && { filter: 'brightness(1.25) contrast(1.25) saturate(1.25) drop-shadow(0 0 55px rgba(34, 197, 94, 0.5))' })
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              
              {/* Indicador de atividade - minimalista */}
              {isVisionActive && (
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full"
                  animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              
              {/* Indicador de escuta */}
              {isListening && (
                <motion.div
                  className="absolute -bottom-2 -left-2 w-6 h-6 bg-red-400 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  <Mic className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </div>
            
            {/* Partículas ao redor do Vision - Ajustadas para tamanho maior */}
            {isVisionActive && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400/60 rounded-full"
                    animate={{
                      x: [0, Math.cos(i * 45 * Math.PI / 180) * 180],
                      y: [0, Math.sin(i * 45 * Math.PI / 180) * 180],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeOut"
                    }}
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
          
          {/* Nome e Status do Vision - Cola no Vision */}
          <div className="text-center relative z-50 -mt-12 sm:-mt-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-1">
              {user.visionName}
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mb-1">Seu Assistente de Automação Inteligente</p>
            
            {/* Status badges - Responsivos */}
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 flex-wrap gap-2">
              <Badge variant={isVisionActive ? "default" : "secondary"} className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs sm:text-sm">
                {isVisionActive ? 'Ativo' : 'Inativo'}
              </Badge>
              <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs sm:text-sm">
                {visionCore.activeAgents} Agentes
              </Badge>
              <Badge variant="outline" className="border-green-500/30 text-green-300 text-xs sm:text-sm">
                {visionCore.efficiency}% Eficiência
              </Badge>
            </div>
          </div>
          
        </div>
        
        {/* Chat Interface - Componente VisionChatClient - Exclusivo para Clientes */}
        <div className="mb-4 sm:mb-6">
          <VisionChatClient 
            className="relative z-40"
            size="compact"
            showAvatar={false}
            autoSpeak={true}
          />
        </div>
        
        {/* Seção de Agentes - Flutuantes - Bem separados */}
        <div className="mb-4 sm:mb-6">
          <div className="text-center mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Agentes Disponíveis</h3>
            <p className="text-gray-400 text-xs sm:text-sm px-2">Clique nos agentes para ativá-los e trabalhar com o Vision</p>
          </div>
          
          {/* Agentes Flutuantes - Responsivos */}
          <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-6 flex-wrap gap-2">
            {availableAgents.map((agent) => {
              const isActive = activeAgents.find(a => a.id === agent.id);
              const isSelected = selectedAgent?.id === agent.id;
              
              return (
                <motion.div
                  key={agent.id}
                  className="relative cursor-pointer group"
                  onClick={() => {
                    selectAgent(agent);
                    toggleAgent(agent.id);
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    y: -10
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    y: isActive ? [-3, 3, -3] : 0,
                    rotate: isActive ? [-1, 1, -1] : 0
                  }}
                  transition={{
                    duration: isActive ? 3 : 0.3,
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  {/* Glow effect para agentes ativos */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full blur-lg bg-gradient-to-r from-green-400/30 to-blue-400/30 scale-150" />
                  )}
                  
                  {/* Avatar principal - Responsivo */}
                  <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 sm:border-4 transition-all duration-300 ${
                    isActive 
                      ? 'border-green-400/70 bg-gradient-to-br from-green-500/20 to-blue-500/20' 
                      : 'border-gray-500/30 bg-gradient-to-br from-gray-700/50 to-gray-600/50 hover:border-blue-400/50'
                  } overflow-hidden backdrop-blur-sm`}>
                    {/* Foto/Avatar do agente */}
                    {agent.image_url || agent.image ? (
                      <img 
                        src={agent.image_url || agent.image} 
                        alt={agent.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full rounded-full flex items-center justify-center text-lg sm:text-xl ${
                      isActive ? 'bg-green-400/20' : 'bg-gray-600/30'
                    } ${agent.image_url || agent.image ? 'hidden' : 'flex'}`}>
                      🤖
                    </div>
                    
                    {/* Indicador de ativo - Responsivo */}
                    {isActive && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-400 rounded-full border-2 border-gray-900 flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Zap className="w-2 h-2 sm:w-3 sm:h-3 text-gray-900" />
                      </motion.div>
                    )}
                    
                    {/* Indicador de selecionado - Responsivo */}
                    {isSelected && !isActive && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded-full border-2 border-gray-900" />
                    )}
                  </div>
                  
                  {/* Nome do agente - aparece no hover - Responsivo */}
                  <motion.div
                    className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-gray-900/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-lg border border-gray-600/30 max-w-32 sm:max-w-none">
                      <p className="text-white text-xs sm:text-sm font-medium truncate">{agent.name}</p>
                      <p className="text-gray-400 text-xs truncate hidden sm:block">{agent.description || agent.type || 'Agente IA'}</p>
                    </div>
                  </motion.div>
                  
                  {/* Partículas para agentes ativos */}
                  {isActive && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-green-400/60 rounded-full"
                          animate={{
                            x: [0, Math.cos(i * 90 * Math.PI / 180) * 60],
                            y: [0, Math.sin(i * 90 * Math.PI / 180) * 60],
                            opacity: [0, 1, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "easeOut"
                          }}
                          style={{
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          
          {/* Agentes Ativos */}
          {activeAgents.length > 0 && (
            <div className="bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-green-300 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Agentes Ativos ({activeAgents.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeAgents.map((agent) => (
                  <Badge 
                    key={agent.id} 
                    className="bg-green-500/20 text-green-300 border-green-500/30 flex items-center space-x-1"
                  >
                    <span>{agent.avatar}</span>
                    <span>{agent.name}</span>
                    <span className="text-xs">({agent.type})</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Detalhes do Agente Selecionado */}
          {selectedAgent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-500/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-blue-300 flex items-center">
                  <span className="mr-2">{selectedAgent.avatar}</span>
                  {selectedAgent.name}
                </h4>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {selectedAgent.type}
                </Badge>
              </div>
              <p className="text-gray-300 text-sm mb-3">{selectedAgent.description}</p>
              <div className="flex space-x-2">
                <Button
                  onClick={() => toggleAgent(selectedAgent)}
                  size="sm"
                  className={activeAgents.find(a => a.id === selectedAgent.id) 
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30'
                    : 'bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-500/30'
                  }
                >
                  {activeAgents.find(a => a.id === selectedAgent.id) ? 'Desativar' : 'Ativar'}
                </Button>
                <Button
                  onClick={() => setSelectedAgent(null)}
                  size="sm"
                  variant="outline"
                  className="border-gray-500/30 text-gray-300 hover:bg-gray-700/30"
                >
                  Fechar
                </Button>
              </div>
            </motion.div>
          )}
        </div>
        

        
        {/* Informações do Vision Core */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 border-gray-700/30 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white mb-1">Uptime</h4>
              <p className="text-2xl font-bold text-yellow-400">{visionCore.uptime}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 border-gray-700/30 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white mb-1">Tarefas</h4>
              <p className="text-2xl font-bold text-green-400">{visionCore.tasksCompleted}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 border-gray-700/30 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <User className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white mb-1">Agentes</h4>
              <p className="text-2xl font-bold text-blue-400">{visionCore.activeAgents}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Rodapé */}
        <footer className="mt-16 sm:mt-20 pt-8 border-t border-gray-700/30">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Vision Core Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Última sincronização: {new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>Sistema operacional</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <p>AutVision AI © 2024 - Plataforma de Automação Inteligente</p>
              <p className="mt-1">Versão 2.0 | Build {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, '0')}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}