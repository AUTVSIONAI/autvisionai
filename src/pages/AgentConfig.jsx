
import React, { useState, useEffect } from "react";
import { Agent, Integration } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ArrowLeft, 
  Settings, 
  Home as HomeIcon, 
  Mail, 
  MessageCircle, 
  Save,
  Plus,
  Trash2
} from "lucide-react";

export default function AgentConfig() {
  const [searchParams] = useSearchParams();
  const agentId = searchParams.get('id');
  const [agent, setAgent] = useState(null);
  const [integrations, setIntegrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [configurations, setConfigurations] = useState({});
  
  // New state for Home Assistant devices to manage them as a list of objects
  const [haDevices, setHaDevices] = useState([{id: 1, value: ''}]);

  useEffect(() => {
    loadAgentData();
  }, [agentId]);

  const loadAgentData = async () => {
    setIsLoading(true);
    try {
      const [agentsList, integrationsList] = await Promise.all([
        Agent.list(),
        Integration.list()
      ]);
      
      const foundAgent = agentsList.find(a => a.id === agentId);
      setAgent(foundAgent);
      setIntegrations(integrationsList);
      
      // Carregar configurações existentes
      if (foundAgent?.configurations) {
        setConfigurations(foundAgent.configurations);
        // If Home Assistant devices exist in configurations, populate haDevices state
        if(foundAgent.configurations.home_assistant?.devices){
          setHaDevices(foundAgent.configurations.home_assistant.devices.map((d,i)=>({id: i, value: d})))
        } else {
          // If no devices are configured, ensure there's at least one empty input for adding
          setHaDevices([{id: 1, value: ''}]);
        }
      } else {
        // If no configurations at all, ensure haDevices is initialized for adding
        setHaDevices([{id: 1, value: ''}]);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do agente:", error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let finalConfigs = {...configurations};
      
      // Process Home Assistant devices from haDevices state into the final configurations
      if(agent.type === 'home') {
        if (!finalConfigs.home_assistant) {
          finalConfigs.home_assistant = {}; // Ensure home_assistant object exists
        }
        finalConfigs.home_assistant.devices = haDevices.map(d => d.value).filter(Boolean); // Convert back to string array, filter out empty
      }

      await Agent.update(agentId, {
        ...agent, // Preserve other agent properties
        configurations: finalConfigs
      });
      // Redirect back to agents page or show success message
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
    setIsSaving(false);
  };

  const updateConfiguration = (category, key, value) => {
    setConfigurations(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}), // Ensure category object exists
        [key]: value
      }
    }));
  };
  
  // Specific handlers for Home Assistant devices
  const handleDeviceChange = (id, value) => {
    setHaDevices(prev => prev.map(device => device.id === id ? {...device, value} : device));
  };
  
  const addDevice = () => {
    setHaDevices(prev => [...prev, {id: Date.now(), value: ''}]);
  };

  const removeDevice = (id) => {
    setHaDevices(prev => prev.filter(device => device.id !== id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações do agente...</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Agente não encontrado.</p>
          <Link to={createPageUrl("Agents")}>
            <Button className="mt-4">Voltar para Agentes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const renderHomeAssistantConfig = () => (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HomeIcon className="w-5 h-5" />
          Configuração Home Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="ha-url">URL do Home Assistant</Label>
          <Input
            id="ha-url"
            value={configurations.home_assistant?.url || ''}
            onChange={(e) => updateConfiguration('home_assistant', 'url', e.target.value)}
            placeholder="http://192.168.1.100:8123"
          />
        </div>
        <div>
          <Label htmlFor="ha-token">Token de Acesso</Label>
          <Input
            id="ha-token"
            type="password"
            value={configurations.home_assistant?.token || ''}
            onChange={(e) => updateConfiguration('home_assistant', 'token', e.target.value)}
            placeholder="Long-lived access token"
          />
        </div>
        <div>
          <Label>Dispositivos para Controlar (Entity IDs)</Label>
          <div className="space-y-2">
            {haDevices.map(device => (
              <div key={device.id} className="flex items-center gap-2">
                <Input
                  value={device.value}
                  onChange={(e) => handleDeviceChange(device.id, e.target.value)}
                  placeholder="Ex: light.sala_de_estar"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeDevice(device.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addDevice}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Dispositivo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderGmailConfig = () => (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Configuração Gmail
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="gmail-email">Endereço de Email</Label>
          <Input
            id="gmail-email"
            value={configurations.gmail?.email || ''}
            onChange={(e) => updateConfiguration('gmail', 'email', e.target.value)}
            placeholder="seu.email@gmail.com"
          />
        </div>
        <div>
          <Label htmlFor="gmail-app-password">Senha do App</Label>
          <Input
            id="gmail-app-password"
            type="password"
            value={configurations.gmail?.app_password || ''}
            onChange={(e) => updateConfiguration('gmail', 'app_password', e.target.value)}
            placeholder="Senha específica do app"
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="auto-reply">Resposta Automática</Label>
            <p className="text-sm text-gray-500">Permitir que o Vision responda emails automaticamente</p>
          </div>
          <Switch
            id="auto-reply"
            checked={configurations.gmail?.auto_reply || false}
            onCheckedChange={(checked) => updateConfiguration('gmail', 'auto_reply', checked)}
          />
        </div>
        <div>
          <Label htmlFor="email-signature">Assinatura</Label>
          <Textarea
            id="email-signature"
            value={configurations.gmail?.signature || ''}
            onChange={(e) => updateConfiguration('gmail', 'signature', e.target.value)}
            placeholder="Atenciosamente,\nVision AI Assistant"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderWhatsAppConfig = () => (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Configuração WhatsApp
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="whatsapp-number">Número WhatsApp</Label>
          <Input
            id="whatsapp-number"
            value={configurations.whatsapp?.number || ''}
            onChange={(e) => updateConfiguration('whatsapp', 'number', e.target.value)}
            placeholder="+55 11 99999-9999"
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="auto-response">Resposta Automática</Label>
            <p className="text-sm text-gray-500">Responder mensagens automaticamente</p>
          </div>
          <Switch
            id="auto-response"
            checked={configurations.whatsapp?.auto_response || false}
            onCheckedChange={(checked) => updateConfiguration('whatsapp', 'auto_response', checked)}
          />
        </div>
        <div>
          <Label htmlFor="allowed-contacts">Contatos Permitidos</Label>
          <Textarea
            id="allowed-contacts"
            value={configurations.whatsapp?.allowed_contacts || ''}
            onChange={(e) => updateConfiguration('whatsapp', 'allowed_contacts', e.target.value)}
            placeholder="Lista de números permitidos, um por linha"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("Agents")}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configurar {agent.name}</h1>
              <p className="text-gray-600">Configure as integrações e comportamentos do agente</p>
            </div>
          </div>

          {/* Agent Info */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Informações do Agente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nome</p>
                  <p className="text-lg">{agent.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo</p>
                  <Badge variant="outline">{agent.type}</Badge>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Descrição</p>
                  <p className="text-gray-700">{agent.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Sections */}
          <div className="space-y-6">
            {agent.type === 'home' && renderHomeAssistantConfig()}
            {(agent.type === 'work' || agent.type === 'social') && renderGmailConfig()}
            {agent.type === 'social' && renderWhatsAppConfig()}
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 shadow-lg"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </div>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
