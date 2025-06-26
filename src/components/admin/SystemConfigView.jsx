import { useEffect, useState } from "react";
import { useSync } from "@/contexts/SyncContext";
import { SystemConfig } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2, Shield, Server, Mail, Database, Activity, Settings as SettingsIcon, Zap } from "lucide-react";
import { motion } from "framer-motion";

const CONFIG_CATEGORIES = {
  system: {
    icon: Server,
    title: "Sistema",
    description: "Configurações gerais do sistema",
    configs: [
      { key: "app_name", label: "Nome da Aplicação", type: "string", default: "AutVision" },
      { key: "app_url", label: "URL da Aplicação", type: "string", default: "https://autvision.com" },
      { key: "maintenance_mode", label: "Modo Manutenção", type: "boolean", default: "false" },
      { key: "max_users", label: "Máximo de Usuários", type: "number", default: "10000" },
      { key: "session_timeout", label: "Timeout de Sessão (min)", type: "number", default: "60" },
      { key: "file_upload_max_size", label: "Tamanho Máximo Upload (MB)", type: "number", default: "50" }
    ]
  },
  email: {
    icon: Mail,
    title: "Email",
    description: "Configurações de envio de email",
    configs: [
      { key: "smtp_host", label: "Servidor SMTP", type: "string", default: "smtp.gmail.com" },
      { key: "smtp_port", label: "Porta SMTP", type: "number", default: "587" },
      { key: "smtp_username", label: "Usuário SMTP", type: "string", default: "" },
      { key: "smtp_password", label: "Senha SMTP", type: "password", default: "", sensitive: true },
      { key: "smtp_encryption", label: "Criptografia", type: "select", options: ["none", "tls", "ssl"], default: "tls" },
      { key: "from_email", label: "Email Remetente", type: "string", default: "noreply@autvision.com" },
      { key: "from_name", label: "Nome Remetente", type: "string", default: "AutVision" }
    ]
  },
  security: {
    icon: Shield,
    title: "Segurança",
    description: "Configurações de segurança e autenticação",
    configs: [
      { key: "password_min_length", label: "Tamanho Mínimo Senha", type: "number", default: "8" },
      { key: "password_require_special", label: "Requer Caracteres Especiais", type: "boolean", default: "true" },
      { key: "two_factor_enabled", label: "2FA Habilitado", type: "boolean", default: "false" },
      { key: "max_login_attempts", label: "Máx. Tentativas Login", type: "number", default: "5" },
      { key: "lockout_duration", label: "Duração Bloqueio (min)", type: "number", default: "15" },
      { key: "api_rate_limit", label: "Limite Rate API (req/min)", type: "number", default: "1000" }
    ]
  },
  api: {
    icon: Zap,
    title: "API",
    description: "Configurações de API e integrações",
    configs: [
      { key: "n8n_base_url", label: "URL Base N8N", type: "string", default: "http://localhost:5678" },
      { key: "n8n_api_key", label: "Chave API N8N", type: "password", default: "", sensitive: true },
      { key: "openai_api_key", label: "Chave API OpenAI", type: "password", default: "", sensitive: true },
      { key: "google_api_key", label: "Chave API Google", type: "password", default: "", sensitive: true },
      { key: "webhook_timeout", label: "Timeout Webhook (seg)", type: "number", default: "30" },
      { key: "api_version", label: "Versão da API", type: "string", default: "v1" }
    ]
  },
  backup: {
    icon: Database,
    title: "Backup",
    description: "Configurações de backup e recuperação",
    configs: [
      { key: "backup_enabled", label: "Backup Automático", type: "boolean", default: "true" },
      { key: "backup_frequency", label: "Frequência", type: "select", options: ["daily", "weekly", "monthly"], default: "daily" },
      { key: "backup_retention_days", label: "Retenção (dias)", type: "number", default: "30" },
      { key: "s3_bucket", label: "Bucket S3", type: "string", default: "" },
      { key: "s3_access_key", label: "Access Key S3", type: "password", default: "", sensitive: true },
      { key: "s3_secret_key", label: "Secret Key S3", type: "password", default: "", sensitive: true }
    ]
  },
  logs: {
    icon: Activity,
    title: "Logs",
    description: "Configurações de logging e monitoramento",
    configs: [
      { key: "log_level", label: "Nível de Log", type: "select", options: ["debug", "info", "warning", "error"], default: "info" },
      { key: "log_retention_days", label: "Retenção Logs (dias)", type: "number", default: "90" },
      { key: "enable_error_tracking", label: "Rastreamento de Erros", type: "boolean", default: "true" },
      { key: "enable_performance_monitoring", label: "Monitor Performance", type: "boolean", default: "true" },
      { key: "sentry_dsn", label: "Sentry DSN", type: "password", default: "", sensitive: true }
    ]
  }
};

