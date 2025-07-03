import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from "@/utils/supabase";
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause,
  Eye,
  Users,
  BarChart,
  BarChart3,
  Sparkles,
  Volume2,
  CheckCircle,
  XCircle,
  Settings,
  Mic
} from 'lucide-react';

/**
 * Painel administrativo para gerenciamento de vozes
 * Permite criar, editar, ativar/desativar vozes e visualizar estatísticas
 */
const VoiceManagement = () => {
  const { toast } = useToast();
  // supabase client já importado diretamente
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [voices, setVoices] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const [voiceStats, setVoiceStats] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showVisionVoiceDialog, setShowVisionVoiceDialog] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const [visionVoiceSettings, setVisionVoiceSettings] = useState({
    default_voice_id: 'pt-br-female-1',
    voice_name: 'Ana Clara',
    enabled: true
  });
  const [formData, setFormData] = useState({
    voice_id: '',
    voice_name: '',
    description: '',
    language: 'pt-BR',
    gender: '',
    age_range: '',
    voice_type: 'standard',
    price_tokens: 0,
    preview_text: 'Olá! Esta é uma amostra da minha voz.',
    is_available: true,
    is_premium: false
  });

  // Verificar se é admin
  const isAdmin = user?.email === 'digitalinfluenceradm@gmail.com' || userProfile?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      loadData();
      loadVisionVoiceSettings();
    }
  }, [isAdmin]);

  // Carregar todos os dados
  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadVoices(),
        loadUserProfiles(),
        loadVoiceStats()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar os dados do painel.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Carregar vozes disponíveis
  const loadVoices = async () => {
    const { data, error } = await supabase
      .from('available_voices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    setVoices(data || []);
  };

  // Carregar perfis de usuários com vozes
  const loadUserProfiles = async () => {
    const { data, error } = await supabase
      .from('user_voice_details')
      .select('*')
      .order('user_name');
    
    if (error) throw error;
    setUserProfiles(data || []);
  };

  // Carregar estatísticas de uso
  const loadVoiceStats = async () => {
    const { data, error } = await supabase
      .from('voice_usage_stats')
      .select('*');
    
    if (error) throw error;
    setVoiceStats(data || []);
  };

  // Reproduzir amostra de voz
  const playVoiceSample = async (voiceParam, customText = null) => {
    // Aceita tanto um objeto voice quanto um voiceId
    let voice, voiceId, previewText;
    
    if (typeof voiceParam === 'object' && voiceParam !== null) {
      // É um objeto voice
      voice = voiceParam;
      voiceId = voice.id || voice.voice_id;
      previewText = customText || voice.preview_text || 'Olá! Esta é uma amostra da minha voz.';
    } else {
      // É um voiceId
      voiceId = voiceParam;
      voice = voices.find(v => v.id === voiceId || v.voice_id === voiceId);
      previewText = customText || voice?.preview_text || 'Olá! Esta é uma amostra da minha voz.';
    }
    
    const actualVoiceId = voice?.voice_id || voiceId;
    const playingId = voice?.id || voiceId;
    
    if (playingVoiceId === playingId) {
      // Parar reprodução atual
      setPlayingVoiceId(null);
      // Parar todos os áudios
      document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
      return;
    }
    
    try {
      setPlayingVoiceId(playingId);
      
      toast({
        title: 'Carregando amostra',
        description: `Preparando amostra da voz ${voice?.voice_name || actualVoiceId}...`,
        duration: 2000
      });
      
      // Chamar API de síntese de voz
      const response = await fetch('http://localhost:3001/voice/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: previewText,
          voice_id: actualVoiceId,
          speed: 1.0,
          pitch: 0
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Falha na síntese de voz: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erro na síntese');
      }
      
      // Criar e reproduzir áudio
      const audioUrl = result.data.audio_url.startsWith('http') 
        ? result.data.audio_url 
        : `http://localhost:3001${result.data.audio_url}`;
        
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setPlayingVoiceId(null);
        toast({
          title: 'Reprodução concluída',
          description: `Teste da voz ${voice?.voice_name || actualVoiceId} finalizado.`,
          duration: 2000
        });
      };
      
      audio.onerror = (e) => {
        console.error('Erro no áudio:', e);
        setPlayingVoiceId(null);
        toast({
          title: 'Erro ao reproduzir',
          description: 'Não foi possível reproduzir a amostra de voz.',
          variant: 'destructive'
        });
      };
      
      await audio.play();
      
      toast({
        title: 'Reproduzindo amostra',
        description: `Testando voz: ${voice?.voice_name || actualVoiceId}`,
        duration: 3000
      });
      
    } catch (error) {
      console.error('Erro ao reproduzir amostra:', error);
      setPlayingVoiceId(null);
      toast({
        title: 'Erro na amostra',
        description: error.message || 'Não foi possível carregar a amostra de voz.',
        variant: 'destructive'
      });
    }
  };

  // Criar nova voz
  const createVoice = async () => {
    try {
      const { error } = await supabase
        .from('available_voices')
        .insert([formData]);
      
      if (error) throw error;
      
      toast({
        title: 'Voz criada',
        description: 'Nova voz adicionada com sucesso!',
        type: 'success'
      });
      
      setShowCreateDialog(false);
      resetForm();
      loadVoices();
      
    } catch (error) {
      console.error('Erro ao criar voz:', error);
      toast({
        title: 'Erro ao criar voz',
        description: error.message,
        type: 'error'
      });
    }
  };

  // Atualizar voz existente
  const updateVoice = async () => {
    try {
      const { error } = await supabase
        .from('available_voices')
        .update(formData)
        .eq('id', selectedVoice.id);
      
      if (error) throw error;
      
      toast({
        title: 'Voz atualizada',
        description: 'Voz atualizada com sucesso!',
        type: 'success'
      });
      
      setShowEditDialog(false);
      resetForm();
      loadVoices();
      
    } catch (error) {
      console.error('Erro ao atualizar voz:', error);
      toast({
        title: 'Erro ao atualizar voz',
        description: error.message,
        type: 'error'
      });
    }
  };

  // Deletar voz
  const deleteVoice = async (voiceId) => {
    if (!confirm('Tem certeza que deseja deletar esta voz?')) return;
    
    try {
      const { error } = await supabase
        .from('available_voices')
        .delete()
        .eq('id', voiceId);
      
      if (error) throw error;
      
      toast({
        title: 'Voz deletada',
        description: 'Voz removida com sucesso!',
        type: 'success'
      });
      
      loadVoices();
      
    } catch (error) {
      console.error('Erro ao deletar voz:', error);
      toast({
        title: 'Erro ao deletar voz',
        description: error.message,
        type: 'error'
      });
    }
  };

  // Alternar disponibilidade da voz
  const toggleVoiceAvailability = async (voiceId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('available_voices')
        .update({ is_available: !currentStatus })
        .eq('id', voiceId);
      
      if (error) throw error;
      
      toast({
        title: 'Status atualizado',
        description: `Voz ${!currentStatus ? 'ativada' : 'desativada'} com sucesso!`,
        type: 'success'
      });
      
      loadVoices();
      
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: 'Erro ao alterar status',
        description: error.message,
        type: 'error'
      });
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      voice_id: '',
      voice_name: '',
      description: '',
      language: 'pt-BR',
      gender: '',
      age_range: '',
      voice_type: 'standard',
      price_tokens: 0,
      preview_text: 'Olá! Esta é uma amostra da minha voz.',
      is_available: true,
      is_premium: false
    });
    setSelectedVoice(null);
  };

  // Preparar edição
  const prepareEdit = (voice) => {
    setSelectedVoice(voice);
    setFormData(voice);
    setShowEditDialog(true);
  };
  
  // Configurar voz para o Vision Command
  const configureVisionVoice = async (voiceId) => {
    try {
      const voice = voices.find(v => v.id === voiceId);
      
      if (!voice) {
        throw new Error('Voz não encontrada');
      }
      
      // Atualizar configurações locais
      const newSettings = {
        default_voice_id: voice.voice_id,
        voice_name: voice.voice_name,
        enabled: true
      };
      
      setVisionVoiceSettings(newSettings);
      
      // Salvar configurações no banco de dados
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'vision_voice_config',
          value: {
            ...newSettings,
            updated_at: new Date().toISOString(),
            updated_by: user.email
          }
        });
      
      if (error) throw error;
      
      // Salvar também no localStorage para acesso global
      saveVisionConfigToStorage(newSettings);
       
      toast({
        title: 'Configuração salva',
        description: `A voz ${voice.voice_name} foi configurada como padrão para o Vision Command.`,
        duration: 3000
      });
       
      setShowVisionVoiceDialog(false);
      
      // Testar a nova voz configurada
      setTimeout(() => {
        playVoiceSample(voice, 'Olá! Eu sou o Vision Command e esta é minha nova voz configurada.');
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao configurar voz:', error);
      toast({
        title: 'Erro na configuração',
        description: error.message || 'Não foi possível configurar a voz para o Vision Command.',
        variant: 'destructive'
      });
    }
   };
   
   // Exportar configurações de voz para uso global
   const exportVisionVoiceConfig = () => {
     return {
       voice_id: visionVoiceSettings.default_voice_id,
       voice_name: visionVoiceSettings.voice_name,
       enabled: visionVoiceSettings.enabled,
       playVoiceSample: playVoiceSample
     };
   };
   
   // Salvar configurações no localStorage para acesso global
   const saveVisionConfigToStorage = (settings = visionVoiceSettings) => {
     try {
       localStorage.setItem('vision_voice_config', JSON.stringify(settings));
       // Disparar evento customizado para notificar outros componentes
       window.dispatchEvent(new CustomEvent('visionVoiceConfigUpdated', {
         detail: settings
       }));
       console.log('Configurações de voz salvas:', settings);
     } catch (error) {
       console.error('Erro ao salvar configurações no localStorage:', error);
     }
   };
   
   // Testar voz do Vision Command com texto personalizado
   const testVisionVoice = async (customText = null) => {
     const testText = customText || 'Olá! Eu sou o Vision Command. Como posso ajudá-lo hoje? Esta é uma demonstração da minha voz atual.';
     
     if (!visionVoiceSettings.enabled) {
       toast({
         title: 'Voz desabilitada',
         description: 'A voz do Vision Command está desabilitada. Habilite-a para testar.',
         variant: 'destructive'
       });
       return;
     }
     
     const voice = voices.find(v => v.voice_id === visionVoiceSettings.default_voice_id);
     
     if (!voice) {
       toast({
         title: 'Voz não encontrada',
         description: 'A voz configurada não foi encontrada. Configure uma nova voz.',
         variant: 'destructive'
       });
       return;
     }
     
     await playVoiceSample(voice, testText);
   };
   
   // Alternar status da voz do Vision Command
   const toggleVisionVoiceEnabled = async () => {
     try {
       const newSettings = {
         ...visionVoiceSettings,
         enabled: !visionVoiceSettings.enabled
       };
       
       setVisionVoiceSettings(newSettings);
       
       // Salvar no banco de dados
       const { error } = await supabase
         .from('system_settings')
         .upsert({
           key: 'vision_voice_config',
           value: {
             ...newSettings,
             updated_at: new Date().toISOString(),
             updated_by: user.email
           }
         });
       
       if (error) throw error;
       
       // Salvar no localStorage
       saveVisionConfigToStorage(newSettings);
       
       toast({
         title: newSettings.enabled ? 'Voz habilitada' : 'Voz desabilitada',
         description: `A voz do Vision Command foi ${newSettings.enabled ? 'habilitada' : 'desabilitada'}.`,
         duration: 2000
       });
       
     } catch (error) {
       console.error('Erro ao alterar status da voz:', error);
       toast({
         title: 'Erro ao alterar status',
         description: 'Não foi possível alterar o status da voz.',
         variant: 'destructive'
       });
      }
    };
   
   // Carregar configurações de voz do Vision Command
  const loadVisionVoiceSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'vision_voice_config')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data && data.value) {
         setVisionVoiceSettings(data.value);
         // Salvar no localStorage para acesso global
         localStorage.setItem('vision_voice_config', JSON.stringify(data.value));
       }
      
    } catch (error) {
      console.error('Erro ao carregar configurações de voz:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Acesso Negado</h3>
          <p className="text-gray-600">Você precisa ser administrador para acessar este painel.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <Skeleton className="h-4 w-32 bg-gray-700" />
                <Skeleton className="h-8 w-16 bg-gray-600" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <Skeleton className="h-6 w-48 bg-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full bg-gray-700" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Gerenciamento de Vozes</h1>
          <p className="text-gray-600 mt-1">Gerencie vozes personalizadas e configurações de áudio</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Nova Voz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Nova Voz</DialogTitle>
              <DialogDescription>
                Adicione uma nova voz personalizada ao sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="voice_id">ID da Voz</Label>
                <Input
                  id="voice_id"
                  value={formData.voice_id}
                  onChange={(e) => setFormData({...formData, voice_id: e.target.value})}
                  placeholder="ex: voice_001"
                />
              </div>
              <div>
                <Label htmlFor="voice_name">Nome da Voz</Label>
                <Input
                  id="voice_name"
                  value={formData.voice_name}
                  onChange={(e) => setFormData({...formData, voice_name: e.target.value})}
                  placeholder="ex: Ana Clara"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descrição da voz..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (BR)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="gender">Gênero</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="neutro">Neutro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="price_tokens">Preço (Tokens)</Label>
                <Input
                  id="price_tokens"
                  type="number"
                  value={formData.price_tokens}
                  onChange={(e) => setFormData({...formData, price_tokens: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_premium"
                  checked={formData.is_premium}
                  onCheckedChange={(checked) => setFormData({...formData, is_premium: checked})}
                />
                <Label htmlFor="is_premium">Voz Premium</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={createVoice}>
                Criar Voz
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total de Vozes</p>
                <p className="text-2xl font-bold text-white">{voices.length}</p>
                <p className="text-xs text-green-400">{voices.filter(v => v.is_available).length} ativas</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Usuários com Vozes</p>
                <p className="text-2xl font-bold text-white">{userProfiles.length}</p>
                <p className="text-xs text-cyan-400">Perfis configurados</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Vozes Premium</p>
                <p className="text-2xl font-bold text-white">{voices.filter(v => v.is_premium).length}</p>
                <p className="text-xs text-purple-400">Disponíveis</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Uso Total</p>
                <p className="text-2xl font-bold text-white">{voiceStats.reduce((acc, stat) => acc + (stat.usage_count || 0), 0)}</p>
                <p className="text-xs text-green-400">Sínteses realizadas</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <BarChart className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="voices" className="space-y-4">
        <TabsList className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <TabsTrigger value="voices" className="text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">Vozes Disponíveis</TabsTrigger>
          <TabsTrigger value="vision-config" className="text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">Vision Command</TabsTrigger>
          <TabsTrigger value="users" className="text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">Perfis de Usuários</TabsTrigger>
          <TabsTrigger value="stats" className="text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="voices" className="space-y-4">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Vozes Disponíveis
              </CardTitle>
              <CardDescription className="text-blue-100">
                Gerencie todas as vozes disponíveis no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Cards de Vozes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {voices.map((voice) => (
                  <Card key={voice.id} className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-white">{voice.voice_name}</CardTitle>
                        <Badge variant={voice.is_premium ? "default" : "secondary"} className="bg-white/20 text-white border-white/30">
                          {voice.is_premium ? "Premium" : "Gratuita"}
                        </Badge>
                      </div>
                      <CardDescription className="text-blue-100">{voice.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Idioma:</span>
                          <span className="font-medium text-white">{voice.language}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Gênero:</span>
                          <span className="font-medium text-white">{voice.gender}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Tipo:</span>
                          <span className="font-medium text-white">{voice.voice_type}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Status:</span>
                          <Badge variant={voice.is_available ? 'default' : 'secondary'} className={voice.is_available ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                            {voice.is_available ? 'Ativa' : 'Inativa'}
                          </Badge>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => playVoiceSample(voice.id)}
                            disabled={playingVoiceId === voice.id}
                            className="border-blue-500 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                          >
                            {playingVoiceId === voice.id ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                            {playingVoiceId === voice.id ? "Reproduzindo..." : "Testar"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => prepareEdit(voice)}
                            className="border-purple-500 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleVoiceAvailability(voice.id, voice.is_available)}
                            className="border-green-500 text-green-400 hover:bg-green-500/20 hover:text-green-300"
                          >
                            {voice.is_available ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteVoice(voice.id)}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vision-config" className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Configuração de Voz do Vision Command</h3>
                <p className="text-gray-400">Configure a voz padrão que será utilizada pelo sistema Vision Command para responder aos usuários.</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  visionVoiceSettings.enabled 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {visionVoiceSettings.enabled ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuração Atual */}
              <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                <h4 className="text-lg font-medium text-white mb-4">Configuração Atual</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Voz Selecionada</label>
                    <p className="text-white font-medium">{visionVoiceSettings.voice_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">ID da Voz</label>
                    <p className="text-gray-300 font-mono text-sm">{visionVoiceSettings.default_voice_id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Status</label>
                    <p className={`font-medium ${
                      visionVoiceSettings.enabled ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {visionVoiceSettings.enabled ? 'Habilitado' : 'Desabilitado'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowVisionVoiceDialog(true)}
                  className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                >
                  Alterar Configuração
                </button>
              </div>
              
              {/* Teste de Voz */}
              <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                <h4 className="text-lg font-medium text-white mb-4">Teste da Voz Atual</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Teste como a voz atual do Vision Command soará para os usuários.
                </p>
                
                <button
                  onClick={() => playVoiceSample({ 
                    voice_id: visionVoiceSettings.default_voice_id,
                    voice_name: visionVoiceSettings.voice_name,
                    preview_text: 'Olá! Eu sou o Vision Command. Como posso ajudá-lo hoje?'
                  })}
                  disabled={playingVoiceId === visionVoiceSettings.default_voice_id}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                >
                  {playingVoiceId === visionVoiceSettings.default_voice_id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Reproduzindo...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Testar Voz</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Perfis de Usuários
              </CardTitle>
              <CardDescription className="text-purple-100">
                Visualize os perfis de voz configurados pelos usuários
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Cards de Perfis de Usuários */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProfiles.map((profile) => (
                  <Card key={profile.user_id} className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-white">
                          {profile.user_name || 'Usuário'}
                        </CardTitle>
                        <Badge variant="default" className="bg-white/20 text-white border-white/30">
                          Ativo
                        </Badge>
                      </div>
                      <CardDescription className="text-purple-100">
                        ID: {profile.user_id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Voz Selecionada:</span>
                          <span className="font-medium text-white">
                            {profile.voice_name || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Última Atualização:</span>
                          <span className="font-medium text-white">
                            {profile.updated_at ? 
                              new Date(profile.updated_at).toLocaleDateString('pt-BR') : 
                              'Nunca'
                            }
                          </span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowUserDialog(true)}
                            className="border-blue-500 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Detalhes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Estatísticas de Uso
              </CardTitle>
              <CardDescription className="text-green-100">
                Métricas de uso das vozes no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Total de Vozes</CardTitle>
                    <Mic className="h-4 w-4 text-blue-100" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{voiceStats?.length || 0}</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Usuários Ativos</CardTitle>
                    <Users className="h-4 w-4 text-green-100" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{userProfiles?.length || 0}</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Interações Hoje</CardTitle>
                    <BarChart3 className="h-4 w-4 text-purple-100" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{voiceStats.reduce((acc, stat) => acc + (stat.usage_count || 0), 0)}</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Vozes Premium</CardTitle>
                    <Settings className="h-4 w-4 text-orange-100" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{voices.filter(v => v.is_premium).length}</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Cards de Estatísticas Detalhadas */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Estatísticas por Voz</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {voiceStats.map((stat) => (
                    <Card key={stat.voice_id} className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                        <CardTitle className="text-lg text-white">{stat.voice_name}</CardTitle>
                        <CardDescription className="text-green-100">ID: {stat.voice_id}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Uso Total:</span>
                            <span className="font-medium text-white">{stat.usage_count || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Último Uso:</span>
                            <span className="font-medium text-white">
                              {stat.last_used ? new Date(stat.last_used).toLocaleDateString('pt-BR') : 'Nunca'}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Popularidade:</span>
                            <span className="font-medium text-white">
                              {Math.round((stat.usage_count || 0) / Math.max(...voiceStats.map(s => s.usage_count || 0)) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${Math.min((stat.usage_count || 0) / Math.max(...voiceStats.map(s => s.usage_count || 0)) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para configurar voz do Vision Command */}
      <Dialog open={showVisionVoiceDialog} onOpenChange={setShowVisionVoiceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configurar Voz do Vision Command</DialogTitle>
            <DialogDescription>
              Selecione a voz que será utilizada pelo Vision Command para responder aos usuários
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {voices.filter(voice => voice.is_available).map((voice) => (
                <div
                  key={voice.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    visionVoiceSettings.default_voice_id === voice.voice_id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setVisionVoiceSettings({
                    ...visionVoiceSettings,
                    default_voice_id: voice.voice_id,
                    voice_name: voice.voice_name
                  })}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{voice.voice_name}</h4>
                    <Badge variant={voice.is_premium ? "default" : "secondary"}>
                      {voice.is_premium ? "Premium" : "Gratuita"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{voice.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {voice.language} • {voice.gender}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        playVoiceSample(voice.id);
                      }}
                      disabled={playingVoiceId === voice.id}
                    >
                      {playingVoiceId === voice.id ? (
                        <Pause className="w-3 h-3" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center space-x-2 pt-4 border-t border-gray-600">
              <Switch
                id="vision_enabled"
                checked={visionVoiceSettings.enabled}
                onCheckedChange={(checked) => setVisionVoiceSettings({
                  ...visionVoiceSettings,
                  enabled: checked
                })}
              />
              <Label htmlFor="vision_enabled" className="text-white">
                Habilitar voz no Vision Command
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVisionVoiceDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => configureVisionVoice(voices.find(v => v.voice_id === visionVoiceSettings.default_voice_id)?.id)}>
              Salvar Configuração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Voz</DialogTitle>
            <DialogDescription>
              Atualize as informações da voz selecionada
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_voice_name">Nome da Voz</Label>
              <Input
                id="edit_voice_name"
                value={formData.voice_name}
                onChange={(e) => setFormData({...formData, voice_name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit_description">Descrição</Label>
              <Textarea
                id="edit_description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit_price_tokens">Preço (Tokens)</Label>
              <Input
                id="edit_price_tokens"
                type="number"
                value={formData.price_tokens}
                onChange={(e) => setFormData({...formData, price_tokens: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit_is_premium"
                checked={formData.is_premium}
                onCheckedChange={(checked) => setFormData({...formData, is_premium: checked})}
              />
              <Label htmlFor="edit_is_premium">Voz Premium</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={updateVoice}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VoiceManagement;