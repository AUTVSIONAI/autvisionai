import { useState, useEffect } from "react";
import { Agent } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Zap, 
  Search, 
  Settings,
  Crown,
  Mic,
  Shield,
  Lightbulb,
  Share2
} from "lucide-react";

// DADOS PADRÃO PARA FALLBACK (caso backend não responda)
const fallbackAgentsData = [
  {
    id: "agent_echo",
    name: "Echo",
    function: "Comunicação por voz e escuta ativa",
    image: "/assets/images/agents/agent-echo.png",
    type: "communication",
    description: "Especialista em processamento de voz, comandos por áudio e comunicação interativa.",
    fallbackIcon: Mic,
    status: 'active'
  },
  {
    id: "agent_guardian", 
    name: "Guardian",
    function: "Segurança e vigilância do sistema",
    image: "/assets/images/agents/agent-guardian.png",
    type: "security",
    description: "Monitora segurança, detecta ameaças e protege seus dados e automações.",
    fallbackIcon: Shield,
    status: 'active'
  },
  {
    id: "agent_nova",
    name: "Nova",
    function: "Análise e insights de dados",
    image: "/assets/images/agents/agent-nova.png",
    type: "analytics",
    description: "Processamento avançado de dados, análises preditivas e geração de insights.",
    fallbackIcon: Lightbulb,
    status: 'active'
  },
  {
    id: "agent_vision",
    name: "Vision",
    function: "Processamento de imagem e visão computacional",
    image: "/assets/images/agents/agent-vision.png",
    type: "vision",
    description: "Especialista em análise de imagens, reconhecimento visual e visão computacional.",
    fallbackIcon: Crown,
    status: 'active'
  },
  {
    id: "agent_social",
    name: "Social",
    function: "Gestão de redes sociais e engajamento",
    image: "/assets/images/agents/agent-Social.jpeg",
    type: "social",
    description: "Gerencia presença online, cria conteúdo e monitora engajamento em redes sociais.",
    fallbackIcon: Share2,
    status: 'active'
  },
  {
    id: "agent_ada",
    name: "ADA",
    function: "Assistente de desenvolvimento e automação", 
    image: "/assets/images/agents/agent-ADA.jpeg",
    type: "development",
    description: "Auxilia no desenvolvimento, automação de tarefas e otimização de processos.",
    fallbackIcon: Settings,
    status: 'active'
  }
];

const planColors = {
  free: "bg-green-100 text-green-800",
  premium: "bg-blue-100 text-blue-800",
  enterprise: "bg-slate-100 text-slate-800"
};

