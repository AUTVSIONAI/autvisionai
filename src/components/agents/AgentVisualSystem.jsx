// SISTEMA VISUAL DE AGENTES - ÓRBITA DINÂMICA
import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Mic, 
  Shield, 
  Lightbulb, 
  Share2, 
  Car, 
  Home, 
  Heart, 
  Megaphone,
  Zap,
  Play,
  Pause
} from 'lucide-react';

// DADOS DOS AGENTES COM IMAGENS REAIS
export const agentsData = [
  {
    id: "agent_01",
    name: "Echo",
    function: "Comunicação por voz e escuta ativa",
    image: "/assets/images/agents/agent-echo.png",
    icon: Mic,
    color: "from-blue-500 to-cyan-500",
    specialty: "voice"
  },
  {
    id: "agent_02", 
    name: "Guardian",
    function: "Segurança e vigilância do sistema",
    image: "/assets/images/agents/agent-guardian.png",
    icon: Shield,
    color: "from-red-500 to-orange-500",
    specialty: "security"
  },
  {
    id: "agent_03",
    name: "Nova", 
    function: "Criatividade, sugestões e ideias visuais",
    image: "/assets/images/agents/agent-nova.png",
    icon: Lightbulb,
    color: "from-purple-500 to-pink-500",
    specialty: "creative"
  },
  {
    id: "agent_04",
    name: "Social",
    function: "Gestão de redes sociais, postagens e relatórios", 
    image: "/assets/images/agents/agent-nova.png", // Reutilizando Nova
    icon: Share2,
    color: "from-green-500 to-emerald-500",
    specialty: "social"
  },
  {
    id: "agent_05",
    name: "Auto",
    function: "Assistente veicular com comandos e status do carro",
    image: "/assets/images/agents/agent-nova.png", // Reutilizando Nova 
    icon: Car,
    color: "from-yellow-500 to-orange-500",
    specialty: "automotive"
  },
  {
    id: "agent_06",
    name: "Ada",
    function: "Casa inteligente, controle IoT e automações residenciais",
    image: "/assets/images/agents/agent-nova.png", // Reutilizando Nova
    icon: Home,
    color: "from-indigo-500 to-blue-500", 
    specialty: "home"
  },
  {
    id: "agent_07",
    name: "Friend",
    function: "Companhia emocional, acolhimento e apoio humano",
    image: "/assets/images/agents/agent-echo.png", // Reutilizando Echo
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    specialty: "emotional"
  },
  {
    id: "agent_08", 
    name: "Ads",
    function: "Marketing, campanhas de mídia e publicidade estratégica",
    image: "/assets/images/agents/agent-guardian.png", // Reutilizando Guardian
    icon: Megaphone,
    color: "from-violet-500 to-purple-500",
    specialty: "marketing"
  }
];

