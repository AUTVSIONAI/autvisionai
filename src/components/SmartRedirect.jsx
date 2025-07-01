/**
 * 🔀 SMART REDIRECT - REDIRECIONAMENTO INTELIGENTE
 * Redireciona para o painel correto baseado no tipo de usuário
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function SmartRedirect() {
  const navigate = useNavigate();
  const { profile, isAuthenticated, initializing } = useAuth();

  useEffect(() => {
    // Aguardar inicialização
    if (initializing) return;

    // Se não autenticado, ir para login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Se autenticado, verificar tipo de usuário
    const isAdmin = profile?.role === 'admin' || 
                   profile?.email === 'digitalinfluenceradm@gmail.com';
    
    console.log('🔀 SmartRedirect:', {
      isAuthenticated,
      profile: profile?.email,
      isAdmin,
      destination: isAdmin ? '/admin' : '/client'
    });
    
    // Redirecionar para o painel correto
    navigate(isAdmin ? '/admin' : '/client', { replace: true });
  }, [navigate, profile, isAuthenticated, initializing]);

  // Mostrar loading enquanto decide o redirecionamento
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto animate-pulse">
          <span className="text-white font-bold">V</span>
        </div>
        <div className="text-gray-300">Redirecionando...</div>
      </div>
    </div>
  );
}
