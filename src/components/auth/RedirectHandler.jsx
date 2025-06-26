/**
 * 🔥 REDIRECT HANDLER - MARCHA EVOLUÇÃO 10.0
 * Componente para gerenciar redirecionamento após autenticação
 */

import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function RedirectHandler({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, initializing, getDefaultRoute } = useAuth()
  const redirectedRef = useRef(false) // Flag para evitar redirecionamentos múltiplos

  useEffect(() => {
    console.log('🔍 RedirectHandler: Estado atual:', {
      isAuthenticated,
      initializing,
      currentPath: location.pathname,
      alreadyRedirected: redirectedRef.current
    })
    
    // Timeout de segurança para forçar redirecionamento se ficar muito tempo inicializando
    const forceRedirectTimeout = setTimeout(() => {
      if (initializing) {
        console.warn('🚨 RedirectHandler: FORÇANDO REDIRECIONAMENTO após 3s de inicialização!')
        
        const currentPath = location.pathname
        if (currentPath === '/' || currentPath === '/Login' || currentPath === '/SignUp' || currentPath === '/LandingPage') {
          const defaultRoute = getDefaultRoute() // USAR A FUNÇÃO DO CONTEXT
          console.log('🚨 FORÇA BRUTA: Redirecionando para', defaultRoute)
          navigate(defaultRoute, { replace: true })
        }
      }
    }, 3000)
    
    // Não fazer nada se ainda está inicializando (mas com timeout de segurança)
    if (initializing) {
      console.log('🔄 RedirectHandler: Aguardando auth inicialização...')
      return () => clearTimeout(forceRedirectTimeout)
    }
    
    // Limpar timeout se não está mais inicializando
    clearTimeout(forceRedirectTimeout)

    const currentPath = location.pathname
    console.log('🚀 RedirectHandler: Verificando redirecionamento', {
      currentPath,
      isAuthenticated,
      initializing,
      alreadyRedirected: redirectedRef.current
    })

    // Se usuário está autenticado e está em página pública, redirecionar (apenas uma vez)
    if (isAuthenticated && !redirectedRef.current && (
      currentPath === '/' ||
      currentPath === '/Login' || 
      currentPath === '/SignUp' ||
      currentPath === '/LandingPage'
    )) {
      const defaultRoute = getDefaultRoute()
      console.log('🚀 RedirectHandler: Redirecionando usuário autenticado de', currentPath, 'para', defaultRoute)
      
      redirectedRef.current = true // Marcar como redirecionado
      
      // Usar timeout pequeno para garantir que o redirecionamento aconteça após a renderização
      setTimeout(() => {
        navigate(defaultRoute, { replace: true })
      }, 100) // Reduzido de 500ms para 100ms
    }

    // Reset da flag se mudou para página não pública
    if (!isAuthenticated || !['/', '/Login', '/SignUp', '/LandingPage'].includes(currentPath)) {
      redirectedRef.current = false
    }
    
    return () => clearTimeout(forceRedirectTimeout)
  }, [isAuthenticated, initializing, location.pathname, navigate, getDefaultRoute])

  return children
}