export default function AgentVisualSystem({ 
  activeAgents = [], 
  onAgentSelect,
  compact = false 
}) {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isOrbitActive, setIsOrbitActive] = useState(true);
  const [hoveredAgent, setHoveredAgent] = useState(null);

  const handleAgentClick = (agent) => {
    setSelectedAgent(agent);
    if (onAgentSelect) {
      onAgentSelect(agent);
    }
  };

  const isAgentActive = (agentId) => {
    return activeAgents.includes(agentId);
  };

  if (compact) {
    // MODO COMPACTO PARA SIDEBAR OU ESPAÇOS PEQUENOS
    return (
      <div className="grid grid-cols-4 gap-2">
        {agentsData.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAgentClick(agent)}
              className={`w-full h-16 p-1 rounded-xl border transition-all duration-300 ${
                isAgentActive(agent.id) 
                  ? 'border-blue-400 bg-blue-500/10 shadow-lg' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <img 
                  src={agent.image} 
                  alt={agent.name}
                  className="w-8 h-8 object-cover rounded-full"
                />
                <span className="text-xs font-medium truncate w-full">{agent.name}</span>
              </div>
              {isAgentActive(agent.id) && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              )}
            </Button>
          </motion.div>
        ))}
      </div>
    );
  }

  // MODO COMPLETO - ÓRBITA DINÂMICA
  return (
    <div className="relative w-full">
      {/* CONTROLES DA ÓRBITA */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Agentes Especializados</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOrbitActive(!isOrbitActive)}
            className="gap-2"
          >
            {isOrbitActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isOrbitActive ? 'Pausar' : 'Ativar'} Órbita
          </Button>
          <Badge variant="outline" className="gap-1">
            <Zap className="w-3 h-3" />
            {activeAgents.length} ativos
          </Badge>
        </div>
      </div>

      {/* SISTEMA DE ÓRBITA */}
      <div className="relative w-full h-96 flex items-center justify-center">
        {/* CENTRO - VISION COMPANION PLACEHOLDER */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-white font-bold text-lg">VISION</span>
          </div>
        </div>

        {/* AGENTES EM ÓRBITA */}
        {agentsData.map((agent, index) => {
          const angle = (index * 360) / agentsData.length;
          const radius = 120;
          const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
          const y = Math.sin((angle - 90) * Math.PI / 180) * radius;

          return (
            <motion.div
              key={agent.id}
              className="absolute"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)'
              }}
              animate={isOrbitActive ? {
                rotate: 360
              } : {}}
              transition={isOrbitActive ? {
                duration: 20 + index * 2,
                repeat: Infinity,
                ease: "linear"
              } : {}}
              onHoverStart={() => setHoveredAgent(agent.id)}
              onHoverEnd={() => setHoveredAgent(null)}
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="relative cursor-pointer"
                onClick={() => handleAgentClick(agent)}
              >
                {/* AGENTE VISUAL */}
                <div className={`relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                  isAgentActive(agent.id) 
                    ? 'border-green-400 shadow-lg shadow-green-400/30' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}>
                  <img 
                    src={agent.image} 
                    alt={agent.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* INDICADOR DE STATUS */}
                  {isAgentActive(agent.id) && (
                    <div className="absolute inset-0 bg-green-400/20 flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>

                {/* TOOLTIP INFORMATIVO */}
                <AnimatePresence>
                  {hoveredAgent === agent.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-10"
                    >
                      <Card className="w-48 shadow-lg border-gray-200">
                        <CardContent className="p-3">
                          <div className="text-center">
                            <h4 className="font-semibold text-sm text-gray-900 mb-1">{agent.name}</h4>
                            <p className="text-xs text-gray-600">{agent.function}</p>
                            <Badge 
                              className={`mt-2 bg-gradient-to-r ${agent.color} text-white border-0`}
                              size="sm"
                            >
                              {agent.specialty}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* LISTA DE AGENTES PARA MOBILE */}
      <div className="block md:hidden mt-8">
        <div className="grid grid-cols-2 gap-4">
          {agentsData.map((agent) => (
            <motion.div
              key={agent.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAgentClick(agent)}
            >
              <Card className={`cursor-pointer transition-all duration-300 ${
                isAgentActive(agent.id) 
                  ? 'border-green-400 bg-green-50 shadow-lg' 
                  : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={agent.image} 
                        alt={agent.name}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                      {isAgentActive(agent.id) && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">{agent.name}</h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{agent.function}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL DE DETALHES DO AGENTE SELECIONADO */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAgent(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="text-center">
                  <img 
                    src={selectedAgent.image} 
                    alt={selectedAgent.name}
                    className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-4 border-blue-200"
                  />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedAgent.name}</h2>
                  <p className="text-gray-600 mb-4">{selectedAgent.function}</p>
                  
                  <Badge 
                    className={`bg-gradient-to-r ${selectedAgent.color} text-white border-0 px-4 py-1 mb-6`}
                  >
                    <selectedAgent.icon className="w-4 h-4 mr-2" />
                    {selectedAgent.specialty}
                  </Badge>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setSelectedAgent(null)}
                      variant="outline" 
                      className="flex-1"
                    >
                      Fechar
                    </Button>
                    <Button 
                      onClick={() => {
                        // Ativar/configurar agente
                        setSelectedAgent(null);
                      }}
                      className={`flex-1 bg-gradient-to-r ${selectedAgent.color} text-white border-0 hover:opacity-90`}
                    >
                      {isAgentActive(selectedAgent.id) ? 'Configurar' : 'Ativar'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

AgentVisualSystem.propTypes = {
  activeAgents: PropTypes.array,
  onAgentSelect: PropTypes.func,
  compact: PropTypes.bool
};