
import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VisionCompanion } from "@/api/entities";
import { Agent } from "@/api/entities";
import { Routine } from "@/api/entities";
import { Integration } from "@/api/entities";
import { User } from "@/api/entities";
import { Plan } from "@/api/entities";
import { Affiliate } from "@/api/entities";
import { LLMConfig } from "@/api/entities";
import { PlatformConfig } from "@/api/entities";

// CONTEXTO GLOBAL DE DADOS ADMIN
const AdminDataContext = createContext();

// HOOK CUSTOMIZADO PARA ACESSAR OS DADOS
export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData deve ser usado dentro de AdminDataProvider');
  }
  return context;
};

// PROVIDER QUE CENTRALIZA TODOS OS DADOS ADMIN
export const AdminDataProvider = ({ children }) => {
  const [data, setData] = useState({
    users: [],
    visions: [],
    agents: [],
    routines: [],
    integrations: [],
    plans: [],
    affiliates: [],
    llms: [],
    platformConfig: null
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // FUNÇÃO PRINCIPAL DE CARREGAMENTO
  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [users, visions, agents, routines, integrations, plans, affiliates, llms, platformConfig] = await Promise.all([
        User.list().catch(() => []),
        VisionCompanion.filter({ created_by: 'Admin Master' }).catch(() => []),
        Agent.list().catch(() => []),
        Routine.list().catch(() => []),
        Integration.list().catch(() => []),
        Plan.filter().catch(() => []),
        Affiliate.list().catch(() => []),
        LLMConfig.list().catch(() => []),
        PlatformConfig.list().catch(() => [])
      ]);
      
      setData({ users, visions, agents, routines, integrations, plans, affiliates, llms, platformConfig: platformConfig[0] || null });
    } catch (err) {
      console.error("Erro ao carregar dados admin:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // CARREGA OS DADOS NA MONTAGEM COM DEBOUNCE
  useEffect(() => {
    // Delay para evitar múltiplos requests simultâneos
    const timer = setTimeout(() => {
      loadAllData();
    }, 1000);

    return () => clearTimeout(timer);
  }, []); // Executar apenas uma vez na montagem

  // FUNÇÕES DE ATUALIZAÇÃO ESPECÍFICAS
  const updateUsers = async () => {
    try {
      const users = await User.list();
      setData(prev => ({ ...prev, users }));
    } catch (err) {
      console.error("Erro ao atualizar usuários:", err);
    }
  };

  const updateVisions = async () => {
    try {
      const visions = await VisionCompanion.filter({ created_by: 'Admin Master' });
      setData(prev => ({ ...prev, visions }));
    } catch (err) {
      console.error("Erro ao atualizar visions:", err);
    }
  };

  const updateAgents = async () => {
    try {
      const agents = await Agent.list();
      setData(prev => ({ ...prev, agents }));
    } catch (err) {
      console.error("Erro ao atualizar agentes:", err);
    }
  };

  const updateRoutines = async () => {
    try {
      const routines = await Routine.list();
      setData(prev => ({ ...prev, routines }));
    } catch (err) {
      console.error("Erro ao atualizar rotinas:", err);
    }
  };

  const updateIntegrations = async () => {
    try {
      const integrations = await Integration.list();
      setData(prev => ({ ...prev, integrations }));
    } catch (err) {
      console.error("Erro ao atualizar integrações:", err);
    }
  };

  const updatePlans = async () => {
    try {
      const plans = await Plan.list();
      setData(prev => ({ ...prev, plans }));
    } catch (err) {
      console.error("Erro ao atualizar planos:", err);
    }
  };

  const updateAffiliates = async () => {
    try {
      const affiliates = await Affiliate.list();
      setData(prev => ({ ...prev, affiliates }));
    } catch (err) {
      console.error("Erro ao atualizar afiliados:", err);
    }
  };

  const updateLLMs = async () => {
    try {
      const llms = await LLMConfig.list();
      setData(prev => ({ ...prev, llms }));
    } catch (err) {
      console.error("Erro ao atualizar LLMs:", err);
    }
  };

  const updatePlatformConfig = async () => {
    try {
      const platformConfig = await PlatformConfig.list();
      setData(prev => ({ ...prev, platformConfig: platformConfig[0] || null }));
    } catch (err) {
      console.error("Erro ao atualizar PlatformConfig:", err);
    }
  };

  // ESTATÍSTICAS CALCULADAS COM PROTEÇÃO
  const getStats = () => {
    // Added protection for undefined data properties
    if (!data || !data.users || !data.visions || !data.agents || !data.routines || !data.plans || !data.affiliates) {
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
      totalUsers: data.users.length,
      activeVisions: data.visions.filter(v => v.status === 'active').length,
      totalAgents: data.agents.length,
      activeRoutines: data.routines.filter(r => r.is_active).length,
      totalRevenue: data.users.reduce((sum, user) => {
        const userPlan = data.plans.find(p => p.id === user.plan_id);
        return sum + (userPlan?.price || 0);
      }, 0),
      totalAffiliates: data.affiliates.length,
      totalInteractions: data.visions.reduce((sum, v) => sum + (v.total_interactions || 0), 0)
    };
  };

  // VALOR DO CONTEXTO
  const contextValue = {
    // DADOS
    data,
    isLoading,
    error,
    // FUNÇÕES DE RECARGA
    refreshAll: loadAllData, // Renamed loadAllData to refreshAll for external consumption
    updateUsers,
    updateVisions,
    updateAgents,
    updateRoutines,
    updateIntegrations,
    updatePlans,
    updateAffiliates,
    updateLLMs,
    updatePlatformConfig,
    // ESTATÍSTICAS
    stats: getStats() // stats is now a pre-calculated value, not a function
  };

  return (
    <AdminDataContext.Provider value={contextValue}>
      {children}
    </AdminDataContext.Provider>
  );
};

AdminDataProvider.propTypes = {
  children: PropTypes.node.isRequired
};
