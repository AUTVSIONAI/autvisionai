
import { useState, useEffect } from "react";
import { Integration } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  PlusCircle,
  Mail,
  Calendar,
  MessageCircle,
  Instagram,
  Music,
  Home as HomeIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const integrationIcons = {
  google: Mail,
  microsoft: Calendar,
  whatsapp: MessageCircle,
  instagram: Instagram,
  spotify: Music,
  home_assistant: HomeIcon,
  custom: Link
};

const statusConfig = {
  connected: { text: "Conectado", color: "bg-green-900/50 text-green-300 border-green-500/30", icon: CheckCircle, iconColor: "text-green-400" },
  disconnected: { text: "Desconectado", color: "bg-gray-800/50 text-gray-300 border-gray-600", icon: X, iconColor: "text-gray-400" },
  pending: { text: "Pendente", color: "bg-yellow-900/50 text-yellow-300 border-yellow-500/30", icon: Clock, iconColor: "text-yellow-400" },
  error: { text: "Erro", color: "bg-red-900/50 text-red-300 border-red-500/30", icon: AlertCircle, iconColor: "text-red-400" }
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: 'custom',
    description: ''
  });

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setIsLoading(true);
    try {
      const integrationList = await Integration.list();
      setIntegrations(integrationList);
    } catch (error) {
      console.error("Erro ao carregar integrações:", error);
    }
    setIsLoading(false);
  };

  const handleAddIntegration = async () => {
    try {
      await Integration.create({
        ...newIntegration,
        status: 'disconnected',
        created_at: new Date().toISOString()
      });
      setShowAddForm(false);
      setNewIntegration({ name: '', type: 'custom', description: '' });
      await loadIntegrations();
    } catch (error) {
      console.error("Erro ao adicionar integração:", error);
    }
  };

  const handleConnect = async (integration) => {
    await Integration.update(integration.id, {
      status: 'connected',
      connected_at: new Date().toISOString()
    });
    await loadIntegrations();
  };

  const handleDisconnect = async (integration) => {
    await Integration.update(integration.id, {
      status: 'disconnected',
      connected_at: null
    });
    await loadIntegrations();
  };

  if (isLoading) {
    return <div className="p-8">Carregando integrações...</div>;
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
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Link className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Integrações</h1>
                <p className="text-gray-300">Conecte seus apps e serviços para turbinar o Vision.</p>
              </div>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-green-500 to-cyan-500 hover:opacity-90"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Adicionar Integração
            </Button>
          </div>

          {/* Add Integration Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-gray-800 border-gray-700 shadow-lg">
                  <CardHeader>
                    <CardTitle>Nova Integração</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome da Integração</Label>
                      <Input
                        id="name"
                        value={newIntegration.name}
                        onChange={(e) => setNewIntegration({...newIntegration, name: e.target.value})}
                        placeholder="Ex: Meu Home Assistant"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Tipo</Label>
                      <Select
                        value={newIntegration.type}
                        onValueChange={(value) => setNewIntegration({...newIntegration, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google">Google</SelectItem>
                          <SelectItem value="microsoft">Microsoft</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="spotify">Spotify</SelectItem>
                          <SelectItem value="home_assistant">Home Assistant</SelectItem>
                          <SelectItem value="custom">Personalizada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Input
                        id="description"
                        value={newIntegration.description}
                        onChange={(e) => setNewIntegration({...newIntegration, description: e.target.value})}
                        placeholder="Descreva o que esta integração faz"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleAddIntegration} className="bg-green-600 hover:bg-green-700">
                        Adicionar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {integrations.map((integration, index) => {
              const IconComponent = integrationIcons[integration.type] || Link;
              const status = statusConfig[integration.status];
              return (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`overflow-hidden transition-all duration-300 h-full flex flex-col ${
                    integration.status === 'connected'
                      ? 'bg-gray-800 border-green-500 shadow-lg'
                      : 'bg-gray-900 border-gray-700'
                  }`}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          integration.status === 'connected'
                            ? 'bg-gradient-to-r from-green-500 to-cyan-500 text-white'
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-white">
                            {integration.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <status.icon className={`w-4 h-4 ${status.iconColor}`} />
                            <span className="text-sm font-medium">{status.text}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-300 text-sm mb-4">
                        {integration.description}
                      </p>
                    </CardContent>
                    <div className="p-4 bg-gray-800/50 border-t border-gray-600 mt-4">
                      {integration.status === 'connected' ? (
                        <Button variant="destructive" className="w-full" onClick={() => handleDisconnect(integration)}>
                          Desconectar
                        </Button>
                      ) : (
                        <Button variant="default" className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleConnect(integration)}>
                          Conectar
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
