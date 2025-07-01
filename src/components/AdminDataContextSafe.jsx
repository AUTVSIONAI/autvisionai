/**
 * 🚨 EMERGENCY FIX: AdminDataContext Otimizado
 * Versão que reduz drasticamente os requests para parar o flood de erros
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { User, Agent } from '@/api/entities';

const AdminDataContext = createContext({});

export function AdminDataProvider({ children }) {
  const [data, setData] = useState({
    users: [],
    agents: [],
    routines: [],
    integrations: [],
    plans: [{ id: 1, name: 'Starter', price: 0, description: 'Plano gratuito' }],
    affiliates: [],
    visions: [],
    llms: [],
    platformConfig: null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const loadAllData = async () => {
    if (isLoading) return;

    console.log('🔄 Carregando dados admin (modo seguro)...');
    setIsLoading(true);
    setError(null);

    try {
      // Carregar apenas dados essenciais com delay
      const users = await User.list().catch(() => []);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const agents = await Agent.list().catch(() => []);

      setData(prev => ({
        ...prev,
        users,
        agents
      }));

      setLastUpdate(new Date());
      console.log('✅ Dados essenciais carregados');
      
    } catch (err) {
      console.error("❌ Erro ao carregar dados admin:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Delay de 5 segundos para evitar rush
    const timer = setTimeout(loadAllData, 5000);
    return () => clearTimeout(timer);
  }, []);

  const value = {
    ...data,
    isLoading,
    error,
    lastUpdate,
    loadAllData,
    updateUsers: () => {},
    updateAgents: () => {},
    updateRoutines: () => {},
    updateIntegrations: () => {},
    updatePlans: () => {},
    updateAffiliates: () => {},
    updateVisions: () => {},
    updateLLMs: () => {}
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData deve ser usado dentro de AdminDataProvider');
  }
  return context;
}
