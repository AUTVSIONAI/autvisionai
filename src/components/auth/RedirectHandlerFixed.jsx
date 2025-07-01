/**
 * 🔥 REDIRECT HANDLER FIXED - VERSÃO SIMPLIFICADA
 * Componente para gerenciar redirecionamento após autenticação
 */

import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function RedirectHandlerFixed({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, initializing } = useAuth()

  useEffect(() => {
    console.log('🔍 RedirectHandlerFixed: Estado atual:', {
      isAuthenticated,
      initializing,
      currentPath: location.pathname
    })
    
    // Se ainda está inicializando, não fazer nada
    if (initializing) {
      console.log('🔄 RedirectHandlerFixed: Aguardando inicialização...')
      return
    }
    
    const currentPath = location.pathname
    
    // Lógica simplificada de redirecionamento
    if (isAuthenticated) {
      // Se usuário está autenticado e em página pública, redirecionar para dashboard
      if (currentPath === '/' || currentPath === '/Login' || currentPath === '/SignUp' || currentPath === '/LandingPage') {
        console.log('🚀 RedirectHandlerFixed: Redirecionando usuário autenticado para /client')
        navigate('/client', { replace: true })
      }
    } else {
      // Se usuário não está autenticado e em página privada, redirecionar para login
      if (currentPath !== '/' && currentPath !== '/Login' && currentPath !== '/SignUp' && currentPath !== '/LandingPage') {
        console.log('🚀 RedirectHandlerFixed: Redirecionando usuário não autenticado para /Login')
        navigate('/Login', { replace: true })
      }
    }
    
  }, [isAuthenticated, initializing, location.pathname, navigate])

  return children
}