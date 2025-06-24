import React, { useState, useEffect } from "react";
import { Business } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import QRConnectBox from "../components/business/QRConnectBox";
import { 
  MessageSquare, 
  Send, 
  Crown, 
  CheckCircle, 
  AlertTriangle,
  Phone,
  Users,
  Clock,
  ArrowRight
} from "lucide-react";

export default function WhatsAppIntegration() {
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [testMessage, setTestMessage] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);

  useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    try {
      const businesses = await Business.list();
      const userBusiness = businesses[0];
      setBusiness(userBusiness);
      
      if (userBusiness?.whatsapp_config?.status) {
        setConnectionStatus(userBusiness.whatsapp_config.status);
      }
    } catch (error) {
      console.error("Erro ao carregar negócio:", error);
    }
    setIsLoading(false);
  };

  const handleConnect = async () => {
    setConnectionStatus("connecting");
    
    // Update business with connecting status
    if (business) {
      await Business.update(business.id, {
        whatsapp_config: {
          ...business.whatsapp_config,
          status: "connecting"
        }
      });
    }
    
    // Simulate connection process
    setTimeout(() => {
      setConnectionStatus("connected");
      if (business) {
        Business.update(business.id, {
          whatsapp_config: {
            ...business.whatsapp_config,
            status: "connected",
            last_connection: new Date().toISOString(),
            phone_number: "+55 11 99999-9999" // Mock number
          }
        });
      }
    }, 8000); // 8 seconds to simulate real connection time
  };

  const handleDisconnect = async () => {
    setConnectionStatus("disconnected");
    if (business) {
      await Business.update(business.id, {
        whatsapp_config: {
          ...business.whatsapp_config,
          status: "disconnected",
          phone_number: null
        }
      });
    }
  };

  const handleRefresh = () => {
    // Reset connection to generate new QR
    setConnectionStatus("connecting");
  };

  const handleSendTest = async () => {
    if (!testMessage.trim()) return;
    
    setIsSendingTest(true);
    
    // Simulate sending test message
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(`Mensagem de teste enviada: "${testMessage}"`);
    setTestMessage("");
    setIsSendingTest(false);
  };

  const isPremiumRequired = business?.plan_type === "free";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando integração...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-gradient-to-r from-green-600 to-emerald-500 p-4 rounded-full mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Integração WhatsApp
          </h1>
          <p className="text-gray-600 text-lg">
            Conecte seu número e ative o atendimento inteligente
          </p>
        </motion.div>

        {/* Premium Alert */}
        {isPremiumRequired && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Alert className="border-amber-200 bg-amber-50">
              <Crown className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Upgrade Necessário:</strong> A integração com WhatsApp está disponível apenas para planos Premium ou Empresarial.
                <Button variant="link" className="p-0 ml-2 text-amber-700 underline">
                  Fazer upgrade agora
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Connection Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <QRConnectBox
              status={isPremiumRequired ? "disconnected" : connectionStatus}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onRefresh={handleRefresh}
            />

            {/* Business Info */}
            {business && (
              <Card className="bg-white/80 backdrop-blur-md shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    Informações do Negócio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Nome:</span>
                    <span className="font-medium">{business.business_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Categoria:</span>
                    <span className="font-medium capitalize">{business.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Agente:</span>
                    <span className="font-medium">{business.agent_config?.agent_name || "Assistente"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Plano:</span>
                    <Badge variant={business.plan_type === "free" ? "secondary" : "default"}>
                      {business.plan_type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Features & Testing Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            
            {/* Connection Status */}
            <Card className="bg-white/80 backdrop-blur-md shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-600" />
                  Status da Integração
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        connectionStatus === "connected" ? "bg-green-500 animate-pulse" :
                        connectionStatus === "connecting" ? "bg-blue-500 animate-pulse" :
                        "bg-gray-400"
                      }`}></div>
                      <span className="font-medium">WhatsApp</span>
                    </div>
                    <Badge variant={
                      connectionStatus === "connected" ? "default" :
                      connectionStatus === "connecting" ? "secondary" : "outline"
                    }>
                      {connectionStatus === "connected" ? "Conectado" :
                       connectionStatus === "connecting" ? "Conectando" : "Desconectado"}
                    </Badge>
                  </div>

                  {connectionStatus === "connected" && business?.whatsapp_config?.phone_number && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800">Número Conectado</span>
                      </div>
                      <p className="text-sm text-green-700">
                        {business.whatsapp_config.phone_number}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Test Message */}
            {connectionStatus === "connected" && !isPremiumRequired && (
              <Card className="bg-white/80 backdrop-blur-md shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Send className="w-5 h-5 text-green-600" />
                    Teste de Mensagem
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enviar mensagem de teste:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={testMessage}
                        onChange={(e) => setTestMessage(e.target.value)}
                        placeholder="Digite uma mensagem para testar..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <Button
                        onClick={handleSendTest}
                        disabled={!testMessage.trim() || isSendingTest}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isSendingTest ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features List */}
            <Card className="bg-white/80 backdrop-blur-md shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Recursos Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { icon: MessageSquare, text: "Respostas automáticas inteligentes", enabled: true },
                    { icon: Clock, text: "Atendimento 24/7", enabled: true },
                    { icon: Users, text: "Múltiplas conversas simultâneas", enabled: !isPremiumRequired },
                    { icon: Phone, text: "Integração com catálogo de produtos", enabled: !isPremiumRequired },
                  ].map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className={`flex items-center gap-3 p-2 rounded-lg ${
                        feature.enabled ? "text-gray-900" : "text-gray-400"
                      }`}>
                        <Icon className={`w-4 h-4 ${feature.enabled ? "text-green-600" : "text-gray-400"}`} />
                        <span className="text-sm">{feature.text}</span>
                        {!feature.enabled && <Crown className="w-4 h-4 text-amber-500 ml-auto" />}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Next Steps */}
        {connectionStatus === "connected" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <Button
              onClick={() => navigate(createPageUrl("BusinessDashboard"))}
              size="lg"
              className="px-12 py-4 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-lg font-semibold"
            >
              Ir para Dashboard
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}