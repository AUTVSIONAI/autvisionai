import React, { useState, useEffect } from "react";
import { Business } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Bot, 
  Upload, 
  Palette, 
  MessageCircle,
  Save,
  ArrowRight,
  Sparkles,
  User,
  Smile,
  Briefcase,
  Coffee
} from "lucide-react";

const agentStyles = [
  { 
    value: "friendly", 
    label: "Amigável", 
    icon: Smile,
    description: "Casual, acolhedor e próximo dos clientes",
    example: "Oi! 😊 Como posso te ajudar hoje?"
  },
  { 
    value: "professional", 
    label: "Profissional", 
    icon: Briefcase,
    description: "Formal, educado e direto ao ponto",
    example: "Olá! Em que posso auxiliá-lo?"
  },
  { 
    value: "casual", 
    label: "Descontraído", 
    icon: Coffee,
    description: "Relaxado, divertido e informal",
    example: "E aí! Tudo bem? O que você precisa?"
  },
  { 
    value: "formal", 
    label: "Executivo", 
    icon: User,
    description: "Muito formal e corporativo",
    example: "Bom dia. Como posso ser útil?"
  }
];

export default function BusinessAgentConfig() {
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [agentConfig, setAgentConfig] = useState({
    agent_name: "Assistente",
    agent_style: "friendly",
    custom_instructions: "",
    avatar_url: ""
  });

  useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    try {
      const businesses = await Business.list();
      const userBusiness = businesses[0]; // Assume o primeiro negócio do usuário
      setBusiness(userBusiness);
      
      if (userBusiness?.agent_config) {
        setAgentConfig(prev => ({
          ...prev,
          ...userBusiness.agent_config
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar negócio:", error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!business) return;
    
    setIsSaving(true);
    try {
      await Business.update(business.id, {
        agent_config: {
          ...business.agent_config,
          ...agentConfig
        }
      });
      
      // Redirect to WhatsApp integration
      navigate(createPageUrl("WhatsAppIntegration"));
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
    setIsSaving(false);
  };

  const handleInputChange = (field, value) => {
    setAgentConfig(prev => ({ ...prev, [field]: value }));
  };

  const selectedStyle = agentStyles.find(style => style.value === agentConfig.agent_style);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 p-4 rounded-full mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Configure seu Agente IA
          </h1>
          <p className="text-gray-600 text-lg">
            Personalize como seu assistente virtual vai atender seus clientes
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Configuration Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Basic Info */}
            <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-600" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="agent_name">Nome do Agente</Label>
                  <Input
                    id="agent_name"
                    value={agentConfig.agent_name}
                    onChange={(e) => handleInputChange('agent_name', e.target.value)}
                    placeholder="Ex: Ana, Carlos, Assistente..."
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="avatar_upload">Foto do Agente (Opcional)</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Clique para fazer upload ou arraste uma imagem
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG até 2MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Style Selection */}
            <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-purple-600" />
                  Estilo de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {agentStyles.map((style) => {
                    const IconComponent = style.icon;
                    return (
                      <div
                        key={style.value}
                        onClick={() => handleInputChange('agent_style', style.value)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                          agentConfig.agent_style === style.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <IconComponent className={`w-5 h-5 mt-1 ${
                            agentConfig.agent_style === style.value ? 'text-purple-600' : 'text-gray-500'
                          }`} />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{style.label}</h3>
                            <p className="text-sm text-gray-600 mb-2">{style.description}</p>
                            <p className="text-xs text-gray-500 italic">"{style.example}"</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Custom Instructions */}
            <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  Instruções Personalizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="custom_instructions">
                  Como seu agente deve responder seus clientes?
                </Label>
                <Textarea
                  id="custom_instructions"
                  value={agentConfig.custom_instructions}
                  onChange={(e) => handleInputChange('custom_instructions', e.target.value)}
                  placeholder="Ex: Sempre pergunte se o cliente quer conhecer nossas promoções do dia. Seja educado e ofereça ajuda com cardápio e horários de funcionamento..."
                  className="mt-2 h-32"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Dicas específicas sobre como o agente deve se comportar com seus clientes
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Agent Preview */}
            <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0 sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Preview do Agente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Agent Avatar & Name */}
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {agentConfig.agent_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{agentConfig.agent_name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{selectedStyle?.label}</p>
                    </div>
                  </div>

                  {/* Sample Conversation */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <h4 className="font-medium text-gray-700 text-sm">Conversa de Exemplo:</h4>
                    
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-2xl rounded-br-md max-w-xs">
                        <p className="text-sm">Oi, vocês estão abertos?</p>
                      </div>
                    </div>

                    {/* Agent Response */}
                    <div className="flex justify-start">
                      <div className="bg-white p-3 rounded-2xl rounded-bl-md max-w-xs shadow-sm border">
                        <p className="text-sm">
                          {selectedStyle?.example} Sim, estamos funcionando normalmente! 
                          {business?.business_name && ` Aqui é ${business.business_name}.`}
                          {agentConfig.custom_instructions && " Posso te ajudar com alguma coisa específica?"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Business Info Preview */}
                  {business && (
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h4 className="font-medium text-blue-900 mb-2">Informações do Negócio:</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p><strong>Nome:</strong> {business.business_name}</p>
                        <p><strong>Categoria:</strong> {business.category}</p>
                        {business.description && (
                          <p><strong>Sobre:</strong> {business.description}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-lg font-semibold"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                Salvando...
              </>
            ) : (
              <>
                Salvar e Continuar
                <ArrowRight className="w-5 h-5 ml-3" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}