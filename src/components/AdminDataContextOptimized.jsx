/**
 * 🚨 EMERGENCY FIX: AdminDataContext ULTRA Otimizado
 * Versão EXTREMAMENTE reduzida para parar o flood de erros
 */

import { createContext, useContext, useState, useEffect } from 'react';

// Contexto dos dados administrativos
const AdminDataContext = createContext({});

// Provider dos dados administrativos - MODO SEGURO TOTAL
export function AdminDataProvider({ children }) {
  const [data, setData] = useState({
    users: [],
    agents: [],
    routines: [],
    integrations: [],
    plans: [
      { id: 1, name: 'Starter', price: 0, description: 'Plano gratuito básico', features: ['5 agentes', '100 mensagens'], is_active: true },
      { id: 2, name: 'Pro', price: 29, description: 'Plano profissional', features: ['50 agentes', '5000 mensagens'], is_active: true }
    ],
    affiliates: [],
    visions: [],
    llms: [],
    platformConfig: { 
      name: 'AUTVISION', 
      version: '10.0', 
      mode: 'development',
      features: ['chat', 'agents', 'automation']
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // DISABLED: Não carregar nenhum dado do backend por enquanto
  const loadAllData = async () => {
    console.log('📵 LoadAllData DESABILITADO para evitar loops infinitos');
    console.log('💾 Usando apenas dados mock locais');
    setIsLoading(false);
    return;
  };

  // NÃO EXECUTAR NENHUM useEffect que faça requests
  useEffect(() => {
    console.log('🔒 AdminDataContext em MODO SEGURO - sem requests automáticos');
    console.log('💡 Dados disponíveis: plans (mock), platformConfig (mock)');
    setLastUpdate(new Date());
  }, []);

  // Todas as funções de update retornam mock ou não fazem nada
  const value = {
    ...data,
    isLoading,
    error,
    lastUpdate,
    loadAllData,
    updateUsers: () => { console.log('👥 updateUsers: MOCK MODE'); },
    updateAgents: () => { console.log('🤖 updateAgents: MOCK MODE'); },
    updateRoutines: () => { console.log('🔄 updateRoutines: MOCK MODE'); },
    updateIntegrations: () => { console.log('🔗 updateIntegrations: MOCK MODE'); },
    updatePlans: () => { console.log('� updatePlans: MOCK MODE'); },
    updateAffiliates: () => { console.log('🤝 updateAffiliates: MOCK MODE'); },
    updateVisions: () => { console.log('👁️ updateVisions: MOCK MODE'); },
    updateLLMs: () => { console.log('🧠 updateLLMs: MOCK MODE'); }
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
}

// Hook para usar o contexto
export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData deve ser usado dentro de AdminDataProvider');
  }
  return context;
}

export default AdminDataContext;