export default function SystemConfigView() {
  const { refreshAll } = useSync();
  // Removendo o useToast temporariamente para evitar erro
  // const { toast } = useToast();
  const [configs, setConfigs] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("system");

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    setIsLoading(true);
    try {
      const allConfigs = await SystemConfig.list();
      const configsMap = {};
      
      allConfigs.forEach(config => {
        if (!configsMap[config.category]) {
          configsMap[config.category] = {};
        }
        configsMap[config.category][config.key] = config.value;
      });
      
      setConfigs(configsMap);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      alert("Erro ao carregar configurações");
    }
    setIsLoading(false);
  };

  const handleSave = async (category) => {
    setIsSaving(true);
    try {
      const categoryConfigs = CONFIG_CATEGORIES[category].configs;
      const updates = [];
      
      for (const configDef of categoryConfigs) {
        const value = configs[category]?.[configDef.key] || configDef.default;
        
        updates.push({
          category,
          key: configDef.key,
          value: value.toString(),
          data_type: configDef.type,
          description: configDef.label,
          is_sensitive: configDef.sensitive || false
        });
      }
      
      // Buscar configurações existentes e atualizar/criar conforme necessário
      const existingConfigs = await SystemConfig.filter({ category });
      const existingKeys = existingConfigs.map(c => c.key);
      
      for (const update of updates) {
        if (existingKeys.includes(update.key)) {
          const existing = existingConfigs.find(c => c.key === update.key);
          await SystemConfig.update(existing.id, update);
        } else {
          await SystemConfig.create(update);
        }
      }
      
      alert(`Configurações de ${CONFIG_CATEGORIES[category].title} salvas com sucesso!`);
      await refreshAll();
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      alert("Erro ao salvar configurações");
    }
    setIsSaving(false);
  };

  const handleConfigChange = (category, key, value) => {
    setConfigs(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const renderConfigField = (category, configDef) => {
    const value = configs[category]?.[configDef.key] || configDef.default || "";
    
    switch (configDef.type) {
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value === "true"}
              onCheckedChange={(checked) => handleConfigChange(category, configDef.key, checked.toString())}
            />
            <Label className="text-gray-300">{configDef.label}</Label>
          </div>
        );
      
      case "select":
        return (
          <div className="space-y-2">
            <Label className="text-gray-300">{configDef.label}</Label>
            <Select value={value} onValueChange={(v) => handleConfigChange(category, configDef.key, v)}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                {configDef.options?.map(option => (
                  <SelectItem key={option} value={option} className="capitalize">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case "password":
        return (
          <div className="space-y-2">
            <Label className="text-gray-300">{configDef.label}</Label>
            <Input
              type="password"
              value={value}
              onChange={(e) => handleConfigChange(category, configDef.key, e.target.value)}
              className="bg-gray-800 border-gray-600"
              placeholder={configDef.sensitive ? "••••••••••••" : ""}
            />
          </div>
        );
      
      default:
        return (
          <div className="space-y-2">
            <Label className="text-gray-300">{configDef.label}</Label>
            <Input
              type={configDef.type === "number" ? "number" : "text"}
              value={value}
              onChange={(e) => handleConfigChange(category, configDef.key, e.target.value)}
              className="bg-gray-800 border-gray-600"
              placeholder={configDef.default}
            />
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-400">Carregando configurações...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="admin-full-width space-y-6 w-full max-w-none overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Configurações do Sistema</h1>
          <p className="text-gray-400">Gerencie todas as configurações da plataforma</p>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-800/50 border border-gray-700 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {Object.entries(CONFIG_CATEGORIES).map(([key, category]) => {
            const Icon = category.icon;
            return (
              <TabsTrigger
                key={key}
                value={key}
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(CONFIG_CATEGORIES).map(([categoryKey, category]) => (
          <TabsContent key={categoryKey} value={categoryKey}>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <category.icon className="w-6 h-6 text-blue-400" />
                  <div>
                    <CardTitle className="text-white">{category.title}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {category.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.configs.map((configDef) => (
                    <div key={configDef.key}>
                      {renderConfigField(categoryKey, configDef)}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end pt-6 border-t border-gray-700">
                  <Button 
                    onClick={() => handleSave(categoryKey)} 
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar {category.title}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}