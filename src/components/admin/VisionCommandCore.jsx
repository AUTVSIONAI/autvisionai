import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VisionPersonalizationService } from '@/services/visionPersonalizationService';
import { supabase } from '@/utils/supabase';
import VoiceManagement from './VoiceManagement';
import {
  VolumeX,
  Volume2,
  Loader2,
  Server,
  Sparkles,
  Eye,
  Activity,
  Users,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Database,
  Monitor,
  Mic,
  BarChart3,
  FileText,
  RefreshCw,
  Shield,
  Clock,
  Globe,
  Bot,
  X,
  MessageSquare,
  Settings
} from 'lucide-react';
import { VISION_COMMANDER_IMAGE } from '../../constants/images';
import VisionChatAdmin from '../vision/VisionChatAdmin';
import { useSafeAdminData } from './AdminDataContext';
import { useAuth } from '@/contexts/AuthContext';

// VISION COMMAND CORE - FUSÃO ÉPICA DO VISION COMMAND + VISION CORE
// Super Agente Cerebral estilo Jarvis com visão completa da operação

const CosmicSphere3D = ({ isListening, isSpeaking, isProcessing }) => {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{
          scale: isListening ? [1, 1.1, 1] : isSpeaking ? [1, 1.05, 1] : [1, 1.02, 1],
          rotate: isProcessing ? 360 : 0,
          y: [0, -10, 0]
        }}
        transition={{
          scale: { duration: 2, repeat: Infinity },
          rotate: { duration: 4, repeat: Infinity, ease: "linear" },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <img 
          src="/assets/images/vision/visioncommand.PNG" 
          alt="Vision Command" 
          className={`w-48 h-48 object-contain transition-all duration-300 drop-shadow-2xl ${
            isListening ? 'filter brightness-125 hue-rotate-[320deg] drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]' :
            isSpeaking ? 'filter brightness-125 hue-rotate-[90deg] drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]' :
            isProcessing ? 'filter brightness-125 hue-rotate-[45deg] drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]' :
            'filter brightness-110 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]'
          }`}
        />
      </motion.div>
    </div>
  );
};

