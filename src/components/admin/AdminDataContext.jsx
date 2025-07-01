import React, { createContext, useContext, useState, useEffect } from 'react';

// Context para dados administrativos do Vision Command Core
const AdminDataContext = createContext();

// Hook personalizado para usar os dados administrativos
export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData deve ser usado dentro de AdminDataProvider');
  }
  return context;
};

// Provider dos dados administrativos
export const AdminDataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para simular dados do sistema
  const generateMockData = () => {
    return {
      agents: [
        { id: 1, name: 'Vision Alpha', status: 'active', type: 'assistant', interactions: 1250 },
        { id: 2, name: 'Vision Beta', status: 'active', type: 'automation', interactions: 890 },
        { id: 3, name: 'Vision Gamma', status: 'inactive', type: 'analysis', interactions: 456 },
        { id: 4, name: 'Vision Delta', status: 'active', type: 'support', interactions: 2100 },
        { id: 5, name: 'Vision Echo', status: 'active', type: 'monitoring', interactions: 678 }
      ],
      visions: [
        { id: 1, name: 'Questão', status: 'active', total_interactions: 530, personality: 'analytical' },
        { id: 2, name: 'Echo', status: 'active', total_interactions: 230, personality: 'friendly' },
        { id: 3, name: 'Social', status: 'active', total_interactions: 220, personality: 'social' },
        { id: 4, name: 'Nova', status: 'active', total_interactions: 180, personality: 'creative' },
        { id: 5, name: 'Auto', status: 'inactive', total_interactions: 100, personality: 'efficient' }
      ],
      users: [
        { id: 1, name: 'Admin', role: 'administrator', last_active: '2024-01-15T10:30:00Z' },
        { id: 2, name: 'User1', role: 'user', last_active: '2024-01-15T09:15:00Z' },
        { id: 3, name: 'User2', role: 'user', last_active: '2024-01-14T16:45:00Z' }
      ],
      systemStats: {
        uptime: '24h 15m',
        totalRequests: 15420,
        successRate: 98.5,
        averageResponseTime: 245,
        activeConnections: 42,
        memoryUsage: 68,
        cpuUsage: 45
      },
      recentActivity: [
        { id: 1, type: 'interaction', agent: 'Vision Alpha', timestamp: '2024-01-15T10:25:00Z', status: 'success' },
        { id: 2, type: 'automation', agent: 'Vision Beta', timestamp: '2024-01-15T10:20:00Z', status: 'success' },
        { id: 3, type: 'analysis', agent: 'Vision Gamma', timestamp: '2024-01-15T10:15:00Z', status: 'warning' },
        { id: 4, type: 'support', agent: 'Vision Delta', timestamp: '2024-01-15T10:10:00Z', status: 'success' }
      ]
    };
  };

  // Função para carregar dados (simulada)
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em um cenário real, aqui seria feita a chamada para a API
      const mockData = generateMockData();
      setData(mockData);
    } catch (err) {
      setError('Erro ao carregar dados do sistema');
      console.error('Erro ao carregar dados:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar todos os dados
  const refreshAll = () => {
    loadData();
  };

  // Função para atualizar dados específicos
  const updateAgentStatus = (agentId, newStatus) => {
    setData(prevData => ({
      ...prevData,
      agents: prevData.agents.map(agent => 
        agent.id === agentId ? { ...agent, status: newStatus } : agent
      )
    }));
  };

  // Função para adicionar nova atividade
  const addActivity = (activity) => {
    setData(prevData => ({
      ...prevData,
      recentActivity: [activity, ...prevData.recentActivity.slice(0, 9)] // Manter apenas 10 atividades
    }));
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(() => {
      if (!isLoading) {
        loadData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const value = {
    data,
    isLoading,
    error,
    refreshAll,
    updateAgentStatus,
    addActivity
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};

export default AdminDataProvider;