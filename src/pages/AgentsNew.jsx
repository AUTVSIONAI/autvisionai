import { useState, useMemo } from "react";
import { useSync } from "@/contexts/SyncContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
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
    is_active: true,
    plan_required: "free"
  },
  {
    id: "agent_legion",
    name: "Legion",
    function: "Coordenação e gerenciamento de múltiplos agentes",
    image: "/assets/images/agents/agent-legion.png",
    type: "coordination",
    description: "Orquestra e coordena múltiplos agentes para execução de tarefas complexas.",
    fallbackIcon: Crown,
    is_active: true,
    plan_required: "pro"
  },
  {
    id: "agent_cipher",
    name: "Cipher",
    function: "Segurança e criptografia de dados",
    image: "/assets/images/agents/agent-cipher.png",
    type: "security",
    description: "Protege dados sensíveis e garante a segurança das operações.",
    fallbackIcon: Shield,
    is_active: true,
    plan_required: "enterprise"
  },
  {
    id: "agent_nova",
    name: "Nova",
    function: "Criatividade e inovação",
    image: "/assets/images/agents/agent-nova.png",
    type: "creative",
    description: "Gera ideias criativas e soluções inovadoras para problemas complexos.",
    fallbackIcon: Lightbulb,
    is_active: true,
    plan_required: "pro"
  },
  {
    id: "agent_nexus",
    name: "Nexus",
    function: "Integração e conectividade",
    image: "/assets/images/agents/agent-nexus.png",
    type: "integration",
    description: "Conecta diferentes sistemas e plataformas de forma inteligente.",
    fallbackIcon: Share2,
    is_active: true,
    plan_required: "free"
  }
];

// CORES POR TIPO DE AGENTE
const typeColors = {
  communication: "from-blue-500 to-cyan-500",
  coordination: "from-purple-500 to-pink-500",
  security: "from-red-500 to-orange-500",
  creative: "from-green-500 to-teal-500",
  integration: "from-indigo-500 to-blue-500",
  general: "from-gray-500 to-gray-600"
};

export default function AgentsPage() {
  const { globalData, isLoading: syncLoading, syncUpdate } = useSync();
  const [searchTerm, setSearchTerm] = useState('');
  const [imageErrors, setImageErrors] = useState({});

  // Usar dados do sync global com fallback
  const agents = useMemo(() => {
    const backendAgents = globalData.agents || [];
    
    if (backendAgents.length > 0) {
      // Combina dados do backend com dados visuais locais (fallback)
      return backendAgents.map(backendAgent => {
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
    } else {
      // Fallback: usa dados locais se backend estiver vazio
      return fallbackAgentsData;
    }
  }, [globalData.agents]);

  const handleToggleAgent = async (agent) => {
    try {
      // 🔗 SYNC COM BACKEND - toggle agent status
      const newStatus = agent.is_active ? 'inactive' : 'active';
      
      // Atualiza via sync
      await syncUpdate('Agent', agent.id, { 
        status: newStatus,
        config: {
          ...agent.config,
          last_toggled: new Date().toISOString()
        }
      });
      
      console.log(`✅ Agente ${agent.name} ${newStatus === 'active' ? 'ativado' : 'desativado'}`);
    } catch (error) {
      console.error(`Erro ao alternar agente ${agent.name}:`, error);
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
  
  if (syncLoading) {
    return <div className="p-8 text-gray-400">Carregando agentes...</div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-950">
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
                <h1 className="text-3xl font-bold text-white">Agentes Especializados</h1>
                <p className="text-gray-300">Conheça sua equipe de IA especializada em diferentes áreas.</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar agentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent, index) => {
              const IconComponent = agent.fallbackIcon || Zap;
              const typeColor = typeColors[agent.type] || typeColors.general;
              
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`h-full bg-gray-800 border-gray-700 overflow-hidden ${
                    agent.is_active ? 'ring-2 ring-blue-500/30' : ''
                  }`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-r ${typeColor} rounded-lg flex items-center justify-center`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-white">
                              {agent.name}
                            </CardTitle>
                            <p className="text-sm text-gray-400">{agent.function}</p>
                          </div>
                        </div>
                        <Switch
                          checked={agent.is_active}
                          onCheckedChange={() => handleToggleAgent(agent)}
                          className="data-[state=checked]:bg-blue-500"
                        />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Agent Image */}
                      {agent.image && !imageErrors[agent.id] && (
                        <div className="relative h-32 bg-gray-900 rounded-lg overflow-hidden">
                          <img
                            src={agent.image}
                            alt={agent.name}
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageError(agent.id, e)}
                          />
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {agent.description}
                      </p>

                      {/* Status and Plan */}
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={agent.is_active ? "default" : "secondary"}
                          className={agent.is_active ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                        >
                          {agent.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                        
                        <Badge
                          variant="outline"
                          className={
                            agent.plan_required === 'free' ? "text-green-400 border-green-500/30" :
                            agent.plan_required === 'pro' ? "text-blue-400 border-blue-500/30" :
                            "text-purple-400 border-purple-500/30"
                          }
                        >
                          {agent.plan_required === 'free' ? 'Gratuito' :
                           agent.plan_required === 'pro' ? 'Pro' : 'Enterprise'}
                        </Badge>
                      </div>

                      {/* Config Button */}
                      <Button
                        variant="outline"
                        className="w-full bg-gray-700/50 hover:bg-gray-700 border-gray-600"
                        disabled={!agent.is_active}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredAgents.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Nenhum agente encontrado
              </h3>
              <p className="text-gray-400">
                Tente ajustar os filtros de busca ou explore outros agentes disponíveis.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
