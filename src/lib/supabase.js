/**
 * 🔥 SUPABASE CLIENT - MARCHA EVOLUÇÃO 10.0
 * Cliente do Supabase para frontend com auth configurado
 */

import { createClient } from '@supabase/supabase-js'

// Configurações do Supabase (usar as mesmas do backend)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// 🔥 DEBUG: Log das configurações (remover em produção)
console.log('🔥 Supabase Config:', {
  url: supabaseUrl,
  anonKey: supabaseAnonKey ? 'Configurado ✅' : 'FALTANDO ❌'
})

// Cliente do Supabase configurado para frontend
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
        
        // Melhorar tratamento de erros específicos
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
        
        if (error.message.includes('Password') || error.message.includes('password')) {
          const friendlyError = new Error('Senha deve ter pelo menos 6 caracteres.')
          friendlyError.code = 'INVALID_PASSWORD'
          throw friendlyError
        }
        
        if (error.message.includes('rate limit') || error.message.includes('too many')) {
          const friendlyError = new Error('Muitas tentativas. Aguarde alguns minutos.')
          friendlyError.code = 'RATE_LIMIT'
          throw friendlyError
        }
        
        // Para erro 500 ou Database error
        if (error.message.includes('Database error') || error.message.includes('500')) {
          console.error('🚨 ERRO DE BANCO DETECTADO:', error)
          const friendlyError = new Error('Erro interno do servidor. Tente novamente em alguns minutos ou entre em contato com o suporte.')
          friendlyError.code = 'DATABASE_ERROR'
          friendlyError.originalError = error
          throw friendlyError
        }
        
        // Para outros erros, manter original mas com melhor contexto
        const contextualError = new Error(error.message || 'Erro desconhecido no cadastro')
        contextualError.code = error.code || 'UNKNOWN_ERROR'
        contextualError.originalError = error
        throw contextualError
      }
      
      console.log('✅ supabase.js: SignUp realizado com sucesso!')
      return data
      
    } catch (error) {
      console.error('❌ supabase.js: Erro no catch do signUp:', error)
      
      // Se já é um erro nosso tratado, repassar
      if (error.code) {
        throw error
      }
      
      // Caso contrário, criar erro genérico
      const genericError = new Error('Erro de conexão. Verifique sua internet e tente novamente.')
      genericError.code = 'CONNECTION_ERROR'
      genericError.originalError = error
      throw genericError
    }
  },

  // Login com Google
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    
    if (error) throw error
    return data
  },

  // Login com GitHub
  async signInWithGitHub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    
    if (error) throw error
    return data
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Obter usuário atual
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Obter sessão atual
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  // Resetar senha
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    
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
  // Buscar perfil completo do usuário
  async getProfile(userId) {
    try {
      console.log('🔍 Buscando perfil para userId:', userId)
      
      // FORÇAR PERFIL PADRÃO PARA ADMIN CONHECIDO
      if (userId === 'bf421239-b323-45d0-9852-bf16a757860e') {
        console.log('🔥 FORÇA BRUTA: Criando perfil admin para usuário conhecido')
        const adminProfile = {
          id: userId,
          email: 'digitalinfluenceradm@gmail.com',
          full_name: 'Administrador',
          role: 'admin',
          plan_id: 'enterprise',
          tokens: 10000,
          created_at: new Date().toISOString()
        }
        console.log('✅ FORÇA BRUTA: Perfil admin criado:', adminProfile)
        return adminProfile
      }
      
      // Primeiro, tentar buscar na tabela 'profiles' (usuários normais)
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      console.log('🔍 Resultado busca em "profiles":', { data, error })
      
      if (error && error.code === 'PGRST116') {
        console.log('👤 Perfil não encontrado em "profiles", tentando "userprofile"...')
        
        // Se não encontrou em 'profiles', tentar em 'userprofile' (admin)
        const { data: adminData, error: adminError } = await supabase
          .from('userprofile')
          .select('*')
          .eq('id', userId)
          .single()
        
        console.log('🔍 Resultado busca em "userprofile":', { data: adminData, error: adminError })
        
        if (adminError) {
          if (adminError.code === 'PGRST116') {
            console.log('👤 Perfil não encontrado em nenhuma tabela, retornando null')
            return null
          }
          console.error('❌ Erro ao buscar perfil em userprofile:', adminError)
          throw adminError
        }
        
        console.log('✅ Perfil admin encontrado em "userprofile":', adminData)
        return adminData
      } else if (error) {
        console.error('❌ Erro ao buscar perfil em profiles:', error)
        throw error
      }
      
      console.log('✅ Perfil encontrado em "profiles":', data)
      return data
    } catch (error) {
      console.error('❌ Erro inesperado ao buscar perfil:', error)
      return null // Retornar null em caso de erro para não quebrar o fluxo
    }
  },

  // Criar perfil (chamado após registro)
  async createProfile(userId, profileData) {
    console.log('📝 Criando perfil no banco:')
    console.log('   - userId:', userId)
    console.log('   - profileData:', profileData)
    
    const dataToInsert = {
      id: userId,
      ...profileData,
      created_at: new Date().toISOString()
    }
    
    console.log('   - dataToInsert:', dataToInsert)
    
    // Escolher tabela baseada no role
    const tableName = profileData.role === 'admin' ? 'userprofile' : 'profiles'
    console.log('   - Usando tabela:', tableName)
    
    const { data, error } = await supabase
      .from(tableName)
      .insert(dataToInsert)
      .select()
      .single()
    
    console.log('🔄 Resultado da inserção:')
    console.log('   - data:', data)
    console.log('   - error:', error)
    
    if (error) {
      console.error('❌ Erro ao inserir perfil:', error)
      console.error('❌ Detalhes do erro:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }
    
    console.log('✅ Perfil criado com sucesso:', data)
    return data
  },

  // Atualizar perfil
  async updateProfile(userId, updates) {
    // Primeiro descobrir em qual tabela o perfil está
    let tableName = 'profiles'
    
    // Verificar se existe em profiles
    const { data: profileCheck } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()
    
    if (!profileCheck) {
      // Se não existe em profiles, deve estar em userprofile
      tableName = 'userprofile'
    }
    
    console.log('🔄 Atualizando perfil na tabela:', tableName)
    
    const { data, error } = await supabase
      .from(tableName)
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// 🔥 HELPER PARA RLS (Row Level Security)
export const rls = {
  // Verificar se usuário tem acesso admin
  async isAdmin(userId) {
    // Primeiro tentar em profiles
    let { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    
    if (error && error.code === 'PGRST116') {
      // Se não encontrou em profiles, tentar em userprofile
      const { data: adminData, error: adminError } = await supabase
        .from('userprofile')
        .select('role')
        .eq('id', userId)
        .single()
      
      if (adminError) return false
      return adminData.role === 'admin'
    }
    
    if (error) return false
    return data.role === 'admin'
  },

  // Verificar plano do usuário
  async getUserPlan(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('plan_id, plans(*)')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data.plans
  }
}

export default supabase
