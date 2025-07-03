import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from '@/lib/UserContext';
import { useVisionContext } from '@/lib/VisionContext';
import { PlayIcon, PauseIcon, CheckIcon, LockClosedIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { ShieldCheckIcon, CurrencyDollarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

/**
 * Componente de seleção de vozes personalizadas
 * Permite ao usuário escolher uma voz para seu Vision Companion
 */
const VoiceSelector = ({ onVoiceSelected, showDialog = false, onClose }) => {
  const { toast } = useToast();
  const supabase = useSupabaseClient();
  const { user, userProfile } = useUser();
  const { currentVision } = useVisionContext();
  const [isOpen, setIsOpen] = useState(showDialog);
  const [loading, setLoading] = useState(true);
  const [voices, setVoices] = useState([]);
  const [standardVoices, setStandardVoices] = useState([]);
  const [premiumVoices, setPremiumVoices] = useState([]);
  const [userVoiceProfile, setUserVoiceProfile] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const [changingVoice, setChangingVoice] = useState(false);
  const audioRef = useRef(null);

  // Carregar vozes disponíveis e perfil do usuário
  useEffect(() => {
    if (isOpen && user) {
      loadVoicesAndProfile();
    }
  }, [isOpen, user, currentVision]);

  // Separar vozes em categorias
  useEffect(() => {
    if (voices.length > 0) {
      setStandardVoices(voices.filter(voice => !voice.is_premium));
      setPremiumVoices(voices.filter(voice => voice.is_premium));
    }
  }, [voices]);

  // Carregar dados necessários
  const loadVoicesAndProfile = async () => {
    setLoading(true);
    try {
      // Carregar vozes disponíveis
      const { data: voicesData, error: voicesError } = await supabase.functions.invoke('voice/available');
      
      if (voicesError) throw voicesError;
      
      setVoices(voicesData || []);
      
      // Carregar perfil de voz do usuário
      const { data: profileData, error: profileError } = await supabase.functions.invoke('voice/profiles/' + user.id, {
        body: { vision_id: currentVision?.id }
      });
      
      if (profileError) throw profileError;
      
      setUserVoiceProfile(profileData);
      setSelectedVoice(profileData?.voice_id || null);
      
    } catch (error) {
      console.error('Erro ao carregar dados de voz:', error);
      toast({
        title: 'Erro ao carregar vozes',
        description: 'Não foi possível carregar as vozes disponíveis.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Reproduzir amostra de voz
  const playVoiceSample = async (voiceId) => {
    if (playingVoiceId === voiceId) {
      // Pausar se já estiver tocando
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingVoiceId(null);
      return;
    }
    
    try {
      setPlayingVoiceId(voiceId);
      
      // Buscar amostra de voz
      const { data, error } = await supabase.functions.invoke('voice/sample/' + voiceId);
      
      if (error) throw error;
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Criar novo elemento de áudio
      const audio = new Audio(`/api${data.audio_url}`);
      audioRef.current = audio;
      
      // Configurar eventos
      audio.onended = () => setPlayingVoiceId(null);
      audio.onerror = () => {
        setPlayingVoiceId(null);
        toast({
          title: 'Erro ao reproduzir',
          description: 'Não foi possível reproduzir a amostra de voz.',
          variant: 'destructive'
        });
      };
      
      // Reproduzir
      await audio.play();
      
    } catch (error) {
      console.error('Erro ao reproduzir amostra:', error);
      setPlayingVoiceId(null);
      toast({
        title: 'Erro na amostra',
        description: 'Não foi possível carregar a amostra de voz.',
        variant: 'destructive'
      });
    }
  };

  // Selecionar e salvar voz
  const selectVoice = async (voiceId) => {
    if (!user || !userVoiceProfile) return;
    
    // Verificar se é a mesma voz atual
    if (userVoiceProfile.voice_id === voiceId) {
      toast({
        title: 'Mesma voz',
        description: 'Você já está usando esta voz.',
      });
      return;
    }
    
    // Verificar se pode trocar de voz
    if (!userVoiceProfile.can_change_voice) {
      // Verificar se é voz premium
      const isPremium = voices.find(v => v.voice_id === voiceId)?.is_premium;
      
      if (isPremium) {
        // Mostrar diálogo de compra
        showPurchaseDialog(voiceId);
        return;
      }
      
      toast({
        title: 'Troca não permitida',
        description: 'Você já trocou sua voz. Deseja comprar uma nova?',
        action: (
          <Button variant="outline" onClick={() => showPurchaseDialog(voiceId)}>
            Comprar
          </Button>
        )
      });
      return;
    }
    
    // Confirmar troca
    if (window.confirm(`Deseja realmente trocar para esta voz? Você só pode trocar gratuitamente ${userVoiceProfile.voice_changes_count === 0 ? 'uma vez' : 'mais uma vez'}.`)) {
      setChangingVoice(true);
      
      try {
        // Chamar API para trocar voz
        const { data, error } = await supabase.functions.invoke('voice/change', {
          body: {
            user_id: user.id,
            vision_id: currentVision?.id,
            new_voice_id: voiceId,
            tokens_spent: 0
          }
        });
        
        if (error) throw error;
        
        setUserVoiceProfile(data);
        setSelectedVoice(voiceId);
        
        // Notificar componente pai
        if (onVoiceSelected) {
          onVoiceSelected(voiceId);
        }
        
        toast({
          title: 'Voz alterada',
          description: 'Sua voz foi alterada com sucesso!',
          variant: 'default'
        });
        
        // Fechar diálogo após troca bem-sucedida
        setTimeout(() => setIsOpen(false), 1500);
        
      } catch (error) {
        console.error('Erro ao trocar voz:', error);
        toast({
          title: 'Erro ao trocar voz',
          description: error.message || 'Não foi possível trocar sua voz.',
          variant: 'destructive'
        });
      } finally {
        setChangingVoice(false);
      }
    }
  };

  // Mostrar diálogo de compra
  const showPurchaseDialog = (voiceId) => {
    const voice = voices.find(v => v.voice_id === voiceId);
    const tokensRequired = voice?.price_tokens || 100;
    
    if (userProfile.tokens < tokensRequired) {
      toast({
        title: 'Tokens insuficientes',
        description: `Você precisa de ${tokensRequired} tokens para desbloquear esta voz.`,
        action: (
          <Button variant="outline" onClick={() => window.location.href = '/marketplace'}>
            Comprar tokens
          </Button>
        )
      });
      return;
    }
    
    if (window.confirm(`Deseja comprar a voz "${voice?.voice_name}" por ${tokensRequired} tokens?`)) {
      purchaseVoice(voiceId, tokensRequired);
    }
  };

  // Comprar voz com tokens
  const purchaseVoice = async (voiceId, tokensSpent) => {
    setChangingVoice(true);
    
    try {
      // Chamar API para trocar voz com tokens
      const { data, error } = await supabase.functions.invoke('voice/change', {
        body: {
          user_id: user.id,
          vision_id: currentVision?.id,
          new_voice_id: voiceId,
          tokens_spent: tokensSpent
        }
      });
      
      if (error) throw error;
      
      setUserVoiceProfile(data);
      setSelectedVoice(voiceId);
      
      // Notificar componente pai
      if (onVoiceSelected) {
        onVoiceSelected(voiceId);
      }
      
      toast({
        title: 'Voz desbloqueada',
        description: `Você desbloqueou a voz com sucesso! Foram gastos ${tokensSpent} tokens.`,
        variant: 'default'
      });
      
      // Fechar diálogo após compra bem-sucedida
      setTimeout(() => setIsOpen(false), 1500);
      
    } catch (error) {
      console.error('Erro ao comprar voz:', error);
      toast({
        title: 'Erro na compra',
        description: error.message || 'Não foi possível comprar esta voz.',
        variant: 'destructive'
      });
    } finally {
      setChangingVoice(false);
    }
  };

  // Renderizar card de voz
  const renderVoiceCard = (voice) => {
    const isSelected = selectedVoice === voice.voice_id;
    const isPlaying = playingVoiceId === voice.voice_id;
    const isPremium = voice.is_premium;
    const canSelect = userVoiceProfile?.can_change_voice || userVoiceProfile?.voice_id === voice.voice_id;
    
    return (
      <Card 
        key={voice.voice_id}
        className={`relative overflow-hidden transition-all ${isSelected ? 'border-primary' : 'border-border'} ${canSelect ? 'hover:border-primary/70' : 'opacity-80'}`}
      >
        {isPremium && (
          <div className="absolute top-0 right-0 bg-amber-500 text-white px-2 py-1 text-xs font-bold rounded-bl-md flex items-center gap-1">
            <SparklesIcon className="h-3 w-3" />
            Premium
          </div>
        )}
        
        {isSelected && (
          <div className="absolute top-2 left-2 bg-primary text-white p-1 rounded-full">
            <CheckIcon className="h-4 w-4" />
          </div>
        )}
        
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            {voice.voice_name}
            {!canSelect && <LockClosedIcon className="h-4 w-4 text-muted-foreground" />}
          </CardTitle>
          <CardDescription className="text-xs">
            {voice.gender && (
              <Badge variant="outline" className="mr-1 text-xs">
                {voice.gender}
              </Badge>
            )}
            {voice.age_range && (
              <Badge variant="outline" className="mr-1 text-xs">
                {voice.age_range}
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-sm pb-2">
          <p className="line-clamp-2 text-muted-foreground text-xs">
            {voice.description || 'Voz personalizada para seu Vision Companion.'}
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-8 w-8"
            onClick={() => playVoiceSample(voice.voice_id)}
          >
            {isPlaying ? (
              <PauseIcon className="h-4 w-4" />
            ) : (
              <PlayIcon className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant={isSelected ? "secondary" : "outline"}
            size="sm"
            disabled={isSelected || changingVoice || (!canSelect && !isPremium)}
            onClick={() => selectVoice(voice.voice_id)}
          >
            {isSelected ? 'Selecionada' : isPremium && !canSelect ? `${voice.price_tokens || 100} tokens` : 'Selecionar'}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Renderizar estado de carregamento
  const renderLoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(i => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-16 mt-1" />
          </CardHeader>
          <CardContent className="pb-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4 mt-1" />
          </CardContent>
          <CardFooter className="flex justify-between pt-0">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-20" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  // Renderizar informações do perfil de voz
  const renderVoiceProfileInfo = () => {
    if (!userVoiceProfile) return null;
    
    return (
      <div className="bg-muted/50 p-3 rounded-lg mb-4 text-sm">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Seu perfil de voz</h4>
            <p className="text-xs text-muted-foreground">
              {userVoiceProfile.can_change_voice 
                ? `Você pode trocar de voz ${userVoiceProfile.voice_changes_count === 0 ? 'uma vez' : 'mais uma vez'} gratuitamente.`
                : 'Você já utilizou sua troca gratuita de voz.'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {userVoiceProfile.can_change_voice ? (
              <Badge variant="outline" className="flex items-center gap-1">
                <ShieldCheckIcon className="h-3 w-3" />
                Troca disponível
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1 bg-muted">
                <CurrencyDollarIcon className="h-3 w-3" />
                Compra necessária
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open && onClose) onClose();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <SparklesIcon className="h-4 w-4" />
          Personalizar Voz
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Escolha a voz do seu Vision Companion</DialogTitle>
          <DialogDescription>
            Personalize a experiência com seu Vision escolhendo uma voz que combine com sua personalidade.
          </DialogDescription>
        </DialogHeader>
        
        {renderVoiceProfileInfo()}
        
        {loading ? (
          renderLoadingState()
        ) : (
          <Tabs defaultValue="standard" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="standard">Vozes Padrão ({standardVoices.length})</TabsTrigger>
              <TabsTrigger value="premium">Vozes Premium ({premiumVoices.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="standard" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {standardVoices.map(renderVoiceCard)}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="premium" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {premiumVoices.map(renderVoiceCard)}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
        
        <DialogFooter className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm"
            disabled={loading || changingVoice}
            onClick={loadVoicesAndProfile}
            className="gap-1"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Atualizar
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => setIsOpen(false)}
            disabled={changingVoice}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceSelector;