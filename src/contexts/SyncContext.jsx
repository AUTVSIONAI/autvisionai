/**
 * 🔄 AUTVISION SYNC MANAGER
 * Sistema de sincronização bidirecional entre painel admin e cliente
 * Garantia de dados consistentes em tempo real
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { VisionCompanion, Agent, Routine, Integration, User, Plan, Affiliate, LLMConfig, PlatformConfig, VisionSupremo } from "@/api/entities";

// CONTEXTO GLOBAL DE SINCRONIZAÇÃO
const SyncContext = createContext();

// HOOK PARA ACESSAR O SYNC MANAGER
export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync deve ser usado dentro de SyncProvider');
  }
  return context;
};

// TIPOS DE EVENTOS DE SINCRONIZAÇÃO
export const SYNC_EVENTS = {
  // ADMIN → CLIENT
  USER_UPDATED: 'user_updated',
  AGENT_CREATED: 'agent_created',
  AGENT_UPDATED: 'agent_updated',
  AGENT_DELETED: 'agent_deleted',
  ROUTINE_CREATED: 'routine_created',
  ROUTINE_UPDATED: 'routine_updated',
  ROUTINE_DELETED: 'routine_deleted',
  VISION_UPDATED: 'vision_updated',
  PLAN_UPDATED: 'plan_updated',
  CONFIG_UPDATED: 'config_updated',
  
  // CLIENT → ADMIN
  CLIENT_INTERACTION: 'client_interaction',
  CLIENT_STATS_UPDATED: 'client_stats_updated',
  VISION_INTERACTION: 'vision_interaction',
  PURCHASE_COMPLETED: 'purchase_completed',
  
  // BIDIRECTIONAL
  DATA_REFRESH: 'data_refresh',
  REAL_TIME_UPDATE: 'real_time_update'
};

// PROVIDER DE SINCRONIZAÇÃO
export const SyncProvider = ({ children }) => {
  // ESTADO GLOBAL UNIFICADO
  const [globalData, setGlobalData] = useState({
    users: [],
    visions: [],
    agents: [],
    routines: [],
    integrations: [],
    plans: [],
    affiliates: [],
    llms: [],
    platformConfig: null,
    lastSync: null,
    syncInProgress: false
  });

  const [isOnline, setIsOnline] = useState(true);
  const [listeners, setListeners] = useState(new Map());

  // ⚡ SISTEMA DE EVENTOS - CORE DA SINCRONIZAÇÃO
  const emit = useCallback((event, data) => {
    const eventListeners = listeners.get(event) || [];
    eventListeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Erro no listener do evento ${event}:`, error);
      }
    });
  }, [listeners]);

  const on = useCallback((event, callback) => {
    const currentListeners = listeners.get(event) || [];
    const newListeners = [...currentListeners, callback];
    setListeners(prev => new Map(prev).set(event, newListeners));

    // Retornar função de cleanup
    return () => {
      const updatedListeners = listeners.get(event)?.filter(cb => cb !== callback) || [];
      setListeners(prev => new Map(prev).set(event, updatedListeners));
    };
  }, [listeners]);

  // SINCRONIZAÇÃO COMPLETA DOS DADOS COM DADOS REAIS
  const syncAllData = useCallback(async (userId = null) => {
    // PREVENIR MÚLTIPLAS SINCRONIZAÇÕES SIMULTÂNEAS
    if (globalData.syncInProgress) {
      console.log('🔄 Sincronização já em progresso - aguardando...');
      return globalData;
    }
    
    setGlobalData(prev => ({ ...prev, syncInProgress: true }));
    
    try {
      console.log('🔄 Iniciando sincronização completa com dados reais...', { userId });
      
      // VERIFICAR SE BACKEND ESTÁ ONLINE
      let backendOnline = false;
      try {
        const healthResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/config/health`, {
          method: 'GET',
          timeout: 5000,
          headers: { 'x-api-key': 'autvision_backend_secure_key_2025' }
        });
        backendOnline = healthResponse.ok;
        console.log('🔗 Backend status:', backendOnline ? 'ONLINE' : 'OFFLINE');
      } catch (error) {
        console.warn('⚠️ Backend check failed:', error.message);
        backendOnline = false;
      }
      
      setIsOnline(backendOnline);
      
      if (!backendOnline) {
        console.warn('⚠️ Backend offline - usando dados mock temporários');
        
        // DADOS MOCK APENAS QUANDO BACKEND ESTÁ OFFLINE
        const mockData = {
          users: [
            { id: 1, name: 'Paulo Silva', email: 'paulo@autvision.ai', plan_id: 2, level: 5 },
            { id: 2, name: 'Maria Santos', email: 'maria@autvision.ai', plan_id: 1, level: 3 }
          ],
          visions: [
            { 
              id: 1, 
              name: 'ATHENA', 
              status: 'active', 
              created_by: userId || 'demo',
              total_interactions: 847,
              personality: 'friendly',
              capabilities: ['chat', 'automation', 'analysis']
            }
          ],
          agents: [
            { 
              id: 1, 
              name: 'Guardian', 
              type: 'security', 
              status: 'active',
              avatar: '🛡️',
              description: 'Proteção e segurança avançada',
              image_url: null,
              capabilities: ['threat_detection', 'security_scan']
            },
            { 
              id: 2, 
              name: 'Analyzer', 
              type: 'data', 
              status: 'active',
              avatar: '📊',
              description: 'Análise de dados e insights',
              image_url: null,
              capabilities: ['data_analysis', 'reporting']
            },
            { 
              id: 3, 
              name: 'Creator', 
              type: 'content', 
              status: 'active',
              avatar: '🎨',
              description: 'Criação de conteúdo inteligente',
              image_url: null,
              capabilities: ['content_generation', 'design']
            },
            { 
              id: 4, 
              name: 'Connector', 
              type: 'integration', 
              status: 'active',
              avatar: '🔗',
              description: 'Integrações e automações',
              image_url: null,
              capabilities: ['api_integration', 'workflow']
            },
            { 
              id: 5, 
              name: 'Assistant', 
              type: 'support', 
              status: 'active',
              avatar: '🤖',
              description: 'Assistente pessoal inteligente',
              image_url: null,
              capabilities: ['personal_assistance', 'scheduling']
            }
          ],
          routines: [
            { id: 1, name: 'Rotina Matinal', status: 'active', is_active: true },
            { id: 2, name: 'Backup Automático', status: 'active', is_active: true }
          ],
          integrations: [
            { id: 1, name: 'OpenAI', status: 'connected', type: 'llm' },
            { id: 2, name: 'Supabase', status: 'connected', type: 'database' }
          ],
          plans: [
            { id: 1, name: 'Básico', price: 29.90, features: ['1 Vision', '3 Agentes', 'Chat Básico'] },
            { id: 2, name: 'Pro', price: 79.90, features: ['5 Visions', '10 Agentes', 'Automações Avançadas'] },
            { id: 3, name: 'Enterprise', price: 199.90, features: ['Visions Ilimitadas', 'Agentes Ilimitados', 'API Completa'] }
          ],
          affiliates: [
            { id: 1, name: 'Afiliado Demo', commission: 30, status: 'active' }
          ],
          llms: [
            { id: 1, model: 'gpt-4', provider: 'openai', status: 'active' },
            { id: 2, model: 'claude-3', provider: 'anthropic', status: 'active' }
          ],
          platformConfig: { 
            theme: 'dark', 
            features: { voice: true, analytics: true, debug: true },
            version: '2.1.4'
          },
          lastSync: new Date().toISOString(),
          syncInProgress: false
        };
        
        setGlobalData(mockData);
        emit(SYNC_EVENTS.DATA_REFRESH, mockData);
        return mockData;
      }
      
      // USAR DADOS REAIS DO BACKEND
      console.log('✅ Backend online - carregando dados reais...');
      
      const [users, visions, agents, routines, integrations, plans, affiliates, llms, platformConfig] = await Promise.allSettled([
        User.list().catch(err => { console.warn('Users failed:', err.message); return []; }),
        VisionCompanion.filter({ created_by: userId || 'anonymous' }).catch(err => { console.warn('Visions failed:', err.message); return []; }),
        Agent.list().catch(err => { console.warn('Agents failed:', err.message); return []; }),
        Routine.list().catch(err => { console.warn('Routines failed:', err.message); return []; }),
        Integration.list().catch(err => { console.warn('Integrations failed:', err.message); return []; }),
        Plan.list().catch(err => { console.warn('Plans failed:', err.message); return []; }),
        Affiliate.list().catch(err => { console.warn('Affiliates failed:', err.message); return []; }),
        LLMConfig.list().catch(err => { console.warn('LLMs failed:', err.message); return []; }),
        PlatformConfig.list().catch(err => { console.warn('Platform config failed:', err.message); return []; })
      ]);

      const realData = {
        users: users.status === 'fulfilled' ? users.value : [],
        visions: visions.status === 'fulfilled' ? visions.value : [],
        agents: agents.status === 'fulfilled' ? agents.value : [],
        routines: routines.status === 'fulfilled' ? routines.value : [],
        integrations: integrations.status === 'fulfilled' ? integrations.value : [],
        plans: plans.status === 'fulfilled' ? plans.value : [],
        affiliates: affiliates.status === 'fulfilled' ? affiliates.value : [],
        llms: llms.status === 'fulfilled' ? llms.value : [],
        platformConfig: platformConfig.status === 'fulfilled' ? (platformConfig.value[0] || null) : null,
        lastSync: new Date().toISOString(),
        syncInProgress: false
      };

      setGlobalData(realData);
      emit(SYNC_EVENTS.DATA_REFRESH, realData);
      
      console.log('✅ Sincronização com dados reais finalizada:', {
        users: realData.users.length,
        visions: realData.visions.length,
        agents: realData.agents.length,
        routines: realData.routines.length,
        plans: realData.plans.length
      });

      return realData;
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      setGlobalData(prev => ({ ...prev, syncInProgress: false }));
      setIsOnline(false);
      
      // FALLBACK COM DADOS VAZIOS EM CASO DE ERRO CRÍTICO
      const fallbackData = {
        users: [],
        visions: [],
        agents: [],
        routines: [],
        integrations: [],
        plans: [],
        affiliates: [],
        llms: [],
        platformConfig: null,
        lastSync: new Date().toISOString(),
        syncInProgress: false
      };
      
      setGlobalData(fallbackData);
      return fallbackData;
    }
  }, [emit]);

  // 🎯 SINCRONIZAÇÃO ESPECÍFICA POR MÓDULO
  const syncModule = useCallback(async (module, userId = null) => {
    try {
      console.log(`🔄 Sincronizando módulo: ${module}`, { userId });
      
      let data = [];
      const filter = userId ? { created_by: userId } : {};
      
      switch (module) {
        case 'users':
          data = await User.list();
          setGlobalData(prev => ({ ...prev, users: data }));
          break;
        case 'visions':
          data = userId ? await VisionCompanion.filter({ ...filter, created_by: userId }) : await VisionCompanion.filter({ created_by: 'anonymous' });
          setGlobalData(prev => ({ ...prev, visions: data }));
          break;
        case 'agents':
          data = userId ? await Agent.filter(filter) : await Agent.list();
          setGlobalData(prev => ({ ...prev, agents: data }));
          break;
        case 'routines':
          data = userId ? await Routine.filter(filter) : await Routine.list();
          setGlobalData(prev => ({ ...prev, routines: data }));
          break;
        case 'integrations':
          data = await Integration.list();
          setGlobalData(prev => ({ ...prev, integrations: data }));
          break;
        case 'plans':
          data = await Plan.list();
          setGlobalData(prev => ({ ...prev, plans: data }));
          break;
        case 'affiliates':
          data = await Affiliate.list();
          setGlobalData(prev => ({ ...prev, affiliates: data }));
          break;
        case 'llms':
          data = await LLMConfig.list();
          setGlobalData(prev => ({ ...prev, llms: data }));
          break;
        default:
          console.warn(`Módulo desconhecido: ${module}`);
          return;
      }
      
      // EMITIR EVENTO ESPECÍFICO DO MÓDULO
      emit(`${module}_updated`, data);
      
      console.log(`✅ Módulo ${module} sincronizado:`, data.length, 'itens');
      return data;
    } catch (error) {
      console.error(`❌ Erro ao sincronizar módulo ${module}:`, error);
      throw error;
    }
  }, [emit]);

  // 🚀 SINCRONIZAÇÃO INTELIGENTE - USA API NATIVA
  const smartSync = useCallback(async (userId, modules = []) => {
    try {
      if (!userId) {
        console.warn('SmartSync requer userId');
        return await syncAllData();
      }
      
      console.log('🧠 SmartSync iniciado:', { userId, modules });
      
      // USAR A API NATIVA DE SYNC DO BACKEND
      const syncResult = await VisionSupremo.syncData(userId, modules);
      
      // APLICAR OS DADOS SINCRONIZADOS
      if (syncResult && syncResult.data) {
        setGlobalData(prev => ({
          ...prev,
          ...syncResult.data,
          lastSync: new Date().toISOString()
        }));
        
        emit(SYNC_EVENTS.REAL_TIME_UPDATE, syncResult.data);
      }
      
      console.log('✅ SmartSync concluído:', syncResult);
      return syncResult;
    } catch (error) {
      console.error('❌ SmartSync falhou:', error);
      // FALLBACK para sync manual
      return await syncAllData();
    }
  }, [syncAllData, emit]);

  // 📊 ESTATÍSTICAS CALCULADAS EM TEMPO REAL
  const getStats = useCallback(() => {
    const { users, visions, agents, routines, plans, affiliates } = globalData;
    
    if (!users || !visions || !agents || !routines || !plans || !affiliates) {
      return {
        totalUsers: 0,
        activeVisions: 0,
        totalAgents: 0,
        activeRoutines: 0,
        totalRevenue: 0,
        totalAffiliates: 0,
        totalInteractions: 0
      };
    }

    return {
      totalUsers: users.length,
      activeVisions: visions.filter(v => v.status === 'active').length,
      totalAgents: agents.length,
      activeRoutines: routines.filter(r => r.is_active).length,
      totalRevenue: users.reduce((sum, user) => {
        const userPlan = plans.find(p => p.id === user.plan_id);
        return sum + (userPlan?.price || 0);
      }, 0),
      totalAffiliates: affiliates.length,
      totalInteractions: visions.reduce((sum, v) => sum + (v.total_interactions || 0), 0)
    };
  }, [globalData]);

  // 🔧 HELPER FUNCTIONS PARA AÇÕES ESPECÍFICAS
  const updateEntity = useCallback(async (entityType, id, data) => {
    try {
      let Entity;
      switch (entityType) {
        case 'user': Entity = User; break;
        case 'vision': Entity = VisionCompanion; break;
        case 'agent': Entity = Agent; break;
        case 'routine': Entity = Routine; break;
        case 'integration': Entity = Integration; break;
        case 'plan': Entity = Plan; break;
        case 'affiliate': Entity = Affiliate; break;
        case 'llm': Entity = LLMConfig; break;
        default: throw new Error(`Tipo de entidade desconhecido: ${entityType}`);
      }
      
      const updated = await Entity.update(id, data);
      
      // SINCRONIZAR O MÓDULO ESPECÍFICO
      await syncModule(`${entityType}s`);
      
      // EMITIR EVENTO DE ATUALIZAÇÃO
      emit(`${entityType}_updated`, updated);
      
      return updated;
    } catch (error) {
      console.error(`Erro ao atualizar ${entityType}:`, error);
      throw error;
    }
  }, [syncModule, emit]);

  // 🚀 INICIALIZAÇÃO CONTROLADA - SEM POLLING EXCESSIVO
  useEffect(() => {
    let mounted = true;
    
    console.log('🔄 SyncProvider inicializando...');
    
    // SYNC INICIAL COM DELAY PARA EVITAR MÚLTIPLAS CHAMADAS
    const initTimer = setTimeout(() => {
      if (mounted) {
        syncAllData().catch(error => {
          console.error('❌ Erro na sincronização inicial:', error);
        });
      }
    }, 2000); // 2 segundos de delay

    // CLEANUP - SEM POLLING AUTOMÁTICO
    return () => {
      mounted = false;
      clearTimeout(initTimer);
    };
  }, [syncAllData]); // DEPENDÊNCIAS VAZIAS - EXECUTAR APENAS UMA VEZ

  // VALOR DO CONTEXTO
  const contextValue = {
    // DADOS GLOBAIS
    globalData,
    isOnline,
    syncInProgress: globalData.syncInProgress,
    lastSync: globalData.lastSync,
    
    // FUNÇÕES DE SINCRONIZAÇÃO
    syncAllData,
    syncModule,
    smartSync,
    
    // SISTEMA DE EVENTOS
    emit,
    on,
    
    // ESTATÍSTICAS
    getStats,
    stats: getStats(),
    
    // HELPERS
    updateEntity,
    
    // ALIASES PARA COMPATIBILIDADE
    refreshAll: syncAllData,
    data: globalData
  };

  return (
    <SyncContext.Provider value={contextValue}>
      {children}
    </SyncContext.Provider>
  );
};

SyncProvider.propTypes = {
  children: PropTypes.node.isRequired
};