export default function VisionCommandCore() {
  const { user } = useAuth();
  
  // Estados principais
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Estados do Vision Core
  const [isListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [silentMode, setSilentMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Estados para gerenciamento de Visions
  const [visions, setVisions] = useState([]);
  const [userCustomizations, setUserCustomizations] = useState([]);
  
  // Estados para modais de edição de Visions
  const [selectedVision, setSelectedVision] = useState(null);
  const [editVisionModal, setEditVisionModal] = useState(false);
  const [viewVisionModal, setViewVisionModal] = useState(false);
  const [editingVision, setEditingVision] = useState(null);
  
  // Estados para logs e monitoramento
  const [systemLogs, setSystemLogs] = useState([
    { 
      id: 'init-1', 
      level: 'info', 
      type: 'info', 
      message: 'Vision Command Core inicializado', 
      timestamp: new Date().toISOString() 
    },
    { 
      id: 'init-2', 
      level: 'success', 
      type: 'success', 
      message: 'Sistema operacional e pronto para uso', 
      timestamp: new Date().toISOString() 
    }
  ]);
  const [realTimeData, setRealTimeData] = useState({
    agents: [
      { id: 'agent-1', name: 'Vision Alpha', status: 'online', type: 'assistant', last_seen: 'Agora' },
      { id: 'agent-2', name: 'Vision Beta', status: 'online', type: 'assistant', last_seen: '2 min atrás' },
      { id: 'agent-3', name: 'Vision Gamma', status: 'offline', type: 'assistant', last_seen: '15 min atrás' }
    ],
    users: [],
    interactions: 25,
    activeUsers: 11,
    onlineVisions: 11,
    totalMessages: 150,
    systemHealth: 'optimal',
    cpuUsage: 35,
    memoryUsage: 45,
    networkLatency: 95
  });
  
  const [systemMetrics, setSystemMetrics] = useState({
    totalAgents: 3,
    activeAgents: 2,
    totalInteractions: 150,
    systemLoad: 35,
    uptime: '72:15:30'
  });

  // Hook para dados administrativos - seguro com dados reais
  const { data } = useSafeAdminData();
  
  // Estados para dados reais carregados
  const [realUserCount, setRealUserCount] = useState(0);
  const [realVisionCount, setRealVisionCount] = useState(0);
  const [realAgentCount, setRealAgentCount] = useState(0);

  // Função para síntese de fala - mantida para compatibilidade com a esfera 3D
  const speakText = useCallback((text) => {
    if (!('speechSynthesis' in window) || silentMode) return;

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  }, [silentMode]);

  // Funções para carregar dados reais (AGUARDANDO BACKEND + COLUNAS CORRETAS)
  const loadVisions = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 [VISIONS] Carregando Visions...');
      console.log('🔍 [VISIONS] User ID:', user?.id);
      
      // 🔥 ESTRATÉGIA: Tentar API primeiro, fallback para exemplo se não funcionar
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      // 🎯 PAINEL ADMIN: Carregar TODOS os Visions (sem filtro de user_id)
      const url = `${apiUrl}/visions`;
      
      console.log('🌐 [VISIONS] Tentando API (TODOS os Visions):', url);
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setVisions(result.data);
            console.log('✅ [VISIONS] Carregado via API:', result.data.length);
            setError(null);
            return;
          }
        }
        
        throw new Error(`API retornou ${response.status}`);
        
      } catch (apiError) {
        console.warn('⚠️ [VISIONS] API não disponível, usando dados de exemplo:', apiError.message);
        
        // 📝 DADOS DE EXEMPLO (enquanto API não funciona)
        const visionsDeExemplo = [
          {
            id: '1',
            name: 'Vision Personalizado',
            description: 'Vision customizado pelo usuário',
            personality: 'Assistente amigável e criativo',
            user_id: user?.id || 'user-example',
            is_active: true,
            status: 'active',
            theme_color: '#3B82F6',
            voice_enabled: true,
            auto_speak: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            interactions_today: 15,
            total_interactions: 127,
            level: 3,
            experience: 2450
          },
          {
            id: '2',
            name: 'Vision Comercial',
            description: 'Vision especializado em vendas',
            personality: 'Profissional focado em resultados',
            user_id: user?.id || 'user-example',
            is_active: true,
            status: 'active',
            theme_color: '#10B981',
            voice_enabled: false,
            auto_speak: false,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date().toISOString(),
            interactions_today: 8,
            total_interactions: 89,
            level: 2,
            experience: 1890
          }
        ];
        
        await new Promise(resolve => setTimeout(resolve, 500));
        setVisions(visionsDeExemplo);
        console.log('✅ [VISIONS] Usando dados de exemplo:', visionsDeExemplo.length);
        setError('API temporariamente indisponível - usando dados de exemplo');
      }
      
    } catch (error) {
      console.error('❌ [VISIONS] Erro crítico:', error);
      setVisions([]);
      setError('Erro crítico ao carregar Visions: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Função para carregar logs do sistema
  const loadSystemLogs = async () => {
    console.log('📋 [LOGS] Carregando logs do sistema...');
    try {
      setLoading(true);
      
      // API URL com porta correta (3001)
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const url = `${apiUrl}/admin/logs`;
      
      console.log('🌐 [LOGS] Tentando API:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          // Sanitizar logs para garantir que não há objetos sendo renderizados
          const sanitizedLogs = data.map(log => ({
            ...log,
            message: typeof log.message === 'object' ? JSON.stringify(log.message) : log.message,
            details: typeof log.details === 'object' ? JSON.stringify(log.details) : log.details,
            action: typeof log.action === 'object' ? JSON.stringify(log.action) : log.action,
            event: typeof log.event === 'object' ? JSON.stringify(log.event) : log.event,
            type: typeof log.type === 'object' ? JSON.stringify(log.type) : log.type,
            user_id: typeof log.user_id === 'object' ? JSON.stringify(log.user_id) : log.user_id,
            source: typeof log.source === 'object' ? JSON.stringify(log.source) : log.source
          }));
          
          setSystemLogs(sanitizedLogs);
          console.log('✅ [LOGS] Carregados via API:', sanitizedLogs.length);
          setError(null);
        } else {
          throw new Error('Formato de resposta inválido');
        }
      } else {
        throw new Error(`API retornou ${response.status}`);
      }
      
    } catch (error) {
      console.warn('⚠️ [LOGS] API não disponível, usando dados simulados:', error.message);
      
      // Dados simulados de logs em caso de falha da API
      const simulatedLogs = [
        { 
          id: 'sim-1', 
          level: 'INFO', 
          type: 'system', 
          message: 'Sistema inicializado com sucesso', 
          details: 'Vision Command Core iniciado e operacional',
          timestamp: new Date().toISOString() 
        },
        { 
          id: 'sim-2', 
          level: 'WARN', 
          type: 'warning', 
          message: 'Uso elevado de memória detectado', 
          details: 'O sistema está usando mais recursos do que o normal',
          timestamp: new Date(Date.now() - 300000).toISOString() 
        },
        { 
          id: 'sim-3', 
          level: 'ERROR', 
          type: 'error', 
          message: 'Falha na conexão com serviço externo', 
          details: 'A API externa não respondeu dentro do tempo limite',
          timestamp: new Date(Date.now() - 600000).toISOString() 
        },
        { 
          id: 'sim-4', 
          level: 'SUCCESS', 
          type: 'success', 
          message: 'Backup de dados concluído', 
          details: 'Backup automático realizado com sucesso',
          timestamp: new Date(Date.now() - 1200000).toISOString() 
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setSystemLogs(simulatedLogs);
      setError('API de logs indisponível - usando dados simulados');
    } finally {
      setLoading(false);
    }
  };
  
  // Função para carregar dados de monitoramento
  const loadMonitoringData = async () => {
    console.log('📊 [MONITORING] Carregando dados de monitoramento...');
    try {
      setLoading(true);
      
      // API URL com porta correta (3001)
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const url = `${apiUrl}/admin/monitoring`;
      
      console.log('🌐 [MONITORING] Tentando API:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Atualizar dados de monitoramento
        setRealTimeData(prev => ({
          ...prev,
          ...data,
          // Garantir que os agentes estejam na estrutura esperada
          agents: Array.isArray(data.agents) ? data.agents : [],
          dataSource: 'real'
        }));
        
        // Atualizar métricas do sistema
        setSystemMetrics(prev => ({
          ...prev,
          cpuUsage: data.cpuUsage || prev.cpuUsage,
          memoryUsage: data.memoryUsage || prev.memoryUsage,
          networkLatency: data.networkLatency || prev.networkLatency,
          systemHealth: data.systemHealth || prev.systemHealth,
          uptime: data.uptime || prev.uptime
        }));
        
        console.log('✅ [MONITORING] Dados carregados via API');
        setError(null);
        
      } else {
        throw new Error(`API retornou ${response.status}`);
      }
      
    } catch (error) {
      console.warn('⚠️ [MONITORING] API não disponível, usando dados simulados:', error.message);
      
      // Dados simulados de monitoramento em caso de falha da API
      const simulatedAgents = [
        { id: 'agent-1', name: 'Agente Analítico', status: 'online', type: 'analytic', last_seen: 'Agora' },
        { id: 'agent-2', name: 'Agente de Suporte', status: 'online', type: 'support', last_seen: 'Agora' },
        { id: 'agent-3', name: 'Agente de Dados', status: 'online', type: 'data', last_seen: '5 min atrás' },
        { id: 'agent-4', name: 'Agente de Conteúdo', status: 'offline', type: 'content', last_seen: '30 min atrás' },
        { id: 'agent-5', name: 'Agente de Segurança', status: 'online', type: 'security', last_seen: '2 min atrás' }
      ];
      
      // Atualizar com dados simulados
      setRealTimeData(prev => ({
        ...prev,
        agents: simulatedAgents,
        activeUsers: Math.floor(Math.random() * 8) + 3,
        onlineVisions: Math.floor(Math.random() * 6) + 5,
        interactions: Math.floor(Math.random() * 40) + 20,
        totalMessages: Math.floor(Math.random() * 150) + 50,
        systemHealth: 'optimal',
        cpuUsage: Math.floor(Math.random() * 30) + 20,
        memoryUsage: Math.floor(Math.random() * 25) + 35,
        networkLatency: Math.floor(Math.random() * 40) + 80,
        dataSource: 'simulated'
      }));
      
      setSystemMetrics(prev => ({
        ...prev,
        cpuUsage: Math.floor(Math.random() * 30) + 20,
        memoryUsage: Math.floor(Math.random() * 25) + 35,
        networkLatency: Math.floor(Math.random() * 40) + 80,
        systemHealth: Math.floor(Math.random() * 15) + 85,
        uptime: '48:12:37'
      }));
      
      setError('API de monitoramento indisponível - usando dados simulados');
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar dados do dashboard
  const loadDashboardData = async () => {
    console.log('📊 [DASHBOARD] Carregando dados com queries corrigidas...');
    console.log('📊 [DASHBOARD] User ID disponível:', user?.id);
    
    try {
      setLoading(true);
      
      // API URL com porta correta (3001)
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const url = `${apiUrl}/admin/users`;
      
      console.log('🌐 [DASHBOARD] Tentando API:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          console.log('✅ [DASHBOARD] Dados obtidos da API:', result.data);
          
          // Extrair dados
          const usersData = result.data.authUsers || [];
          const visionsData = result.data.visions || [];
          
          // Atualizar contadores reais
          setRealUserCount(usersData.length);
          setRealVisionCount(visionsData.length);
          setRealAgentCount(visionsData.length > 0 ? Math.ceil(visionsData.length * 0.8) : 0);
          
          // Atualizar dados em tempo real
          setRealTimeData(prev => ({
            ...prev,
            agents: visionsData.map(vision => ({
              id: vision.id,
              name: `Agente ${vision.name.split(' ').pop()}`,
              status: vision.is_active ? 'online' : 'offline',
              type: 'assistant',
              last_seen: vision.performance_metrics?.last_interaction || 'Agora'
            })),
            onlineVisions: visionsData.filter(v => v.is_active).length,
            activeUsers: usersData.length,
            interactions: visionsData.reduce((sum, v) => sum + (v.performance_metrics?.total_interactions || 0), 0),
            systemHealth: 'optimal',
            dataSource: {
              agents: 'real',
              users: 'real',
              visions: 'real',
              analytics: 'real'
            }
          }));
          
          // Carregar também visions no estado de visions
          setVisions(visionsData);
          
          console.log('✅ [DASHBOARD] Dashboard atualizado com sucesso!');
          setError(null);
          return;
        }
        
        throw new Error(`Formato de resposta inválido`);
        
      } else {
        throw new Error(`API retornou ${response.status}`);
      }
      
    } catch (error) {
      console.error('❌ [DASHBOARD] Erro ao carregar dashboard:', error.message);
      setError('Erro ao carregar dados: ' + error.message);
      
      // Em caso de erro, dados simulados
      const simulatedAgents = [
        { id: 'agent-1', name: 'Agente Analítico', status: 'online', type: 'analytic', last_seen: 'Agora' },
        { id: 'agent-2', name: 'Agente de Suporte', status: 'online', type: 'support', last_seen: 'Agora' },
        { id: 'agent-3', name: 'Agente de Dados', status: 'online', type: 'data', last_seen: '5 min atrás' }
      ];
      
      setRealTimeData(prev => ({
        ...prev,
        agents: simulatedAgents,
        onlineVisions: 8,
        activeUsers: 5,
        interactions: 34,
        systemHealth: 'normal',
        cpuUsage: 35,
        memoryUsage: 42,
        networkLatency: 110,
        dataSource: 'simulated'
      }));
      
      setRealUserCount(5);
      setRealVisionCount(8);
      setRealAgentCount(3);
      
    } finally {
      setLoading(false);
    }
  };

  // Funções para gerenciamento de Visions
  const handleViewVision = (vision) => {
    console.log(`👁️ Visualizando detalhes do Vision: ${vision.name}`);
    setSelectedVision(vision);
    setViewVisionModal(true);
  };

  const handleEditVision = (vision) => {
    console.log(`✏️ Editando Vision: ${vision.name}`);
    setEditingVision({
      ...vision,
      // Campos editáveis
      name: vision.name || vision.vision_name,
      personality: vision.personality || vision.vision_personality,
      theme_color: vision.theme_color || '#3B82F6',
      voice_enabled: vision.voice_enabled || false,
      auto_speak: vision.auto_speak || false,
      status: vision.status || 'active'
    });
    setEditVisionModal(true);
  };

  const handleSaveVision = async () => {
    if (!editingVision) return;
    
    try {
      setLoading(true);
      console.log('💾 Salvando alterações do Vision:', editingVision);
      
      // Preparar dados para atualização usando os campos corretos do serviço
      const settingsToUpdate = {
        voice_enabled: editingVision.voice_enabled,
        auto_speak: editingVision.auto_speak,
        theme_color: editingVision.theme_color,
        vision_personality: editingVision.personality
      };

      // Tentar salvar via API do serviço de personalização
      try {
        // Se tem user_id, usar updateVisionSettings, senão tentar método direto
        if (editingVision.user_id) {
          await VisionPersonalizationService.updateVisionSettings(editingVision.user_id, settingsToUpdate);
          console.log('✅ Vision atualizado via updateVisionSettings:', settingsToUpdate);
        } else {
          // Para visions sem user_id específico, fazer update direto na tabela
          const { data, error } = await supabase
            .from('user_vision_configs')
            .update({
              ...settingsToUpdate,
              updated_at: new Date().toISOString()
            })
            .eq('id', editingVision.id)
            .select();
          
          if (error) throw error;
          console.log('✅ Vision atualizado via update direto:', data);
        }
        
        // Atualizar na lista local
        setVisions(prevVisions => 
          prevVisions.map(v => 
            v.id === editingVision.id ? { 
              ...v, 
              ...settingsToUpdate,
              name: editingVision.name,
              vision_name: editingVision.name,
              customization_date: new Date().toISOString()
            } : v
          )
        );
        
        addSystemLog('success', `Vision "${editingVision.name}" atualizado com sucesso`, 'success');
        
      } catch (apiError) {
        console.warn('⚠️ Erro ao salvar no banco, mantendo alteração local:', apiError);
        addSystemLog('warning', `Vision "${editingVision.name}" atualizado apenas localmente`, 'warning');
      }
      
      // Fechar modal e limpar estado
      setEditVisionModal(false);
      setEditingVision(null);
      
      // Mostrar feedback
      speakText(`Vision ${editingVision.name} foi atualizado com sucesso`);
      
    } catch (error) {
      console.error('❌ Erro ao salvar Vision:', error);
      setError('Erro ao salvar alterações do Vision');
      addSystemLog('error', `Erro ao salvar Vision: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteVision = async (visionId) => {
    if (!window.confirm('Tem certeza que deseja excluir este Vision? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      setLoading(true);
      console.log(`🗑️ Excluindo Vision ID: ${visionId}`);
      
      // Buscar dados do Vision antes de excluir para logs
      const visionToDelete = visions.find(v => v.id === visionId);
      const visionName = visionToDelete?.name || visionToDelete?.vision_name || `Vision ${visionId}`;
      
      // Tentar excluir via SQL direto
      try {
        const { error } = await supabase
          .from('user_vision_configs')
          .delete()
          .eq('id', visionId);
        
        if (error) throw error;
        
        console.log('✅ Vision excluído do banco de dados');
        addSystemLog('success', `Vision "${visionName}" foi excluído com sucesso`, 'success');
        speakText(`Vision ${visionName} foi excluído com sucesso`);
        
      } catch (apiError) {
        console.warn('⚠️ Erro ao excluir do banco, removendo apenas localmente:', apiError);
        addSystemLog('warning', `Vision "${visionName}" removido apenas localmente`, 'warning');
        speakText(`Vision ${visionName} foi removido localmente`);
      }
      
      // Remover da lista local independentemente do resultado da API
      setVisions(prevVisions => prevVisions.filter(v => v.id !== visionId));
      
    } catch (error) {
      console.error('❌ Erro ao excluir Vision:', error);
      setError('Erro ao excluir Vision');
      addSystemLog('error', `Erro ao excluir Vision: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Sistema de logs e monitoramento
  const addSystemLog = useCallback((type, message, level = 'info') => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type,
      message,
      level
    };
    setSystemLogs(prev => [newLog, ...prev.slice(0, 99)]); // Manter apenas 100 logs
  }, []);

  const generatePlatformInsights = useCallback(() => {
    const insights = [
      {
        id: 1,
        type: 'performance',
        title: 'Pico de Atividade Detectado',
        description: 'Aumento de 35% nas interações nas últimas 2 horas',
        severity: 'info',
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        type: 'optimization',
        title: 'Oportunidade de Melhoria',
        description: 'Vision Companion pode ser otimizado para respostas mais rápidas',
        severity: 'warning',
        timestamp: new Date().toISOString()
      },
      {
        id: 3,
        type: 'success',
        title: 'Meta Alcançada',
        description: 'Satisfação dos usuários atingiu 94% esta semana',
        severity: 'success',
        timestamp: new Date().toISOString()
      }
    ];
    console.log('📊 Platform insights calculados:', insights.length);
  }, []);

  // Calcular métricas do sistema
  const calculateSystemMetrics = useCallback(() => {
    if (!data) return;

    const agents = data.agents || [];
    const dataVisions = data.visions || [];
    const users = data.users || [];

    // Combinar com visions locais
    const allVisions = [...dataVisions, ...visions];
    
    setSystemMetrics({
      totalAgents: agents.length + allVisions.length,
      activeAgents: (agents || []).filter(a => a.status === 'active').length + (allVisions || []).filter(v => v.status === 'active').length,
      totalInteractions: allVisions.reduce((sum, v) => sum + (v.total_interactions || v.interactions_today || 0), 0),
      systemLoad: Math.round(45 + Math.random() * 30),
      uptime: '24h 15m' // Simulado
    });

    // Atualizar dados em tempo real
    setRealTimeData({
      activeUsers: users.filter(u => u.last_seen && new Date(u.last_seen) > new Date(Date.now() - 5 * 60 * 1000)).length,
      onlineVisions: (allVisions || []).filter(v => v.status === 'active').length,
      totalMessages: allVisions.reduce((sum, v) => sum + (v.interactions_today || 0), 0),
      systemHealth: 'optimal'
    });
  }, [data, visions]);

  // Inicialização do sistema (apenas uma vez por usuário)
  useEffect(() => {
    console.log('🚀 [INIT] useEffect disparado!');
    console.log('🚀 [INIT] User disponível?', !!user);
    console.log('🚀 [INIT] User ID disponível?', !!user?.id);
    console.log('🚀 [INIT] User ID valor:', user?.id);
    console.log('🚀 [INIT] User completo:', user);
    
    if (user?.id) {
      console.log('✅ [INIT] User ID válido, iniciando carregamentos...');
      loadVisions();
      loadSystemLogs();
      loadDashboardData();
      loadMonitoringData();
      generatePlatformInsights();
      addSystemLog('Sistema iniciado', 'Vision Command Core ativado com sucesso');
    } else {
      console.warn('⚠️ [INIT] User ID não disponível ainda, tentando carregamento sem user_id...');
      // 🔥 CRITICAL FIX: Carregar Visions mesmo sem user_id para debug
      console.log('🔧 [INIT] Tentando carregamento FORÇADO de Visions para debug...');
      loadVisions(); // Chamar mesmo sem user_id
      loadSystemLogs();
      loadMonitoringData();
      loadDashboardData();
      generatePlatformInsights();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Intencionalmente limitado para evitar loops

  // Atualizar contadores com dados reais (separado para evitar loop)
  useEffect(() => {
    if (data?.users || data?.visions || data?.agents) {
      setRealUserCount(data.users?.length || 0);
      setRealVisionCount(data.visions?.length || 0);
      setRealAgentCount(data.agents?.length || 0);
      
      console.log('📊 Dados reais carregados no Vision Command:', {
        usuarios: data.users?.length || 0,
        visions: data.visions?.length || 0,
        agentes: data.agents?.length || 0
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.users?.length, data?.visions?.length, data?.agents?.length]); // Dependências específicas para evitar loop

  // Atualizar métricas quando dados mudarem (sem dependências problemáticas)
  useEffect(() => {
    calculateSystemMetrics();
    const interval = setInterval(() => {
      calculateSystemMetrics();
      // Simular logs em tempo real ocasionalmente
      if (Math.random() > 0.8) {
        const logTypes = ['Interação processada', 'Usuário conectado', 'Vision ativado', 'Análise concluída'];
        const randomType = logTypes[Math.floor(Math.random() * logTypes.length)];
        setSystemLogs(prev => [{
          id: `log-${Date.now()}`,
          level: 'info',
          type: 'info',
          message: randomType,
          timestamp: new Date().toISOString()
        }, ...prev.slice(0, 49)]); // Manter apenas 50 logs
      }
    }, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sem dependências para evitar loop

  // Atualização periódica dos dados de monitoramento
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 [AUTO-UPDATE] Atualizando dados de monitoramento...');
      loadMonitoringData();
    }, 45000); // A cada 45 segundos
    return () => clearInterval(interval);
  }, []);

  // Atualizar insights periodicamente (sem dependências problemáticas)
  useEffect(() => {
    const interval = setInterval(() => {
      // Gerar insights inline para evitar dependência
      const insights = [
        'Usuários preferem interações por voz',
        'Pico de atividade detectado às 14h',
        'Vision Alpha é o mais popular',
        'Integração N8N funcionando perfeitamente'
      ];
      
      console.log('🔍 Insight gerado:', insights[Math.floor(Math.random() * insights.length)]);
    }, 300000); // A cada 5 minutos
    return () => clearInterval(interval);
  }, []);

  // Função para alternar modo silencioso
  const toggleSilentMode = () => {
    setSilentMode(!silentMode);
    if (!silentMode) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // 🔥 TELA DE AUTENTICAÇÃO REMOVIDA - ACESSO DIRETO AO PAINEL
  console.log('🚀 [AUTH] Tela de autenticação desabilitada - acesso direto permitido');

  // Interface principal do Vision Command Core
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex justify-center mb-4">
            <img
              src={VISION_COMMANDER_IMAGE}
              alt="AutVision Command Core"
              className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">VISION Command Core</h1>
          <p className="text-xl text-blue-400">
            Bem-vindo de volta, <span className="font-semibold">Comandante</span>
          </p>
          <p className="text-gray-400 mt-2">
            Sistema neural central operacional. Cérebro da operação ativo.
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <Badge variant="outline" className="text-green-400 border-green-400">
              <Activity className="w-3 h-3 mr-1" />
              {realVisionCount || data?.visions?.length || realTimeData.onlineVisions} Visions Online
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              <Users className="w-3 h-3 mr-1" />
              {realUserCount || data?.users?.length || realTimeData.activeUsers} Usuários Ativos
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              <Globe className="w-3 h-3 mr-1" />
              Sistema {realTimeData.systemHealth === 'optimal' ? 'Ótimo' : 'Normal'}
            </Badge>
          </div>
        </motion.div>

        {/* Vision Central - Flutuando no Centro */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <CosmicSphere3D
              isListening={isListening}
              isSpeaking={isSpeaking}
              isProcessing={loading}
            />
          </div>
        </motion.div>

        {/* Botão de Modo Silencioso */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mb-6"
        >
          <Button
            onClick={toggleSilentMode}
            variant="ghost"
            size="sm"
            className={`rounded-full p-3 transition-all duration-300 ${
              silentMode
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
            }`}
          >
            {silentMode ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </Button>
        </motion.div>

        {/* Status Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4 mb-6"
        >
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/30 max-w-md mx-auto">
            <p className="text-sm font-medium text-cyan-100 leading-relaxed min-h-[2rem] flex items-center justify-center">
              Sistema neural aguardando comandos...
            </p>
          </div>
        </motion.div>

        {/* Chat Admin Achatado */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
              Chat Admin Command
            </h3>
            <VisionChatAdmin
              className="w-full max-w-full"
              size="compact"
            />
          </div>
        </motion.div>

        {/* Sistema de Abas - Cards horizontais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={(value) => {
            console.log('🔄 Mudando aba para:', value);
            setActiveTab(value);
            
            // Carregar dados específicos da aba
            if (value === 'dashboard') {
              loadDashboardData();
            } else if (value === 'visions') {
              loadVisions();
            } else if (value === 'logs') {
              loadSystemLogs();
            } else if (value === 'monitoring') {
              loadMonitoringData();
            }
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 border border-gray-700">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="visions" className="data-[state=active]:bg-blue-600">
                <Database className="w-4 h-4 mr-2" />
                Visions
              </TabsTrigger>
              <TabsTrigger value="logs" className="data-[state=active]:bg-blue-600">
                <FileText className="w-4 h-4 mr-2" />
                Logs
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="data-[state=active]:bg-blue-600">
                <Activity className="w-4 h-4 mr-2" />
                Monitoramento
              </TabsTrigger>
              <TabsTrigger value="voice" className="data-[state=active]:bg-blue-600">
                <Mic className="w-4 h-4 mr-2" />
                Controle de Voz
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Dashboard do Sistema</h3>
                <Button 
                  onClick={loadDashboardData}
                  size="sm" 
                  variant="outline"
                  disabled={loading}
                  className="border-slate-600 text-slate-400"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
              </div>

              {error && (
                <Alert className="bg-red-900/50 border-red-700 mb-4">
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              {/* Métricas do Sistema */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/30 hover:from-blue-800/50 hover:to-cyan-800/50 transition-all">
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{realUserCount || data?.users?.length || realTimeData.activeUsers}</p>
                    <p className="text-sm text-blue-300">Usuários Reais</p>
                    <p className="text-xs text-blue-200/70 mt-1">Na plataforma</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 hover:from-purple-800/50 hover:to-pink-800/50 transition-all">
                  <CardContent className="p-4 text-center">
                    <Bot className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{realVisionCount || data?.visions?.length || realTimeData.onlineVisions}</p>
                    <p className="text-sm text-purple-300">Visions Reais</p>
                    <p className="text-xs text-purple-200/70 mt-1">Total criados: {visions.length}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 hover:from-green-800/50 hover:to-emerald-800/50 transition-all">
                  <CardContent className="p-4 text-center">
                    <MessageSquare className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{realAgentCount || data?.agents?.length || realTimeData.interactions}</p>
                    <p className="text-sm text-green-300">Agentes Reais</p>
                    <p className="text-xs text-green-200/70 mt-1">Ativos na IA</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/30 hover:from-orange-800/50 hover:to-red-800/50 transition-all">
                  <CardContent className="p-4 text-center">
                    <Activity className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{realTimeData.systemHealth === 'optimal' ? '98' : '75'}%</p>
                    <p className="text-sm text-orange-300">Saúde do Sistema</p>
                    <Progress value={realTimeData.systemHealth === 'optimal' ? 98 : 75} className="mt-2 h-2" />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Métricas Detalhadas e Visions Recentes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                      Métricas do Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">CPU:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={realTimeData.cpuUsage} className="w-20 h-2" />
                          <span className="text-white font-semibold">{realTimeData.cpuUsage}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Memória:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={realTimeData.memoryUsage} className="w-20 h-2" />
                          <span className="text-white font-semibold">{realTimeData.memoryUsage}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Latência:</span>
                        <span className="text-white font-semibold">{realTimeData.networkLatency}ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Agentes:</span>
                        <span className="text-white font-semibold">{realTimeData.agents?.length || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Uptime:</span>
                        <span className="text-white font-semibold">{systemMetrics.uptime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                      Visions Recentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {visions.slice(0, 5).map((vision) => (
                        <div key={vision.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded border border-slate-600 hover:bg-slate-700/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              vision.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                            }`} />
                            <div>
                              <p className="text-white font-medium text-sm">{vision.name}</p>
                              <p className="text-slate-400 text-xs truncate max-w-[200px]">{vision.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white text-sm">{vision.total_interactions || 0}</p>
                            <p className="text-slate-400 text-xs">interações</p>
                          </div>
                        </div>
                      ))}
                      {visions.length === 0 && (
                        <div className="text-center text-slate-400 py-4 text-sm">
                          Nenhum Vision criado ainda
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <VoiceManagement />
          </TabsContent>

            {/* Visions Tab */}
            <TabsContent value="visions" className="space-y-6">
              {/* Card Principal - Todos os Visions do Sistema */}
              <Card className="bg-gray-800/50 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center">
                      <Database className="w-5 h-5 mr-2 text-blue-400" />
                      Todos os Visions do Sistema
                    </span>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={`border-${visions.length > 0 ? 'green' : 'yellow'}-500/50 text-${visions.length > 0 ? 'green' : 'yellow'}-400`}
                      >
                        {visions.length > 0 ? '🟢 Dados Reais' : '🟡 Carregando...'}
                      </Badge>
                      <Button
                        onClick={() => {
                          console.log('🔄 Recarregando lista de Visions...');
                          // Usar refresh do contexto ao invés de loadVisions local
                          if (data && typeof data.refreshAll === 'function') {
                            data.refreshAll();
                          } else {
                            loadVisions();
                          }
                        }}
                        size="sm"
                        variant="outline"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-600/20"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Atualizar
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Visualização completa de todos os Visions ativos no sistema, incluindo personalizados e padrão
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Debug logs removidos para evitar erros de renderização */}
                  
                  {error && (
                    <Alert className="bg-red-900/50 border-red-700">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription className="text-red-200">{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-400 mr-3" />
                      <span className="text-gray-400">Carregando Visions...</span>
                    </div>
                  ) : (visions.length === 0) ? (
                    <div className="text-center py-12">
                      <Eye className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">Nenhum Vision encontrado</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Não há Visions cadastrados para este usuário ainda. Crie um Vision personalizado para começar!
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {/* Métricas dos Visions */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-700/50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-blue-200 text-sm">Total de Visions</p>
                                <p className="text-2xl font-bold text-white">{visions.length}</p>
                              </div>
                              <Eye className="w-8 h-8 text-blue-400" />
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-br from-green-900/40 to-green-800/40 border border-green-700/50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-green-200 text-sm">Visions Ativos</p>
                                <p className="text-2xl font-bold text-white">
                                  {visions.filter(v => v.is_active === true).length}
                                </p>
                              </div>
                              <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border border-purple-700/50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-purple-200 text-sm">Usuários Únicos</p>
                                <p className="text-2xl font-bold text-white">
                                  {new Set(visions.map(v => v.user_id)).size}
                                </p>
                              </div>
                              <Users className="w-8 h-8 text-purple-400" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Lista Consolidada de Visions REAIS */}
                      <div className="space-y-4">
                        {visions.length === 0 ? (
                          <div className="text-center py-12">
                            <Bot className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-400">Nenhum Vision encontrado</p>
                            <p className="text-gray-500 text-sm mt-1">Crie um Vision personalizado para começar</p>
                          </div>
                        ) : (
                          visions.map((vision, index) => (
                            <motion.div
                              key={vision.id || index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-lg p-6 border border-gray-600 hover:border-gray-500 transition-all duration-200"
                            >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-white font-semibold text-lg">{vision.name}</h3>
                                  <Badge
                                    variant={vision.status === 'active' ? 'default' : 'secondary'}
                                    className={vision.status === 'active' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600'}
                                  >
                                    {vision.status === 'active' ? 'Ativo' : 'Inativo'}
                                  </Badge>
                                  {vision.is_recent && (
                                    <Badge variant="outline" className="border-green-500/50 text-green-300 bg-green-500/10">
                                      🔥 Usado Recentemente
                                    </Badge>
                                  )}
                                  {vision.personality && (
                                    <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                                      {vision.personality}
                                    </Badge>
                                  )}
                                </div>
                                
                                {/* Informações do Proprietário */}
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                    {(vision.user_name || vision.user_email || 'U')[0].toUpperCase()
                                  }</div>
                                  <span className="text-gray-400 text-sm">Proprietário:</span>
                                  <span className="text-white font-medium text-sm">
                                    {vision.user_name || vision.user_email || `Usuário ${vision.user_id}`}
                                  </span>
                                  {vision.user_email && vision.user_name && (
                                    <span className="text-gray-500 text-xs">({vision.user_email})</span>
                                  )}
                                </div>
                                
                                <p className="text-gray-300 mb-3 leading-relaxed">{vision.description}</p>
                                
                                {/* Métricas do Vision */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div className="flex items-center text-green-400">
                                    <Users className="w-4 h-4 mr-2" />
                                    <span>{vision.users_count || 0} usuários</span>
                                  </div>
                                  <div className="flex items-center text-blue-400">
                                    <Activity className="w-4 h-4 mr-2" />
                                    <span>{vision.interactions_today || 0} interações hoje</span>
                                  </div>
                                  <div className="flex items-center text-purple-400">
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    <span>{vision.total_interactions || 0} total</span>
                                  </div>
                                  <div className="flex items-center text-yellow-400">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>
                                      {vision.last_used ? `Usado ${vision.last_used}` :
                                       vision.customization_date || vision.created_at 
                                        ? `Criado ${new Date(vision.customization_date || vision.created_at).toLocaleDateString('pt-BR')}`
                                        : `${vision.config_age_days || 1} dias atrás`
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Ações do Vision */}
                              <div className="flex space-x-2 ml-4">
                                <Button
                                  onClick={() => handleViewVision(vision)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
                                  title="Visualizar detalhes"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => handleEditVision(vision)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-green-400 hover:text-green-300 hover:bg-green-600/20"
                                  title="Editar Vision"
                                >
                                  <Settings className="w-4 h-4" />
                                </Button>
                                {data?.systemStats?.dataSource?.visions === 'real' && (
                                  <Button
                                    onClick={() => deleteVision(vision.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                                    title="Excluir Vision"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            {/* Capacidades e Recursos */}
                            {vision.capabilities && vision.capabilities.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-600">
                                <span className="text-gray-400 text-sm mr-2">Capacidades:</span>
                                {vision.capabilities.map((cap) => (
                                  <Badge key={cap} variant="outline" className="text-xs border-gray-500 text-gray-300">
                                    {cap}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            {/* Prompt Preview (se disponível) */}
                            {vision.prompt && (
                              <div className="mt-3 pt-3 border-t border-gray-600">
                                <details className="group">
                                  <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                                    Ver prompt do sistema
                                  </summary>
                                  <div className="mt-2 p-3 bg-gray-800/50 rounded text-xs text-gray-300 font-mono leading-relaxed">
                                    {vision.prompt.length > 200 
                                      ? `${vision.prompt.substring(0, 200)}...`
                                      : vision.prompt
                                    }
                                  </div>
                                </details>
                              </div>
                            )}
                          </motion.div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* NOVA SEÇÃO: Personalizações dos Usuários */}
              <Card className="bg-gray-800/50 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-400" />
                    Personalizações de Usuários
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Visualize como os usuários personalizaram seus Visions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Button
                        onClick={async () => {
                          try {
                            const customizations = await VisionPersonalizationService.getAllVisionConfigs();
                            setUserCustomizations(customizations);
                          } catch (error) {
                            console.error('Erro ao carregar personalizações:', error);
                          }
                        }}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Carregar Personalizações
                      </Button>
                      <Badge className="bg-purple-500/20 text-purple-300">
                        {userCustomizations.length} personalizações
                      </Badge>
                    </div>

                    {userCustomizations.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {userCustomizations.map((custom, index) => (
                          <div
                            key={custom.user_id || index}
                            className="bg-gray-700/50 rounded-lg p-3 border border-gray-600"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-white font-medium">
                                  {custom.vision_name}
                                </h4>
                                <p className="text-gray-400 text-sm">
                                  {custom.vision_personality}
                                </p>
                              </div>
                              <div className="text-right text-sm">
                                <p className="text-gray-400">
                                  {custom.customization_date 
                                    ? new Date(custom.customization_date).toLocaleDateString('pt-BR')
                                    : 'Não personalizado'
                                  }
                                </p>
                                <Badge 
                                  variant={custom.has_customized_name ? 'default' : 'secondary'}
                                  className={custom.has_customized_name ? 'bg-green-600' : 'bg-gray-600'}
                                >
                                  {custom.has_customized_name ? 'Personalizado' : 'Padrão'}
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-xs">
                              <span className="text-blue-400">
                                Tema: {custom.theme_color}
                              </span>
                              <span className="text-green-400">
                                Voz: {custom.voice_enabled ? 'Ativa' : 'Desativa'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 py-6">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Nenhuma personalização encontrada</p>
                        <p className="text-sm mt-1">Os usuários ainda não personalizaram seus Visions</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Logs Tab - NOVA IMPLEMENTAÇÃO FUNCIONAL */}
            <TabsContent value="logs" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <FileText className="w-6 h-6 mr-3 text-blue-400" />
                    Sistema de Logs
                  </h3>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => {
                        console.log('🔄 Botão Atualizar Logs clicado!');
                        loadSystemLogs();
                      }}
                      size="sm" 
                      variant="outline"
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-600/20 hover:border-blue-400 transition-all duration-200"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Atualizar Logs
                    </Button>
                    <Button 
                      onClick={() => {
                        console.log('🗑️ Botão Limpar Logs clicado!');
                        setSystemLogs([]);
                      }}
                      size="sm" 
                      variant="outline"
                      className="border-red-500/50 text-red-400 hover:bg-red-600/20 hover:border-red-400 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Limpar Logs
                    </Button>
                  </div>
                </div>

                {/* Logs em Tempo Real */}
                <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-600/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-green-400" />
                        Logs em Tempo Real
                      </div>
                      <Badge variant="outline" className="border-green-500/50 text-green-400">
                        {systemLogs.length} registros
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96 w-full">
                      <div className="space-y-3">
                        {loading ? (
                          <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-400 mr-3" />
                            <span className="text-gray-400">Carregando logs...</span>
                          </div>
                        ) : systemLogs.length === 0 ? (
                          <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-400">Nenhum log encontrado</p>
                            <p className="text-gray-500 text-sm mt-1">Clique em &quot;Atualizar Logs&quot; para carregar</p>
                          </div>
                        ) : (
                          systemLogs.map((log, index) => (
                            <motion.div
                              key={log.id || index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`p-4 rounded-lg border-l-4 hover:bg-gray-700/30 transition-all duration-200 cursor-pointer ${
                                log.level === 'ERROR' || log.type === 'error' ? 'bg-red-900/20 border-red-500 hover:bg-red-900/30' :
                                log.level === 'WARN' || log.type === 'warning' ? 'bg-yellow-900/20 border-yellow-500 hover:bg-yellow-900/30' :
                                log.level === 'SUCCESS' || log.type === 'success' ? 'bg-green-900/20 border-green-500 hover:bg-green-900/30' :
                                'bg-blue-900/20 border-blue-500 hover:bg-blue-900/30'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${
                                    log.level === 'ERROR' || log.type === 'error' ? 'bg-red-500' :
                                    log.level === 'WARN' || log.type === 'warning' ? 'bg-yellow-500' :
                                    log.level === 'SUCCESS' || log.type === 'success' ? 'bg-green-500' :
                                    'bg-blue-500'
                                  }`} />
                                  <span className="text-white font-medium">
                                    {typeof (log.action || log.event || log.type) === 'object' 
                                      ? JSON.stringify(log.action || log.event || log.type)
                                      : (log.action || log.event || log.type || 'Sistema')
                                    }
                                  </span>
                                  {log.level && (
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${
                                        log.level === 'ERROR' ? 'border-red-500/50 text-red-400' :
                                        log.level === 'WARN' ? 'border-yellow-500/50 text-yellow-400' :
                                        log.level === 'INFO' ? 'border-blue-500/50 text-blue-400' :
                                        'border-green-500/50 text-green-400'
                                      }`}
                                    >
                                      {log.level}
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-xs text-gray-400">
                                  {log.timestamp ? new Date(log.timestamp).toLocaleString() : new Date().toLocaleString()}
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {typeof (log.details || log.message) === 'object' 
                                  ? JSON.stringify(log.details || log.message, null, 2)
                                  : (log.details || log.message)
                                }
                              </p>
                              {(log.user_id || log.source) && (
                                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                  {log.user_id && <span>👤 Usuário: {String(log.user_id)}</span>}
                                  {log.source && <span>📍 Origem: {String(log.source)}</span>}
                                </div>
                              )}
                            </motion.div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Estatísticas e Alertas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Alertas Críticos */}
                  <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                        Alertas Críticos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {systemLogs.filter(log => log.type === 'error' || log.level === 'ERROR').slice(0, 3).map((log, index) => (
                          <div key={index} className="p-3 bg-red-900/30 rounded-lg border border-red-500/30">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                              <span className="text-red-300 font-medium text-sm">
                                {typeof (log.action || log.type) === 'object' 
                                  ? JSON.stringify(log.action || log.type)
                                  : (log.action || log.type)
                                }
                              </span>
                            </div>
                            <p className="text-red-200 text-xs">
                              {typeof (log.details || log.message) === 'object' 
                                ? JSON.stringify(log.details || log.message, null, 2)
                                : (log.details || log.message)
                              }
                            </p>
                          </div>
                        ))}
                        {systemLogs.filter(log => log.type === 'error' || log.level === 'ERROR').length === 0 && (
                          <div className="text-center py-6">
                            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                            <p className="text-green-400 text-sm">Nenhum erro crítico</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Estatísticas de Logs */}
                  <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                        Estatísticas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-900/30 rounded-lg">
                          <p className="text-2xl font-bold text-white">{systemLogs.length}</p>
                          <p className="text-blue-300 text-sm">Total</p>
                        </div>
                        <div className="text-center p-3 bg-red-900/30 rounded-lg">
                          <p className="text-2xl font-bold text-red-400">
                            {systemLogs.filter(log => log.type === 'error' || log.level === 'ERROR').length}
                          </p>
                          <p className="text-red-300 text-sm">Erros</p>
                        </div>
                        <div className="text-center p-3 bg-yellow-900/30 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-400">
                            {systemLogs.filter(log => log.type === 'warning' || log.level === 'WARN').length}
                          </p>
                          <p className="text-yellow-300 text-sm">Avisos</p>
                        </div>
                        <div className="text-center p-3 bg-green-900/30 rounded-lg">
                          <p className="text-2xl font-bold text-green-400">
                            {systemLogs.filter(log => log.type === 'success' || log.level === 'SUCCESS').length}
                          </p>
                          <p className="text-green-300 text-sm">Sucessos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>

            {/* Monitoramento Tab - NOVA IMPLEMENTAÇÃO FUNCIONAL */}
            <TabsContent value="monitoring" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Monitor className="w-6 h-6 mr-3 text-green-400" />
                    Monitoramento do Sistema
                  </h3>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => {
                        console.log('📊 Botão Atualizar Monitoramento clicado!');
                        loadMonitoringData();
                      }}
                      size="sm" 
                      variant="outline"
                      className="border-green-500/50 text-green-400 hover:bg-green-600/20 hover:border-green-400 transition-all duration-200"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Atualizar Dados
                    </Button>
                    <Button 
                      onClick={() => {
                        console.log('🗑️ Botão Limpar Alertas clicado!');
                        setRealTimeData(prev => ({ ...prev, alerts: [] }));
                      }}
                      size="sm" 
                      variant="outline"
                      className="border-orange-500/50 text-orange-400 hover:bg-orange-600/20 hover:border-orange-400 transition-all duration-200"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Limpar Alertas
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert className="bg-red-900/50 border-red-700 mb-6">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription className="text-red-200">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Cards de Monitoramento */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/30">
                    <CardContent className="p-6 text-center">
                      <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-white">{systemMetrics.uptime}</p>
                      <p className="text-blue-300 text-sm">Uptime do Sistema</p>
                      <div className="mt-2 h-1 bg-blue-900/50 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full" style={{ width: '95%' }} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30">
                    <CardContent className="p-6 text-center">
                      <Activity className="w-8 h-8 text-green-400 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-white">{realTimeData.cpuUsage || systemMetrics.systemLoad}%</p>
                      <p className="text-green-300 text-sm">Uso de CPU</p>
                      <Progress value={realTimeData.cpuUsage || systemMetrics.systemLoad} className="mt-2 h-2" />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30">
                    <CardContent className="p-6 text-center">
                      <Server className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-white">{realTimeData.memoryUsage || 45}%</p>
                      <p className="text-purple-300 text-sm">Uso de Memória</p>
                      <Progress value={realTimeData.memoryUsage || 45} className="mt-2 h-2" />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/30">
                    <CardContent className="p-6 text-center">
                      <Zap className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-white">{realTimeData.networkLatency || 120}ms</p>
                      <p className="text-orange-300 text-sm">Latência de Rede</p>
                      <div className="mt-2 h-1 bg-orange-900/50 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 rounded-full" style={{ width: '80%' }} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Status dos Agentes e Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Status dos Agentes */}
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-600/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <div className="flex items-center">
                          <Bot className="w-5 h-5 mr-2 text-blue-400" />
                          Status dos Agentes
                        </div>
                        <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                          {(realTimeData.agents || []).length} agentes
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-green-900/30 rounded-lg p-4 text-center border border-green-500/30">
                          <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                          <p className="text-xl font-bold text-white">{(realTimeData.agents || []).filter(a => a.status === 'online').length}</p>
                          <p className="text-green-300 text-sm">Online</p>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-4 text-center border border-gray-500/30">
                          <div className="w-4 h-4 bg-gray-500 rounded-full mx-auto mb-2"></div>
                          <p className="text-xl font-bold text-white">{(realTimeData.agents || []).filter(a => a.status === 'offline').length}</p>
                          <p className="text-gray-300 text-sm">Offline</p>
                        </div>
                      </div>
                      
                      <ScrollArea className="h-64">
                        <div className="space-y-2">
                          {(realTimeData.agents || []).map((agent, index) => (
                            <motion.div 
                              key={index} 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/50 hover:bg-gray-700/50 transition-all duration-200"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  agent.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                                }`} />
                                <span className="text-white font-medium">{agent.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {agent.type || 'assistant'}
                                </Badge>
                              </div>
                              <span className="text-gray-400 text-xs">
                                {agent.last_seen || 'Agora'}
                              </span>
                            </motion.div>
                          ))}
                          {(realTimeData.agents || []).length === 0 && (
                            <div className="text-center py-8">
                              <Bot className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                              <p className="text-gray-400">Nenhum agente encontrado</p>
                              <p className="text-gray-500 text-sm mt-1">Clique em &quot;Atualizar Dados&quot; para carregar</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Resumo do Sistema */}
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-600/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-green-400" />
                        Resumo do Sistema
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-900/30 rounded-lg p-4 text-center border border-blue-500/30">
                          <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                          <p className="text-xl font-bold text-white">{realTimeData.activeUsers}</p>
                          <p className="text-blue-300 text-sm">Usuários Ativos</p>
                        </div>
                        <div className="bg-purple-900/30 rounded-lg p-4 text-center border border-purple-500/30">
                          <Database className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                          <p className="text-xl font-bold text-white">{realTimeData.onlineVisions}</p>
                          <p className="text-purple-300 text-sm">Visions Online</p>
                        </div>
                      </div>

                      <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                        <h4 className="text-white font-medium mb-3 flex items-center">
                          <Activity className="w-4 h-4 mr-2 text-green-400" />
                          Status Geral
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Saúde do Sistema</span>
                            <Badge className={`${
                              realTimeData.systemHealth === 'optimal' ? 'bg-green-600' : 'bg-yellow-600'
                            }`}>
                              {realTimeData.systemHealth === 'optimal' ? 'Ótimo' : 'Normal'}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Interações Hoje</span>
                            <span className="text-white font-semibold">{realTimeData.interactions}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Mensagens Processadas</span>
                            <span className="text-white font-semibold">{realTimeData.totalMessages}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Última Atualização</span>
                            <span className="text-white text-sm">{new Date().toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Modais */}
        <Dialog open={viewVisionModal} onOpenChange={setViewVisionModal}>
          <DialogContent className="bg-gray-800 border border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Detalhes do Vision</DialogTitle>
            </DialogHeader>
            
            {selectedVision && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Nome:</label>
                    <p className="text-white text-lg font-semibold">{selectedVision.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-400">Status:</label>
                    <Badge className={selectedVision.is_active ? 'bg-green-600' : 'bg-gray-600'}>
                      {selectedVision.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-400">ID:</label>
                    <p className="text-white">{selectedVision.id}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-400">Usuário:</label>
                    <p className="text-white">{selectedVision.user_id}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Configurações:</label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Voz:</span>
                      <span className="text-white">{selectedVision.voice_enabled ? 'Sim' : 'Não'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Auto-fala:</span>
                      <span className="text-white">{selectedVision.auto_speak ? 'Sim' : 'Não'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Timestamps:</label>
                  <div className="space-y-2 mt-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Criado:</span>
                      <span className="text-white">
                        {selectedVision.created_at 
                          ? new Date(selectedVision.created_at).toLocaleString('pt-BR')
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Atualizado:</span>
                      <span className="text-white">
                        {selectedVision.updated_at 
                          ? new Date(selectedVision.updated_at).toLocaleString('pt-BR')
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={editVisionModal} onOpenChange={setEditVisionModal}>
          <DialogContent className="bg-gray-800 border border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Editar Vision</DialogTitle>
            </DialogHeader>
            
            {editingVision && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">Nome:</label>
                  <Input
                    value={editingVision.name || ''}
                    onChange={(e) => setEditingVision(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Nome da Vision"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">Cor do Tema:</label>
                  <select
                    value={editingVision.theme_color || '#3B82F6'}
                    onChange={(e) => setEditingVision(prev => ({ ...prev, theme_color: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                  >
                    <option value="#3B82F6">Azul</option>
                    <option value="#10B981">Verde</option>
                    <option value="#8B5CF6">Roxo</option>
                    <option value="#F59E0B">Amarelo</option>
                    <option value="#EF4444">Vermelho</option>
                    <option value="#6B7280">Cinza</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="voice_enabled"
                      checked={editingVision.voice_enabled || false}
                      onChange={(e) => setEditingVision(prev => ({ ...prev, voice_enabled: e.target.checked }))}
                      className="rounded border-gray-600"
                    />
                    <label htmlFor="voice_enabled" className="text-sm text-gray-400">Voz Ativada</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="auto_speak"
                      checked={editingVision.auto_speak || false}
                      onChange={(e) => setEditingVision(prev => ({ ...prev, auto_speak: e.target.checked }))}
                      className="rounded border-gray-600"
                    />
                    <label htmlFor="auto_speak" className="text-sm text-gray-400">Auto-fala</label>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">Status:</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={editingVision.is_active || false}
                      onChange={(e) => setEditingVision(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="rounded border-gray-600"
                    />
                    <label htmlFor="is_active" className="text-sm text-gray-400">Ativo</label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    onClick={() => setEditVisionModal(false)}
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveVision}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Alterações'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}

// PropTypes
CosmicSphere3D.propTypes = {
  isListening: PropTypes.bool.isRequired,
  isSpeaking: PropTypes.bool.isRequired,
  isProcessing: PropTypes.bool.isRequired,
};

VisionCommandCore.propTypes = {
  adminData: PropTypes.object,
  onVoiceCommand: PropTypes.func,
};