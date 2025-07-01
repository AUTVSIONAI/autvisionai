/**
 * 🔥 USE AUTH HOOK - MARCHA EVOLUÇÃO 10.0
 * Hook para usar o contexto de autenticação
 */

import { useContext } from 'react'
import AuthContext from '@/contexts/AuthContext'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
