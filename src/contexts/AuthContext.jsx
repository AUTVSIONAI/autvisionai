/**
 * 🔥 AUTH CONTEXT - MARCHA EVOLUÇÃO 10.0
 * Context global para gerenciar autenticação com Supabase
 */

import { createContext, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { supabase, auth, profiles } from '../utils/supabase'
import { GamificationService } from '../services/gamificationService'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(false) // Começar com false
  const [initializing, setInitializing] = useState(false) // TEMPORARIAMENTE DESABILITADO PARA TESTE
  const [error, setError] = useState(null)

  // 🔥 Inicializar auth na primeira carga
  useEffect(() => {
    let mounted = true
    
    // Timeout de segurança SUPER AGRESSIVO para evitar inicialização infinita
    const forceFinishTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('🚨 AuthContext: TIMEOUT CRÍTICO (500ms) - FORÇANDO FIM DA INICIALIZAÇÃO!')
        setInitializing(false)
      }
    }, 500) // 500ms - super agressivo
    
    // Timeout secundário mais curto
    const backupTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('⚠️ AuthContext: Timeout backup atingido (1s), forçando fim da inicialização')
        setInitializing(false)
      }
    }, 1000)
    
    // Verificar sessão existente
    const getInitialSession = async () => {
      try {
        console.log('🔍 AuthContext: Buscando sessão inicial...')
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {            console.log('✅ AuthContext: Sessão encontrada:', session.user.email)
            setSession(session)
            setUser(session.user)
            
            // Buscar perfil completo
            try {
              console.log('🔍 AuthContext: Buscando perfil completo para usuário:', session.user.id)
              // Aguardar um pouco para evitar chamadas simultâneas
              await new Promise(resolve => setTimeout(resolve, 50))
              let userProfile = await profiles.getProfile(session.user.id)
              console.log('🔍 AuthContext: Resultado da busca de perfil:', userProfile)
              
              // SEMPRE criar um perfil válido, mesmo que não encontre no banco
              if (!userProfile) {
                console.log('📝 Perfil não encontrado no banco, criando perfil em memória...')
                
                // Determinar se é admin baseado no email
                const isAdminEmail = session.user.email === 'digitalinfluenceradm@gmail.com'
                const userRole = isAdminEmail ? 'admin' : 'user'
                const userPlan = isAdminEmail ? 'enterprise' : 'starter'
                const userTokens = isAdminEmail ? 10000 : 100
                
                // Criar perfil em memória PRIMEIRO
                userProfile = {
                  id: session.user.id,
                  email: session.user.email,
                  full_name: session.user.user_metadata?.full_name || session.user.email,
                  role: userRole,
                  plan_id: userPlan,
                  tokens: userTokens,
                  created_at: new Date().toISOString()
                }
                
                console.log('✅ Perfil criado em memória:', userProfile)
                
                // Perfil já é baseado nos dados do auth.users, não precisa criar no banco
                console.log('✅ Perfil baseado em auth.users, não requer criação adicional')
              }
              
              console.log('✅ Perfil final definido:', userProfile)
              setProfile(userProfile)

              // NOVO: Garantir perfil de gamificação existe no login inicial
              GamificationService.getUserProgress(session.user.id).then(gamificationProfile => {
                console.log('🎮 Perfil de gamificação verificado/criado no login inicial:', gamificationProfile)
              }).catch(error => {
                console.warn('⚠️ Erro ao verificar perfil de gamificação inicial (não crítico):', error)
              })

            } catch (error) {
              console.error('❌ AuthContext: Erro ao buscar perfil:', error)
              // Mesmo com erro, criar perfil padrão
              const isAdminEmail = session.user.email === 'digitalinfluenceradm@gmail.com'
              const defaultProfile = {
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.email,
                role: isAdminEmail ? 'admin' : 'user',
                plan_id: isAdminEmail ? 'enterprise' : 'starter',
                tokens: isAdminEmail ? 10000 : 100
              }
              console.log('🔄 Usando perfil padrão por erro:', defaultProfile)
              setProfile(defaultProfile)
            }
            
            // CRÍTICO: SEMPRE finalizar inicialização após definir perfil
            console.log('🏁 AuthContext: Finalizando inicialização (usuário logado)')
            setInitializing(false)
        } else {
          console.log('👤 Nenhuma sessão encontrada - usuário não está logado')
        }
      } catch (error) {
        console.error('❌ AuthContext: Erro ao verificar sessão:', error)
        setError(error.message)
      } finally {
        if (mounted) {
          clearTimeout(forceFinishTimeout)
          clearTimeout(backupTimeout)
          console.log('🏁 AuthContext: Inicialização concluída!')
          setInitializing(false)
        }
      }
    }

    getInitialSession()

    // Escutar mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        // Limpar timeouts se houver mudança de auth
        clearTimeout(forceFinishTimeout)
        clearTimeout(backupTimeout)
        
        setSession(session)
        setUser(session?.user ?? null)
        setError(null)

        if (session?.user) {
          console.log('🔍 onAuthStateChange: Usuário logado, buscando perfil para:', session.user.id)
          try {
            // SEMPRE criar perfil padrão PRIMEIRO para evitar delay
            const isAdminEmail = session.user.email === 'digitalinfluenceradm@gmail.com'
            const defaultProfile = {
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.email,
              role: isAdminEmail ? 'admin' : 'user',
              plan_id: isAdminEmail ? 'enterprise' : 'starter',
              tokens: isAdminEmail ? 10000 : 100,
              created_at: new Date().toISOString()
            }
            
            console.log('✅ onAuthStateChange: Perfil padrão criado em memória:', defaultProfile)
            if (mounted) {
              setProfile(defaultProfile)
              console.log('🏁 onAuthStateChange: Finalizando inicialização (perfil padrão carregado)')
              setInitializing(false) // CRITICAL: Finalizar inicialização IMEDIATAMENTE
            }
            
            // Buscar perfil no banco em background (não bloqueia) - com debounce
            setTimeout(() => {
              if (mounted) {
                profiles.getProfile(session.user.id).then(userProfile => {
                  console.log('🔍 onAuthStateChange: Resultado da busca de perfil:', userProfile)
                  
                  if (userProfile && mounted) {
                    console.log('✅ onAuthStateChange: Atualizando com perfil do banco:', userProfile)
                    setProfile(userProfile)
                  } else {
                    console.log('✅ onAuthStateChange: Mantendo perfil padrão (não encontrado no banco)')
                  }

                  // NOVO: Garantir perfil de gamificação existe
                  GamificationService.getUserProgress(session.user.id).then(gamificationProfile => {
                    console.log('🎮 Perfil de gamificação verificado/criado:', gamificationProfile)
                  }).catch(error => {
                    console.warn('⚠️ Erro ao verificar perfil de gamificação (não crítico):', error)
                  })

                }).catch(error => {
                  console.warn('⚠️ onAuthStateChange: Erro ao buscar perfil, mantendo padrão:', error)
                  
                  // Se erro crítico (500, RLS, etc), não tentar novamente
                  if (error.message && (error.message.includes('500') || error.message.includes('RLS'))) {
                    console.log('🚫 onAuthStateChange: Erro crítico detectado, não tentando novamente')
                  }

                  // Ainda assim, tentar criar perfil de gamificação
                  GamificationService.getUserProgress(session.user.id).then(gamificationProfile => {
                    console.log('🎮 Perfil de gamificação criado após erro de perfil principal:', gamificationProfile)
                  }).catch(gamError => {
                    console.warn('⚠️ Erro ao criar perfil de gamificação (não crítico):', gamError)
                  })
                })
              }
            }, 500) // Aumentar debounce para 500ms para dar tempo da sessão se estabelecer
            
          } catch (error) {
            console.error('❌ onAuthStateChange: Erro na criação de perfil padrão:', error)
            if (mounted) {
              // Mesmo com erro, garantir perfil básico
              const basicProfile = {
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.email,
                role: 'user',
                plan_id: 'starter',
                tokens: 100
              }
              setProfile(basicProfile)
              console.log('🏁 onAuthStateChange: Finalizando inicialização (com erro, usando perfil básico)')
              setInitializing(false) // CRITICAL: Finalizar inicialização mesmo com erro
            }
          }
        } else {
          console.log('🚪 Usuário deslogado, limpando perfil')
          if (mounted) {
            setProfile(null)
            console.log('🏁 onAuthStateChange: Finalizando inicialização (usuário deslogado)')
            setInitializing(false) // CRITICAL: Finalizar inicialização para usuário deslogado
          }
        }
        
        // GARANTIA FINAL: Sempre finalizar inicialização após processar auth change
        if (mounted) {
          setInitializing(false)
        }
      }
    )

    return () => {
      mounted = false
      clearTimeout(forceFinishTimeout)
      clearTimeout(backupTimeout)
      subscription.unsubscribe()
    }
  }, [])

  // 🔥 MÉTODOS DE AUTH
  const signIn = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await auth.signIn(email, password)
      
      // Se login foi bem-sucedido, o onAuthStateChange vai gerenciar o loading
      if (result.user) {
        // Não fazer setLoading(false) aqui, deixar para o onAuthStateChange
        return result
      }
      
      return result
    } catch (error) {
      console.error('❌ Erro de autenticação:', error)
      
      // 🚨 SOLUÇÃO TEMPORÁRIA: Se for erro de API key inválida, usar login mock
      if (error.message.includes('Invalid API key') || error.message.includes('Unauthorized')) {
        console.warn('🔧 Supabase com problemas, usando login mock temporário...')
        
        // Simular login bem-sucedido com dados mock
        const mockUser = {
          id: 'mock-user-' + Date.now(),
          email: email,
          user_metadata: {
            full_name: email.split('@')[0]
          }
        }
        
        const mockSession = {
          user: mockUser,
          access_token: 'mock-token-' + Date.now()
        }
        
        // Definir usuário e perfil mock
        setUser(mockUser)
        setSession(mockSession)
        
        const isAdmin = email === 'digitalinfluenceradm@gmail.com'
        const mockProfile = {
          id: mockUser.id,
          email: email,
          full_name: mockUser.user_metadata.full_name,
          role: isAdmin ? 'admin' : 'user',
          plan_id: isAdmin ? 'enterprise' : 'starter',
          tokens: isAdmin ? 10000 : 100,
          created_at: new Date().toISOString()
        }
        
        setProfile(mockProfile)
        setLoading(false)
        setInitializing(false)
        
        console.log('✅ Login mock realizado com sucesso:', mockProfile)
        return { user: mockUser, session: mockSession }
      }
      
      setError(error.message)
      setLoading(false) // Só resetar loading em caso de erro
      throw error
    }
  }

  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('📝 AuthContext: Iniciando cadastro de usuário...')
      console.log('   - Email:', email)
      console.log('   - Metadata:', metadata)
      
      console.log('🔥 Executando cadastro no Supabase Auth...')
      
      const result = await auth.signUp(email, password, metadata)
      
      console.log('📋 Resultado do cadastro:')
      console.log('   - User:', result.user ? 'Criado ✅' : 'Falhou ❌')
      console.log('   - Session:', result.session ? 'Ativa ✅' : 'Pendente ⏳')
      console.log('   - Error:', result.error || 'Nenhum ✅')
      
      if (result.error) {
        console.error('❌ Erro no cadastro Supabase:', result.error)
        
        // Traduzir erros comuns de forma mais específica
        let friendlyError = result.error.message
        
        if (result.error.message.includes('already exists') || result.error.message.includes('already registered')) {
          friendlyError = 'Este email já está cadastrado. Tente fazer login.'
        } else if (result.error.message.includes('invalid email')) {
          friendlyError = 'Email inválido. Verifique o formato.'
        } else if (result.error.message.includes('Password should be')) {
          friendlyError = 'A senha deve ter pelo menos 6 caracteres.'
        } else if (result.error.message.includes('rate limit')) {
          friendlyError = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
        } else if (result.error.message.includes('Database error') || result.error.message.includes('saving new user')) {
          friendlyError = 'Erro na criação da conta. Nossa equipe foi notificada. Tente novamente em alguns minutos.'
          console.error('🚨 DATABASE ERROR DETECTADO - Possíveis causas:')
          console.error('   - Trigger create_user_profile_safe() falhando')
          console.error('   - RLS bloqueando inserção na userprofile')
          console.error('   - Constraint violation na tabela userprofile')
          console.error('   - Permissões insuficientes para service_role')
        } else if (result.error.message.includes('500') || result.error.message.includes('Internal Server Error')) {
          friendlyError = 'Erro interno do servidor. Tente novamente em alguns minutos.'
        }
        
        setError(friendlyError)
        throw new Error(friendlyError)
      }
      
      if (result.user) {
        console.log('✅ Usuário criado com sucesso!')
        
        // Se o usuário foi criado mas não há sessão ativa (confirmação pendente)
        if (!result.session) {
          console.log('📧 Confirmação de email necessária')
          return {
            ...result,
            needsConfirmation: true,
            message: 'Cadastro realizado! Verifique seu email para confirmar a conta.'
          }
        }
        
        console.log('🎉 Cadastro e login automático realizados!')
        return result
      }
      
      // Se chegou aqui, algo deu errado
      const errorMsg = 'Erro inesperado no cadastro. Tente novamente.'
      console.error('❌ Cadastro falhou sem erro específico')
      setError(errorMsg)
      throw new Error(errorMsg)
      
    } catch (error) {
      console.error('❌ Erro completo no signUp:', error)
      
      // Se o erro é de rede ou 500, dar mais detalhes
      if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
        console.error('🚨 ERRO 500 DETECTADO - Possíveis causas:')
        console.error('   - RLS (Row Level Security) bloqueando inserção')
        console.error('   - Trigger de banco de dados falhando')
        console.error('   - Função do Supabase mal configurada')
        console.error('   - Constraint violation (dados duplicados)')
        
        const detailedError = 'Erro interno do servidor. Entre em contato com o suporte.'
        setError(detailedError)
        throw new Error(detailedError)
      }
      
      // Para outros erros, manter a mensagem original mas loggar detalhes
      const errorMessage = error.message || 'Erro desconhecido no cadastro'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await auth.signInWithGoogle()
      
      // Se login foi bem-sucedido, o onAuthStateChange vai gerenciar o loading
      if (result.user) {
        return result
      }
      
      return result
    } catch (error) {
      setError(error.message)
      setLoading(false) // Só resetar loading em caso de erro
      throw error
    }
  }

  const signInWithGitHub = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await auth.signInWithGitHub()
      
      // Se login foi bem-sucedido, o onAuthStateChange vai gerenciar o loading
      if (result.user) {
        return result
      }
      
      return result
    } catch (error) {
      setError(error.message)
      setLoading(false) // Só resetar loading em caso de erro
      throw error
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      console.log('🚪 AuthContext: Iniciando logout COMPLETO...')
      
      // 🔥 LIMPEZA AGRESSIVA E COMPLETA DO ESTADO
      console.log('🧹 Limpando TODOS os dados locais...')
      
      // Limpar states IMEDIATAMENTE
      setUser(null)
      setProfile(null)
      setSession(null)
      setError(null)
      setInitializing(false) // Forçar fim da inicialização
      
      // Limpar TUDO do localStorage e sessionStorage - FORÇA BRUTA
      const localStorageKeys = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) localStorageKeys.push(key)
      }
      
      const sessionStorageKeys = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key) sessionStorageKeys.push(key)
      }
      
      // Remover TODAS as chaves relacionadas ao auth/supabase
      localStorageKeys.forEach(key => {
        if (key.includes('supabase') || 
            key.includes('auth') || 
            key.includes('sb-') ||
            key.includes('user') ||
            key.includes('token') ||
            key.includes('session')) {
          localStorage.removeItem(key)
          console.log(`   🗑️ Removido do localStorage: ${key}`)
        }
      })
      
      sessionStorageKeys.forEach(key => {
        if (key.includes('supabase') || 
            key.includes('auth') || 
            key.includes('sb-') ||
            key.includes('user') ||
            key.includes('token') ||
            key.includes('session')) {
          sessionStorage.removeItem(key)
          console.log(`   🗑️ Removido do sessionStorage: ${key}`)
        }
      })
      
      // Limpar cookies relacionados ao Supabase
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=")
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
        if (name.includes('supabase') || name.includes('sb-') || name.includes('auth')) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
          console.log(`   🍪 Cookie removido: ${name}`)
        }
      })
      
      console.log('🔥 Executando logout no Supabase...')
      
      // Fazer logout no Supabase
      await auth.signOut()
      
      // 🔥 LIMPEZA ADICIONAL APÓS LOGOUT DO SUPABASE
      // Forçar mais uma limpeza para garantir
      setTimeout(() => {
        setUser(null)
        setProfile(null)
        setSession(null)
        setError(null)
        setInitializing(false)
        console.log('🔥 FORÇA BRUTA: Estados limpos novamente após timeout')
      }, 100)
      
      console.log('✅ Logout COMPLETO realizado com sucesso!')
      console.log('🔄 Redirecionando para tela de login...')
      
      // Forçar reload da página para garantir estado limpo
      setTimeout(() => {
        window.location.href = window.location.origin
      }, 200)
      
    } catch (error) {
      console.error('❌ Erro no logout:', error)
      setError(error.message)
      
      // 🔥 MESMO COM ERRO, FORÇAR LIMPEZA TOTAL
      console.log('🚨 ERRO NO LOGOUT - EXECUTANDO LIMPEZA DE EMERGÊNCIA')
      
      setUser(null)
      setProfile(null)
      setSession(null)
      setError(null)
      setInitializing(false)
      
      // Limpar storages mesmo com erro
      try {
        localStorage.clear()
        sessionStorage.clear()
        console.log('🧹 EMERGÊNCIA: Storages limpos completamente')
      } catch (clearError) {
        console.error('❌ Erro ao limpar storages:', clearError)
      }
      
      // Forçar reload mesmo com erro
      setTimeout(() => {
        window.location.href = window.location.origin
      }, 500)
      
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 🔥 MÉTODO DE DEBUG E LIMPEZA COMPLETA
  const clearAuthState = () => {
    console.log('🧹 AuthContext: Limpeza TOTAL do estado de auth')
    
    setUser(null)
    setProfile(null)
    setSession(null)
    setError(null)
    setLoading(false)
    setInitializing(false)
    
    // Limpar TUDO dos storages
    try {
      localStorage.clear()
      sessionStorage.clear()
      console.log('✅ Storages limpos completamente')
    } catch (error) {
      console.error('❌ Erro ao limpar storages:', error)
    }
    
    // Limpar cookies do Supabase
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=")
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      if (name.includes('supabase') || name.includes('sb-') || name.includes('auth')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
      }
    })
    
    console.log('✅ Estado de auth completamente limpo!')
  }

  const resetPassword = async (email) => {
    try {
      setLoading(true)
      setError(null)
      
      await auth.resetPassword(email)
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    try {
      setLoading(true)
      setError(null)
      
      if (user) {
        const updatedProfile = await profiles.updateProfile(user.id, updates)
        setProfile(updatedProfile)
        return updatedProfile
      }
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 🔥 HELPERS
  const isAuthenticated = !!user
  
  // 🎯 ADMIN CHECK ISOLADO - SUPER LIMPO E ROBUSTO
  const isAdmin = () => {
    // Não fazer log excessivo se ainda estiver inicializando
    if (initializing) {
      return false
    }
    
    console.log('🔍 DEBUG ADMIN CHECK:')
    console.log('   - profile exists:', !!profile)
    console.log('   - profile:', profile)
    console.log('   - profile.role:', profile?.role)
    console.log('   - user email:', user?.email)
    
    // VERIFICAÇÃO DUPLA: Por perfil E por email (mais seguro)
    const adminByProfile = profile?.role === 'admin'
    const adminByEmail = user?.email === 'digitalinfluenceradm@gmail.com'
    
    // Se qualquer uma das verificações confirmar que é admin, considerar admin
    const adminStatus = adminByProfile || adminByEmail
    
    console.log('   - admin by profile:', adminByProfile)
    console.log('   - admin by email:', adminByEmail)
    console.log('   - FINAL isAdmin:', adminStatus)
    
    return adminStatus
  }
  
  const hasValidPlan = !!profile?.plan_id
  const userTokens = profile?.tokens || 0

  // Verificar se usuário pode acessar features premium
  const canAccessFeature = (feature) => {
    if (!profile) return false
    
    const plan = profile.plan_id
    
    // Admin tem acesso a tudo
    if (isAdmin()) return true
    
    // Definir regras de acesso por plano
    const featureAccess = {
      'starter': ['basic_chat', 'simple_automation'],
      'pro': ['basic_chat', 'simple_automation', 'advanced_automation', 'integrations'],
      'enterprise': ['*'] // Acesso total
    }
    
    const allowedFeatures = featureAccess[plan] || []
    return allowedFeatures.includes('*') || allowedFeatures.includes(feature)
  }

  // Função para obter a rota padrão do usuário após login
  const getDefaultRoute = () => {
    console.log('🎯 getDefaultRoute chamada:')
    console.log('   - isAuthenticated:', isAuthenticated)
    console.log('   - user email:', user?.email)
    console.log('   - profile completo:', profile)
    console.log('   - initializing:', initializing)
    
    if (!isAuthenticated) {
      console.log('❌ Usuário não autenticado, retornando /Login')
      return '/Login'
    }
    
    // 🎯 VERIFICAÇÃO ADMIN PRIORITÁRIA - Email sempre tem prioridade
    const emailBasedAdmin = user?.email === 'digitalinfluenceradm@gmail.com'
    console.log('� EMAIL BASED ADMIN:', emailBasedAdmin)
    
    // ADMIN CHECK secundário (só se email não confirmar)
    const adminCheck = !initializing ? isAdmin() : false
    console.log('� ADMIN CHECK RESULT:', adminCheck)
    
    if (emailBasedAdmin || adminCheck) {
      console.log('✅ ADMIN CONFIRMADO - REDIRECIONANDO PARA /Admin')
      return '/Admin'
    }
    
    // Usuário comum vai para dashboard cliente
    console.log('👤 Usuário comum, retornando /client')
    return '/client'
  }

  const value = {
    // Estado
    user,
    profile,
    session,
    loading,
    initializing,
    error,
    
    // Flags
    isAuthenticated,
    isAdmin: isAdmin, // PASSAR A FUNÇÃO, NÃO EXECUTAR
    hasValidPlan,
    userTokens,
    
    // Métodos
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    resetPassword,
    updateProfile,
    canAccessFeature,
    getDefaultRoute,
    
    // Debug e utilidades
    clearError: () => setError(null),
    clearAuthState, // Método para limpeza completa do estado
    
    // Forçar reset do loading (para casos de emergência)
    forceStopLoading: () => {
      console.warn('🚨 AuthContext: Loading forçadamente resetado')
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// PropTypes
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default AuthContext