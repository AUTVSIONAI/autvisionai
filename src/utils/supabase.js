/**
 * 🔥 SUPABASE CLIENT - CONFIGURAÇÃO FRONTEND CONSOLIDADA
 * Cliente Supabase único para uso no frontend
 */

import { createClient } from '@supabase/supabase-js'

// Configurações do Supabase usando variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificação de configuração
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('🚨 ERRO: Variáveis de ambiente do Supabase não configuradas!')
  console.error('Verifique se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no arquivo .env')
  throw new Error('Configuração do Supabase incompleta')
}

// Log para diagnóstico (apenas uma vez)
console.log('🔄 Inicializando Supabase Client Único:', {
  url: supabaseUrl,
  keyConfigured: supabaseAnonKey ? 'Sim' : 'Não'
})

// Criar cliente Supabase único com configurações otimizadas
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // Mais seguro para SPA
  }
})

// 🔥 HELPER FUNCTIONS PARA AUTH
export const auth = {
  // Fazer login com email/senha
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  // Registrar usuário
  async signUp(email, password, metadata = {}) {
    console.log('🔥 supabase.js: Executando signUp...')
    console.log('   - Email:', email)
    console.log('   - Metadata:', metadata)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata // Dados extras do perfil
        }
      })
      
      console.log('📋 supabase.js: Resultado do signUp:')
      console.log('   - Data:', data)
      console.log('   - Error:', error)
      
      if (error) {
        console.error('❌ supabase.js: Erro no signUp:', error)
        
        // 🔥 MELHORAR TRATAMENTO DE ERROS ESPECÍFICOS
        if (error.message.includes('already exists') || error.message.includes('already registered')) {
          const friendlyError = new Error('Este email já está cadastrado. Tente fazer login.')
          friendlyError.code = 'EMAIL_ALREADY_EXISTS'
          throw friendlyError
        }
        
        if (error.message.includes('Invalid email')) {
          const friendlyError = new Error('Email inválido. Verifique o formato.')
          friendlyError.code = 'INVALID_EMAIL'
          throw friendlyError
        }
        
        throw error
      }

      // 🚀 CRIAR PERFIL MANUALMENTE APÓS SIGNUP (SOLUÇÃO DEFINITIVA)
      if (data?.user?.id) {
        console.log('🔄 Criando perfil de gamificação manualmente...')
        
        const profileResult = await createUserProfileManual(
          data.user.id,
          email,
          metadata.full_name || metadata.name || email.split('@')[0]
        )

        if (profileResult.success) {
          console.log('✅ Perfil criado com sucesso via função manual!')
        } else {
          console.error('⚠️ Erro ao criar perfil (não crítico):', profileResult.error)
          // Não falhar o signup por causa do perfil
        }
      }
      
      return data
    } catch (error) {
      console.error('❌ supabase.js: Erro geral no signUp:', error)
      throw error
    }
  },

  // Fazer logout
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Obter usuário atual
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Redefinir senha
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  },

  // Atualizar senha
  async updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
  },

  // Atualizar perfil
  async updateProfile(updates) {
    const { error } = await supabase.auth.updateUser({
      data: updates
    })
    
    if (error) throw error
  }
}

// 🔥 HELPER PARA PERFIS DE USUÁRIO
export const profiles = {
  // Buscar perfil do usuário
  async getProfile(userId) {
    console.log('🔍 Buscando perfil para userId:', userId)
    
    if (!userId) {
      console.log('❌ userId não fornecido')
      return null
    }
    
    // Cache simples para evitar requisições repetidas
    const cacheKey = `profile_${userId}`
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      console.log('📦 Usando perfil do cache')
      return JSON.parse(cached)
    }
    
    try {
      // Buscar dados do usuário autenticado diretamente via auth
      console.log('🔍 Buscando dados do usuário via auth.getUser()...')
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('❌ Erro ao buscar usuário autenticado:', authError)
        return null
      }
      
      if (!user || user.id !== userId) {
        console.log('❌ Usuário não autenticado ou ID não confere')
        return null
      }
      
      // Criar perfil baseado nos dados do usuário autenticado
      const isAdminEmail = user.email === 'digitalinfluenceradm@gmail.com'
      const userProfile = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email,
        role: isAdminEmail ? 'admin' : 'user',
        plan_id: isAdminEmail ? 'enterprise' : 'starter',
        tokens: isAdminEmail ? 10000 : 100,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at
      }
      
      console.log('✅ Perfil criado baseado em auth.users:', userProfile)
      
      // Cachear o perfil
      sessionStorage.setItem(cacheKey, JSON.stringify(userProfile))
      
      return userProfile
      
    } catch (error) {
      console.error('❌ Erro ao buscar perfil:', error)
      
      // Se erro de rede ou autenticação, limpar cache
      if (error.message.includes('Failed to fetch') || error.message.includes('401')) {
        sessionStorage.removeItem(cacheKey)
      }
      
      return null
    }
  },

  // Criar perfil (na verdade, apenas retorna os dados do usuário autenticado)
  async createProfile(userId, profileData) {
    console.log('🔄 createProfile: Usuários estão em auth.users, não criando em profiles')
    console.log('   - userId:', userId)
    console.log('   - profileData:', profileData)
    
    // Como os usuários já existem em auth.users, apenas retornamos os dados fornecidos
    // com o ID correto
    const userProfile = {
      id: userId,
      ...profileData
    }
    
    console.log('✅ createProfile: Retornando perfil baseado em auth.users:', userProfile)
    return userProfile
  },

  // Atualizar perfil
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    
    // Limpar cache
    const cacheKey = `profile_${userId}`
    sessionStorage.removeItem(cacheKey)
    
    return data
  }
}

/**
 * 🔥 CRIAR PERFIL DE USUÁRIO MANUALMENTE
 * Como o trigger do banco não está funcionando, vamos criar via aplicação
 */
export const createUserProfileManual = async (userId, email, fullName = null) => {
  console.log('🔄 Criando perfil manualmente para:', { userId, email, fullName })
  
  try {
    // Verificar se perfil já existe
    const { data: existingProfile, error: checkError } = await supabase
      .from('userprofile')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Erro ao verificar perfil existente:', checkError)
      throw checkError
    }

    if (existingProfile) {
      console.log('✅ Perfil já existe, não precisa criar')
      return { success: true, profile: existingProfile, message: 'Profile already exists' }
    }

    // Criar perfil novo
    const profileData = {
      id: userId,
      email: email || '',
      display_name: fullName || email || 'Usuário Vision',
      role: 'user',
      plan_id: null,
      tokens: 100,
      xp: 0,
      level: 1,
      streak: 0,
      total_interactions: 0,
      last_login: new Date().toISOString(),
      created_date: new Date().toISOString()
    }

    console.log('📝 Inserindo perfil:', profileData)

    const { data: newProfile, error: insertError } = await supabase
      .from('userprofile')
      .insert(profileData)
      .select()
      .single()

    if (insertError) {
      console.error('❌ Erro ao inserir perfil:', insertError)
      throw insertError
    }

    console.log('✅ Perfil criado com sucesso:', newProfile)
    return { success: true, profile: newProfile, message: 'Profile created successfully' }

  } catch (error) {
    console.error('❌ Erro na criação manual do perfil:', error)
    return { success: false, error: error.message, message: 'Failed to create profile' }
  }
}

export default supabase
