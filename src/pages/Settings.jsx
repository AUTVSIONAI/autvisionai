import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Zap,
  Globe,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Key,
  Download,
  Trash2,
  Save,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [settings, setSettings] = useState({
    // Perfil
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    
    // Notificações
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    missionAlerts: true,
    weeklyReport: true,
    
    // Aparência
    theme: 'dark',
    language: 'pt-BR',
    animations: true,
    compactMode: false,
    
    // Privacidade
    profilePublic: false,
    shareStats: true,
    dataCollection: true,
    
    // Automação
    autoSave: true,
    smartSuggestions: true,
    voiceCommands: false,
    betaFeatures: false
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simular salvamento (implementar API real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar perfil se necessário
      if (settings.name !== user?.name || settings.email !== user?.email) {
        await updateProfile({
          name: settings.name,
          email: settings.email,
          bio: settings.bio
        });
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      emailNotifications: true,
      pushNotifications: true,
      soundEnabled: true,
      missionAlerts: true,
      weeklyReport: true,
      theme: 'dark',
      language: 'pt-BR',
      animations: true,
      compactMode: false,
      profilePublic: false,
      shareStats: true,
      dataCollection: true,
      autoSave: true,
      smartSuggestions: true,
      voiceCommands: false,
      betaFeatures: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* HEADER - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Configurações</h1>
              <p className="text-sm sm:text-base text-gray-400">Personalize sua experiência AUTVISION</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 justify-end">
            {saved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-green-400"
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Salvo!</span>
              </motion.div>
            )}
            
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Resetar</span>
              <span className="sm:hidden">Reset</span>
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={saving}
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-700 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                  <span className="hidden sm:inline">Salvando...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Salvar</span>
                  <span className="sm:hidden">OK</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* PERFIL - Mobile Optimized */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Nome Completo
                </label>
                <Input
                  value={settings.name}
                  onChange={(e) => handleSettingChange('name', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white text-sm h-9 sm:h-10"
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Email
                </label>
                <Input
                  value={settings.email}
                  onChange={(e) => handleSettingChange('email', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white text-sm h-9 sm:h-10"
                  placeholder="seu@email.com"
                  type="email"
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Bio
                </label>
                <Input
                  value={settings.bio}
                  onChange={(e) => handleSettingChange('bio', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white text-sm h-9 sm:h-10"
                  placeholder="Conte um pouco sobre você..."
                />
              </div>
            </CardContent>
          </Card>

          {/* NOTIFICAÇÕES - Mobile Optimized */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  <span className="text-white text-sm sm:text-base">Email</span>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  className="scale-90 sm:scale-100"
                />
              </div>
              
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  <span className="text-white text-sm sm:text-base">Push</span>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  className="scale-90 sm:scale-100"
                />
              </div>
              
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  {settings.soundEnabled ? 
                    <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" /> : 
                    <VolumeX className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  }
                  <span className="text-white text-sm sm:text-base">Som</span>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
                  className="scale-90 sm:scale-100"
                />
              </div>
              
              <div className="flex items-center justify-between py-1">
                <span className="text-white text-sm sm:text-base">Alertas de Missão</span>
                <Switch
                  checked={settings.missionAlerts}
                  onCheckedChange={(checked) => handleSettingChange('missionAlerts', checked)}
                  className="scale-90 sm:scale-100"
                />
              </div>
              
              <div className="flex items-center justify-between py-1">
                <span className="text-white text-sm sm:text-base">Relatório Semanal</span>
                <Switch
                  checked={settings.weeklyReport}
                  onCheckedChange={(checked) => handleSettingChange('weeklyReport', checked)}
                  className="scale-90 sm:scale-100"
                />
              </div>
            </CardContent>
          </Card>

          {/* APARÊNCIA - Mobile Optimized */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
                <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  {settings.theme === 'dark' ? 
                    <Moon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" /> : 
                    <Sun className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  }
                  <span className="text-white text-sm sm:text-base">Tema</span>
                </div>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs px-2 py-1">
                  {settings.theme === 'dark' ? 'Escuro' : 'Claro'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  <span className="text-white text-sm sm:text-base">Idioma</span>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-2 py-1">
                  {settings.language === 'pt-BR' ? 'Português' : 'English'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between py-1">
                <span className="text-white text-sm sm:text-base">Animações</span>
                <Switch
                  checked={settings.animations}
                  onCheckedChange={(checked) => handleSettingChange('animations', checked)}
                  className="scale-90 sm:scale-100"
                />
              </div>
              
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Monitor className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  <span className="text-white text-sm sm:text-base">Modo Compacto</span>
                </div>
                <Switch
                  checked={settings.compactMode}
                  onCheckedChange={(checked) => handleSettingChange('compactMode', checked)}
                  className="scale-90 sm:scale-100"
                />
              </div>
            </CardContent>
          </Card>

          {/* PRIVACIDADE - Mobile Optimized */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                Privacidade & Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between py-1">
                <span className="text-white text-sm sm:text-base">Perfil Público</span>
                <Switch
                  checked={settings.profilePublic}
                  onCheckedChange={(checked) => handleSettingChange('profilePublic', checked)}
                  className="scale-90 sm:scale-100"
                />
              </div>
              
              <div className="flex items-center justify-between py-1">
                <span className="text-white text-sm sm:text-base">Compartilhar Estatísticas</span>
                <Switch
                  checked={settings.shareStats}
                  onCheckedChange={(checked) => handleSettingChange('shareStats', checked)}
                  className="scale-90 sm:scale-100"
                />
              </div>
              
              <div className="flex items-center justify-between py-1">
                <span className="text-white text-sm sm:text-base">Coleta de Dados</span>
                <Switch
                  checked={settings.dataCollection}
                  onCheckedChange={(checked) => handleSettingChange('dataCollection', checked)}
                  className="scale-90 sm:scale-100"
                />
              </div>
              
              <Button
                variant="outline"
                className="w-full border-green-600 text-green-400 hover:bg-green-600/10 text-xs sm:text-sm h-8 sm:h-10"
              >
                <Key className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Alterar Senha
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-blue-600 text-blue-400 hover:bg-blue-600/10 text-xs sm:text-sm h-8 sm:h-10"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Exportar Dados
              </Button>
            </CardContent>
          </Card>

          {/* AUTOMAÇÃO - Mobile Optimized */}
          <Card className="bg-gray-900 border-gray-700 lg:col-span-2">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                Automação & Recursos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-white text-sm sm:text-base">Salvamento Automático</span>
                    <Switch
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                      className="scale-90 sm:scale-100"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-1">
                    <span className="text-white text-sm sm:text-base">Sugestões Inteligentes</span>
                    <Switch
                      checked={settings.smartSuggestions}
                      onCheckedChange={(checked) => handleSettingChange('smartSuggestions', checked)}
                      className="scale-90 sm:scale-100"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm sm:text-base">Comandos de Voz</span>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs px-1.5 py-0.5">
                        BETA
                      </Badge>
                    </div>
                    <Switch
                      checked={settings.voiceCommands}
                      onCheckedChange={(checked) => handleSettingChange('voiceCommands', checked)}
                      className="scale-90 sm:scale-100"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm sm:text-base">Recursos Beta</span>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs px-1.5 py-0.5">
                        EXPERIMENTAL
                      </Badge>
                    </div>
                    <Switch
                      checked={settings.betaFeatures}
                      onCheckedChange={(checked) => handleSettingChange('betaFeatures', checked)}
                      className="scale-90 sm:scale-100"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ZONA DE PERIGO - Mobile Optimized */}
          <Card className="bg-red-900/20 border-red-500/30 lg:col-span-2">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-red-400 text-base sm:text-lg">
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Zona de Perigo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <p className="text-gray-300 text-xs sm:text-sm">
                Estas ações são irreversíveis. Proceda com cuidado.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600/10 text-xs sm:text-sm h-8 sm:h-10"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Limpar Histórico
                </Button>
                
                <Button
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600/10 text-xs sm:text-sm h-8 sm:h-10"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Deletar Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}