import { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { VisionCompanion } from "@/api/entities";
import { Plan } from "@/api/entities"; // IMPORTAR PLAN
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Settings as SettingsIcon,
  User as UserIcon,
  Bell,
  Shield,
  Palette,
  Save,
  LogOut,
  Brain,
  Moon,
  Sun,
  Globe,
  Lock,
  Crown,
  CreditCard,
  Sparkles, // New icon
  Zap,      // New icon
  Eye       // New icon
} from "lucide-react";
import PurchasePlanModal from "../components/plans/PurchasePlanModal";

export default function Settings() {
  const { toast } = useToast();
  const { signOut, isAuthenticated, initializing } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [visionSettings, setVisionSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const [settings, setSettings] = useState({
    // Configurações de Perfil
    full_name: "",
    email: "",
    
    // Configurações de Aparência
    theme: "system", // light, dark, system
    language: "pt-BR", // This setting is defined but not used in the appearance tab outline. It will be kept.
    
    // Configurações de Notificações
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    
    // Configurações de Privacidade
    profile_visibility: "private",
    data_sharing: false,
    
    // Configurações de Audio (moved to appearance tab for sound effects)
    sound_effects: true,
    
    // Configurações de Segurança
    two_factor_enabled: false,
    session_timeout: 60
  });

  useEffect(() => {
    const loadAllData = async () => {
      // Se ainda está inicializando ou não está autenticado, não carregar dados
      if (initializing || !isAuthenticated) {
        console.log('Settings: Aguardando autenticação...', { initializing, isAuthenticated });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const user = await User.me();
        
        // Verificar se o usuário foi carregado corretamente
        if (!user) {
          console.error('Usuário não encontrado');
          toast.error("Erro ao carregar dados do usuário.");
          setIsLoading(false);
          return;
        }
        
        setCurrentUser(user);
        
        // Carregar plano atual se plan_id existir
        if (user.plan_id) {
          try {
            const userPlans = await Plan.list(); 
            const currentUserPlan = userPlans.find(p => p.id === user.plan_id);
            setCurrentPlan(currentUserPlan || null);
          } catch (error) {
            console.error('Erro ao carregar plano:', error);
            toast.error("Erro ao carregar seu plano.");
            setCurrentPlan(null);
          }
        } else {
          console.log('Usuário sem plano definido');
          setCurrentPlan(null);
        }
        
        // Carregar configurações salvas ou usar padrões
        const userEmail = user.email || '';
        const savedSettings = localStorage.getItem(`user_settings_${userEmail}`);
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(prev => ({
            ...prev,
            ...parsed,
            full_name: user.full_name || '',
            email: user.email || ''
          }));
        } else {
          setSettings(prev => ({
            ...prev,
            full_name: user.full_name || '',
            email: user.email || ''
          }));
        }

        // Carregar ou criar configurações do Vision
        try {
          let visions = await VisionCompanion.filter({ created_by: userEmail });
          let visionData;
          if (visions.length === 0) {
            visionData = await VisionCompanion.create({ 
              name: "Meu Vision", 
              created_by: userEmail, 
              personality_type: "friendly", 
              voice_enabled: true,
              user_preferences: {} 
            });
            toast.info("Criamos um Vision padrão para você!");
          } else {
            visionData = visions[0];
            // Ensure user_preferences exists for loaded data
            if (!visionData.user_preferences) {
              visionData.user_preferences = {};
            }
          }
          setVisionSettings(visionData);
        } catch (error) {
          console.error('Erro ao carregar/criar Vision:', error);
          toast.error("Erro ao carregar configurações do Vision.");
        }

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        
        // Se é erro de rede (backend offline), mostrar mensagem específica
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
          console.warn("⚠️ Backend offline - usando dados locais");
          toast.warning("Modo offline: algumas configurações podem estar limitadas.");
          
          // Carregar configurações básicas do localStorage
          const savedSettings = localStorage.getItem(`user_settings_offline`);
          if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            setSettings(prev => ({ ...prev, ...parsed }));
          }
        } else {
          toast.error("Erro ao carregar suas configurações.");
        }
      }
      setIsLoading(false);
    };

    loadAllData();
  }, [toast, initializing, isAuthenticated]);

  const handleVisionPreferenceChange = (field, value) => {
    setVisionSettings(prev => ({
      ...prev,
      user_preferences: {
        ...(prev?.user_preferences || {}),
        [field]: value
      }
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Salvar configurações do perfil no banco
      await User.updateMyUserData({
        full_name: settings.full_name
      });

      // Salvar outras configurações no localStorage
      const settingsToSave = { ...settings };
      delete settingsToSave.full_name;
      delete settingsToSave.email;
      localStorage.setItem(`user_settings_${currentUser.email}`, JSON.stringify(settingsToSave));

      // Aplicar tema
      applyTheme(settings.theme);

      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações");
    }
    setIsSaving(false);
  };

  const saveVisionSettings = async () => {
    if (!visionSettings || !visionSettings.id) return;
    setIsSaving(true);
    try {
      await VisionCompanion.update(visionSettings.id, {
          name: visionSettings.name,
          personality_type: visionSettings.personality_type,
          voice_enabled: visionSettings.voice_enabled,
          user_preferences: visionSettings.user_preferences, // Added user_preferences
      });
      toast.success("Configurações do Vision salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar Vision:", error);
      toast.error("Erro ao salvar as configurações do Vision.");
    }
    setIsSaving(false);
  };

  const applyTheme = (theme) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    localStorage.setItem('theme', theme);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso!");
      // Redireciona para a landing page
      window.location.href = '/';
    } catch (error) {
      console.error("Erro no logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const handlePlanPurchased = (plan) => {
    setCurrentPlan(plan);
    setShowPlanModal(false);
    toast.success(`Plano ${plan.name} ativado com sucesso!`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
      >
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Configurações</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Personalize sua experiência na plataforma</p>
        </div>
      </motion.div>

      {/* Tabs de Configurações */}
      <Tabs defaultValue="profile" className="space-y-6">
        {/* TABS RESPONSIVAS - SCROLL HORIZONTAL EM MOBILE */}
        <div className="w-full overflow-x-auto">
          <TabsList className="inline-flex h-auto w-auto min-w-full p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="flex space-x-1 min-w-max">
              <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap">
                <UserIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="plan" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap">
                <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Plano</span>
              </TabsTrigger>
              <TabsTrigger value="vision" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap">
                <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Vision</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap">
                <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Aparência</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap">
                <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Notificações</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Privacidade</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap">
                <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Segurança</span>
              </TabsTrigger>
            </div>
          </TabsList>
        </div>

        {/* Aba Perfil */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Informações do Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {(settings.full_name || '').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{settings.full_name}</h3>
                  <p className="text-gray-600">{settings.email}</p>
                  <Badge className="mt-2">
                    {currentUser?.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="full_name">Nome Completo</Label>
                  <Input
                    id="full_name"
                    value={settings.full_name}
                    onChange={(e) => setSettings(prev => ({ ...prev, full_name: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={settings.email}
                    disabled
                    className="mt-1 bg-gray-100 dark:bg-gray-800"
                  />
                  <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* NOVA ABA PLANO */}
        <TabsContent value="plan">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Meu Plano
              </CardTitle>
              <CardDescription>Gerencie sua assinatura e benefícios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentPlan ? (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-blue-900">{currentPlan.name}</h3>
                      <p className="text-blue-700">R$ {currentPlan.price?.toFixed(2) || '0.00'}/mês</p>
                    </div>
                    <Badge className="bg-blue-600 text-white text-lg px-4 py-2">
                      Ativo
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{currentPlan.max_agents || '∞'}</p>
                      <p className="text-sm text-gray-600">Agentes</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{currentPlan.max_routines || '∞'}</p>
                      <p className="text-sm text-gray-600">Rotinas</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{currentPlan.max_integrations || '∞'}</p>
                      <p className="text-sm text-gray-600">Integrações</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-sm font-bold text-orange-600 uppercase">{currentPlan.support_level}</p>
                      <p className="text-sm text-gray-600">Suporte</p>
                    </div>
                  </div>

                  {currentPlan.features && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Recursos Incluídos:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {currentPlan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum Plano Ativo</h3>
                  <p className="text-gray-600 mb-4">Escolha um plano para desbloquear todos os recursos do Vision</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowPlanModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {currentPlan ? 'Alterar Plano' : 'Escolher Plano'}
                </Button>
                
                {currentPlan && (
                  <Button variant="outline">
                    Gerenciar Pagamento
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aba Vision - CENTRALIZADA E COMPLETA */}
        <TabsContent value="vision">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                Configurações do Vision
              </CardTitle>
              <CardDescription>Personalize o comportamento e a aparência do seu assistente pessoal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {visionSettings ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Coluna de Configurações */}
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="vision_name">Nome do Vision</Label>
                        <Input
                          id="vision_name"
                          value={visionSettings.name}
                          onChange={(e) => setVisionSettings(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="personality">Personalidade</Label>
                         <Select
                          value={visionSettings.personality_type}
                          onValueChange={(value) => setVisionSettings(prev => ({ ...prev, personality_type: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecione uma personalidade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="friendly"><div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-yellow-500" />Amigável</div></SelectItem>
                            <SelectItem value="professional"><div className="flex items-center gap-2"><Crown className="w-4 h-4 text-blue-500" />Profissional</div></SelectItem>
                            <SelectItem value="casual"><div className="flex items-center gap-2"><Zap className="w-4 h-4 text-green-500" />Casual</div></SelectItem>
                            <SelectItem value="formal"><div className="flex items-center gap-2"><Eye className="w-4 h-4 text-gray-500" />Formal</div></SelectItem>
                            <SelectItem value="creative"><div className="flex items-center gap-2"><Palette className="w-4 h-4 text-purple-500" />Criativo</div></SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                       <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Vision com Voz</h4>
                          <p className="text-sm text-gray-600">Permitir que seu Vision responda com voz</p>
                        </div>
                        <Switch
                          checked={visionSettings.voice_enabled}
                          onCheckedChange={(checked) => setVisionSettings(prev => ({ ...prev, voice_enabled: checked }))}
                        />
                      </div>
                    </div>

                    {/* Coluna de Estatísticas */}
                    <div className="bg-blue-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-4">
                      <h4 className="font-semibold text-center text-gray-800 dark:text-gray-200">Estatísticas do Vision</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{visionSettings.learning_level || 1}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Nível</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{visionSettings.total_interactions || 0}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Interações</p>
                        </div>
                        <div>
                           <Badge className="capitalize" variant={visionSettings.status === 'active' ? 'default' : 'secondary'}>{visionSettings.status || 'active'}</Badge>
                           <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Status</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preferências de Interação */}
                  <div className="space-y-6 pt-6 border-t">
                     <h4 className="font-semibold text-gray-800 dark:text-gray-200">Preferências de Interação</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <Label htmlFor="wake_word">Palavra de Ativação</Label>
                          <Input
                            id="wake_word"
                            value={visionSettings.user_preferences?.wake_word || ''}
                            onChange={(e) => handleVisionPreferenceChange('wake_word', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="response_speed">Velocidade da Resposta</Label>
                           <Select
                              value={visionSettings.user_preferences?.response_speed || 'normal'}
                              onValueChange={(value) => handleVisionPreferenceChange('response_speed', value)}
                           >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Selecione a velocidade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="slow">Lenta</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="fast">Rápida</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="interaction_mode">Modo de Interação</Label>
                          <Select
                            value={visionSettings.user_preferences?.interaction_mode || 'mixed'}
                            onValueChange={(value) => handleVisionPreferenceChange('interaction_mode', value)}
                          >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Selecione o modo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="voice">Apenas Voz</SelectItem>
                              <SelectItem value="text">Apenas Texto</SelectItem>
                              <SelectItem value="mixed">Misto (Voz + Texto)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t">
                    <Button onClick={saveVisionSettings} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Salvando...' : 'Salvar Configurações do Vision'}
                    </Button>
                  </div>
                </>
              ) : (
                <p>Carregando configurações do Vision...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Aparência */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Aparência
              </CardTitle>
              <CardDescription>Personalize a aparência da interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Tema</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    {[
                      { value: 'light', label: 'Claro', icon: Sun },
                      { value: 'dark', label: 'Escuro', icon: Moon },
                      { value: 'system', label: 'Sistema', icon: Globe }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => {
                          setSettings(prev => ({ ...prev, theme: value }));
                          applyTheme(value);
                        }}
                        className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                          settings.theme === value 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Efeitos Sonoros</h4>
                    <p className="text-sm text-gray-600">Sons de interação da interface</p>
                  </div>
                  <Switch
                    checked={settings.sound_effects}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sound_effects: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Notificações */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificações
              </CardTitle>
              <CardDescription>Gerencie como você recebe notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'email_notifications', label: 'Notificações por Email', description: 'Receber notificações importantes por email' },
                { key: 'push_notifications', label: 'Notificações Push', description: 'Notificações em tempo real no navegador' },
                { key: 'marketing_emails', label: 'Emails de Marketing', description: 'Novidades, dicas e promoções' }
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{label}</h4>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                  <Switch
                    checked={settings[key]}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, [key]: checked }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Privacidade */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacidade
              </CardTitle>
              <CardDescription>Controle seus dados e privacidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Compartilhamento de Dados</h4>
                  <p className="text-sm text-gray-600">Permitir uso de dados para melhorar a experiência</p>
                </div>
                <Switch
                  checked={settings.data_sharing}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, data_sharing: checked }))}
                />
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Visibilidade do Perfil</h4>
                <div className="space-y-2">
                  {[
                    { value: 'public', label: 'Público' },
                    { value: 'private', label: 'Privado' }
                  ].map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="profile_visibility"
                        value={value}
                        checked={settings.profile_visibility === value}
                        onChange={(e) => setSettings(prev => ({ ...prev, profile_visibility: e.target.value }))}
                        className="text-blue-600"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Segurança */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Segurança da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Autenticação de Dois Fatores</h4>
                  <p className="text-sm text-gray-600">Adicione uma camada extra de segurança</p>
                </div>
                <Switch
                  checked={settings.two_factor_enabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, two_factor_enabled: checked }))}
                />
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Timeout da Sessão</h4>
                <p className="text-sm text-gray-600 mb-3">Tempo limite antes do logout automático</p>
                <select
                  value={settings.session_timeout}
                  onChange={(e) => setSettings(prev => ({ ...prev, session_timeout: parseInt(e.target.value) }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={30}>30 minutos</option>
                  <option value={60}>1 hora</option>
                  <option value={120}>2 horas</option>
                  <option value={240}>4 horas</option>
                </select>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="w-full justify-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Fazer Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botão de Salvar Geral */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <Button 
          onClick={saveSettings} 
          disabled={isSaving}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações Gerais
            </>
          )}
        </Button>
      </motion.div>

      {/* Modal de Planos */}
      <PurchasePlanModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onPlanPurchased={handlePlanPurchased}
      />
    </div>
  );
}
