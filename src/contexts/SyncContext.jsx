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

  // SINCRONIZAÇÃO COMPLETA DOS DADOS
  const syncAllData = useCallback(async (userId = null) => {
    setGlobalData(prev => {
      if (prev.syncInProgress) return prev;
      return { ...prev, syncInProgress: true };
    });
    
    try {
      console.log('🔄 Iniciando sincronização completa...', { userId });
      
      // CARREGAR TODOS OS DADOS EM PARALELO
      const [users, visions, agents, routines, integrations, plans, affiliates, llms, platformConfig] = await Promise.all([
        User.list().catch(() => []),
        VisionCompanion.list().catch(() => []),
        Agent.list().catch(() => []),
        Routine.list().catch(() => []),
        Integration.list().catch(() => []),
        Plan.list().catch(() => []),
        Affiliate.list().catch(() => []),
        LLMConfig.list().catch(() => []),
        PlatformConfig.list().catch(() => [])
      ]);

      const newGlobalData = {
        users,
        visions,
        agents,
        routines,
        integrations,
        plans,
        affiliates,
        llms,
        platformConfig: platformConfig[0] || null,
        lastSync: new Date().toISOString(),
        syncInProgress: false
      };

      setGlobalData(newGlobalData);
      
      // EMITIR EVENTO DE SINCRONIZAÇÃO COMPLETA
      emit(SYNC_EVENTS.DATA_REFRESH, newGlobalData);
      
      console.log('✅ Sincronização completa finalizada:', {
        users: users.length,
        visions: visions.length,
        agents: agents.length,
        routines: routines.length
      });

      return newGlobalData;
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      setGlobalData(prev => ({ ...prev, syncInProgress: false }));
      setIsOnline(false);
      throw error;
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
          data = userId ? await VisionCompanion.filter(filter) : await VisionCompanion.list();
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

  // INICIALIZAÇÃO AUTOMÁTICA
  useEffect(() => {
    console.log('🔄 SyncProvider inicializando...');
    syncAllData();
    
    // POLLING DE SINCRONIZAÇÃO A CADA 30 SEGUNDOS
    const syncInterval = setInterval(() => {
      if (isOnline && !globalData.syncInProgress) {
        console.log('🔄 Sincronização automática...');
        syncAllData();
      }
    }, 30000);

    return () => clearInterval(syncInterval);
  }, [syncAllData, isOnline, globalData.syncInProgress]);

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