const typeColors = {
  communication: "from-blue-500 to-cyan-500",
  security: "from-red-500 to-orange-500", 
  analytics: "from-purple-500 to-pink-500",
  vision: "from-indigo-500 to-blue-500",
  social: "from-green-500 to-emerald-500",
  development: "from-yellow-500 to-orange-500",
  creative: "from-purple-500 to-pink-500",
  automotive: "from-yellow-500 to-orange-500",
  home: "from-indigo-500 to-blue-500",
  emotional: "from-pink-500 to-rose-500",
  marketing: "from-violet-500 to-purple-500"
};

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setIsLoading(true);
    try {
      // 🔗 CONECTANDO AO BACKEND REAL - /config/agents
      const backendAgents = await Agent.getAll();
      
      // Combina dados do backend com dados visuais locais (fallback)
      const agentsWithVisuals = backendAgents.map(backendAgent => {
        const fallbackAgent = fallbackAgentsData.find(f => f.name === backendAgent.name);
        return {
          ...backendAgent,
          // Mantém dados visuais do fallback se não existir no backend
          function: backendAgent.config?.function || fallbackAgent?.function || backendAgent.name,
          description: backendAgent.config?.description || fallbackAgent?.description || `Agente ${backendAgent.name}`,
          type: backendAgent.type || fallbackAgent?.type || 'general',
          fallbackIcon: fallbackAgent?.fallbackIcon || Zap,
          is_active: backendAgent.status === 'active',
          plan_required: backendAgent.config?.plan_required || 'free'
        };
      });
      
      // Se backend retornou agentes, usa eles; senão usa fallback
      if (agentsWithVisuals.length > 0) {
        setAgents(agentsWithVisuals);
      } else {
        // Fallback: usa dados locais se backend estiver vazio
        setAgents(fallbackAgentsData.map(agent => ({
          ...agent,
          is_active: true,
          plan_required: 'free'
        })));
      }
    } catch (error) {
      console.error("Erro ao carregar agentes do backend:", error);
      // Fallback: usa dados locais em caso de erro
      setAgents(fallbackAgentsData.map(agent => ({
        ...agent,
        is_active: true,
        plan_required: 'free'
      })));
    }
    setIsLoading(false);
  };

  const handleToggleAgent = async (agent) => {
    try {
      // 🔗 CONECTANDO AO BACKEND REAL - toggle agent status
      const newStatus = agent.is_active ? 'inactive' : 'active';
      
      // Atualiza no backend
      await Agent.update(agent.id, { 
        status: newStatus,
        config: {
          ...agent.config,
          last_toggled: new Date().toISOString()
        }
      });
      
      // Atualiza estado local
      setAgents(prev => prev.map(a => 
        a.id === agent.id ? { ...a, is_active: !a.is_active } : a
      ));
      
      console.log(`✅ Agente ${agent.name} ${newStatus === 'active' ? 'ativado' : 'desativado'}`);
    } catch (error) {
      console.error(`Erro ao alternar agente ${agent.name}:`, error);
      // Se falhar no backend, mantém toggle local apenas
      setAgents(prev => prev.map(a => 
        a.id === agent.id ? { ...a, is_active: !a.is_active } : a
      ));
    }
  };

  const handleImageError = (agentId, error) => {
    console.error(`Erro ao carregar imagem do agente ${agentId}:`, error);
    setImageErrors(prev => ({ ...prev, [agentId]: true }));
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (isLoading) {
    return <div className="p-8">Carregando agentes...</div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white"> {/* << FUNDO BRANCO LIMPO >> */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Agentes Especializados</h1>
                <p className="text-gray-600">Conheça sua equipe de IA especializada em diferentes áreas.</p>
              </div>
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar agentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-72 bg-white border-gray-300" 
              />
            </div>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`relative overflow-hidden transition-all duration-300 h-full flex flex-col bg-white border-gray-200 ${
                  agent.is_active 
                    ? 'shadow-lg hover:shadow-xl' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  {agent.plan_required !== 'free' && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className={`${planColors[agent.plan_required]} border-0`}>
                        {agent.plan_required === 'enterprise' && <Crown className="w-3 h-3 mr-1" />}
                        {agent.plan_required}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      {/* IMAGEM REAL DO AGENTE SEM FUNDO - FLUTUANDO */}
                      <div className={`w-16 h-16 rounded-xl p-1 shadow-lg border-2 border-transparent hover:shadow-xl transition-all duration-300`}>
                        {!imageErrors[agent.id] ? (
                          <img
                            src={agent.image}
                            alt={agent.name}
                            className="w-full h-full object-contain rounded-lg hover:scale-105 transition-transform duration-300"
                            onError={(e) => handleImageError(agent.id, e)}
                            onLoad={() => console.log(`✅ Imagem carregada: ${agent.name}`)}
                          />
                        ) : (
                          <div className="w-full h-full rounded-lg flex items-center justify-center">
                            <agent.fallbackIcon className="w-8 h-8 text-gray-400 hover:text-gray-600 transition-colors duration-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-gray-900">
                          {agent.name}
                        </CardTitle>
                        <p className="text-sm text-gray-500 font-medium">
                          {agent.function}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-grow flex flex-col justify-between pt-0">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {agent.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge className={`bg-gradient-to-r ${typeColors[agent.type]} text-white border-0 text-xs`}>
                          {agent.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {agent.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  
                  <div className="p-4 bg-gray-50/50 border-t mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{agent.is_active ? 'Ativo' : 'Inativo'}</span>
                      <Switch
                        checked={agent.is_active}
                        onCheckedChange={() => handleToggleAgent(agent)}
                        className="data-[state=checked]:bg-blue-500"
                      />
                    </div>
                    <Link to={createPageUrl("AgentConfig") + `?id=${agent.id}`}>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
