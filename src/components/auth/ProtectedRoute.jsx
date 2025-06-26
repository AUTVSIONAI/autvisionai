/**
 * 🔥 PROTECTED ROUTE - MARCHA EVOLUÇÃO 10.0
 * Componente para proteger rotas que precisam de autenticação
 */

import PropTypes from 'prop-types'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import LoginForm from './LoginForm'
import { useState, useEffect } from 'react'

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  redirectTo = null,
  showLoginForm = true 
}) {
  const { isAuthenticated, isAdmin, initializing, user, profile } = useAuth()
  const location = useLocation()
  const [timeoutReached, setTimeoutReached] = useState(false)

  // Timeout para evitar loading infinito
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('⚠️ ProtectedRoute: Timeout de inicialização atingido')
      setTimeoutReached(true)
    }, 1000) // 1 segundo - super agressivo

    return () => clearTimeout(timer)
  }, [])

  // Debug logs
  useEffect(() => {
    console.log('🛡️ ProtectedRoute estado:', {
      initializing,
      isAuthenticated,
      user: !!user,
      profile: !!profile,
      path: location.pathname,
      timeoutReached,
      isAdmin: isAdmin() // EXECUTAR A FUNÇÃO
    })
  }, [initializing, isAuthenticated, user, profile, location.pathname, timeoutReached, isAdmin])

  // Mostrar loading enquanto inicializa (com timeout)
  if (initializing && !timeoutReached) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Inicializando autenticação...</p>
          <p className="text-gray-400 text-sm mt-2">Aguarde...</p>
        </div>
      </div>
    )
  }

  // Se não está autenticado
  if (!isAuthenticated) {
    if (showLoginForm) {
      return <LoginForm />
    }
    
    if (redirectTo) {
      return <Navigate to={redirectTo} state={{ from: location }} replace />
    }

    return <LoginForm />
  }

  // Se precisa ser admin mas não é
  if (requireAdmin && !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Acesso Negado</h2>
          <p className="text-gray-400">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    )
  }

  // Se passou em todas as verificações, renderizar o conteúdo
  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAdmin: PropTypes.bool,
  redirectTo: PropTypes.string,
  showLoginForm: PropTypes.bool
}
