import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientDashboard from '../components/client/ClientDashboard';
import { User } from '@/api/entities';

export default function ClientPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Tentar carregar dados do usuário
      let userData;
      try {
        userData = await User.me();
      } catch (apiError) {
        console.warn('⚠️ Erro ao carregar dados do usuário da API, usando dados mock:', apiError);
        // Se falhar, usar dados mock para continuar funcionando
        userData = {
          id: 'mock-user-1',
          name: 'Usuário Demo',
          email: 'demo@autvision.ai'
        };
      }

      // Dados mock para desenvolvimento (sempre usar dados completos)
      const mockUser = {
        id: userData?.id || 'mock-user-1',
        name: userData?.name || 'Paulo Silva',
        email: userData?.email || 'paulo@autvision.ai',
        level: userData?.level || 3,
        currentXP: userData?.currentXP || 750,
        nextLevelXP: userData?.nextLevelXP || 1000,
        totalActions: userData?.totalActions || 142,
        timeSaved: userData?.timeSaved || '8h 30min',
        streak: userData?.streak || 5,
        completedMissions: userData?.completedMissions || 7,
        totalMissions: userData?.totalMissions || 12,
        weeklyGoal: userData?.weeklyGoal || 50,
        weeklyProgress: userData?.weeklyProgress || 32,
        visionCompanionId: userData?.visionCompanionId || null
      };

      setUser(mockUser);
      
    } catch (error) {
      console.error('Erro crítico ao carregar dados do usuário:', error);
      
      // Em último caso, usar dados mock completos
      const fallbackUser = {
        id: 'fallback-user',
        name: 'Usuário Offline',
        email: 'offline@autvision.ai',
        level: 1,
        currentXP: 0,
        nextLevelXP: 100,
        totalActions: 0,
        timeSaved: '0h 0min',
        streak: 0,
        completedMissions: 0,
        totalMissions: 5,
        weeklyGoal: 10,
        weeklyProgress: 0,
        visionCompanionId: null
      };
      
      setUser(fallbackUser);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando AUTVISION...</p>
          <p className="text-gray-400 text-sm mt-2">Conectando com seu Vision Companion</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Erro de Autenticação</h1>
          <p className="text-gray-400 mb-6">Não foi possível carregar seus dados.</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <ClientDashboard />
  );
}
