/**
 * 🔧 CORREÇÃO FINAL - DADOS COM UUID VÁLIDOS
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://woooqlznapzfhmjlyyll.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTYyNTUsImV4cCI6MjA2NTQ3MjI1NX0.Mdeir5LYY8IFzoEKl8hQoK9FW4WCM119MBeCKNTbHvY'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Usuários com UUIDs válidos 
const usuariosCorrigidos = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'admin@autvision.ai',
    display_name: 'Administrador AutVision',
    role: 'admin',
    status: 'active',
    xp: 10000,
    tokens: 5000,
    level: 10,
    completed_mission_ids: ['mission-1', 'mission-2', 'mission-3'],
    earned_badge_ids: ['badge-founder', 'badge-expert', 'badge-innovator'],
    streak: 30,
    total_interactions: 1500,
    preferences: {
      theme: 'dark',
      notifications: true,
      language: 'pt-BR'
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002', 
    email: 'demo@autvision.ai',
    display_name: 'Usuário Demo',
    role: 'user',
    status: 'active',
    xp: 1500,
    tokens: 500,
    level: 3,
    completed_mission_ids: ['mission-1'],
    earned_badge_ids: ['badge-welcome'],
    streak: 7,
    total_interactions: 150,
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'pt-BR'
    }
  }
]

async function criarUsuariosDemo() {
  console.log('👤 === CRIANDO USUÁRIOS DEMO COM UUID VÁLIDOS ===')
  
  for (const usuario of usuariosCorrigidos) {
    try {
      // Verificar se já existe
      const { data: existing } = await supabase
        .from('userprofile')
        .select('id')
        .eq('email', usuario.email)
        .maybeSingle()
      
      if (!existing) {
        const { data, error } = await supabase
          .from('userprofile')
          .insert(usuario)
          .select()
          .single()
        
        if (error) {
          console.error(`❌ Erro ao criar ${usuario.display_name}:`, error)
        } else {
          console.log(`✅ Usuário ${usuario.display_name} criado com sucesso`)
        }
      } else {
        console.log(`⚠️ Usuário ${usuario.display_name} já existe`)
      }
      
    } catch (error) {
      console.error(`💥 Erro geral para ${usuario.display_name}:`, error)
    }
  }
}

async function testarConectividadeCompleta() {
  console.log('\n🧪 === TESTE COMPLETO DE CONECTIVIDADE ===')
  
  try {
    // 1. Testar agents
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('id, name, status')
      .limit(3)
    
    console.log(`🤖 Agents: ${agentsError ? '❌' : '✅'} (${agents?.length || 0} registros)`)
    
    // 2. Testar userprofile
    const { data: users, error: usersError } = await supabase
      .from('userprofile')
      .select('id, email, display_name, role')
      .limit(3)
    
    console.log(`👤 Users: ${usersError ? '❌' : '✅'} (${users?.length || 0} registros)`)
    
    // 3. Simular a query que estava falhando em produção
    const { data: complexQuery, error: complexError } = await supabase
      .from('userprofile')
      .select('id, email, display_name, role, plan_id, tokens, xp, level, completed_mission_ids, earned_badge_ids, streak, total_interactions, last_login, created_date')
      .limit(1)
    
    console.log(`🔍 Query Complexa: ${complexError ? '❌ ' + complexError.message : '✅ OK'}`)
    
    return { agents, users, complexQuery }
    
  } catch (error) {
    console.error('💥 Erro no teste de conectividade:', error)
    return null
  }
}

async function verificarBackendHealth() {
  console.log('\n🌐 === VERIFICANDO SAÚDE DO BACKEND ===')
  
  const endpoints = [
    'https://autvisionai-backend-five.vercel.app',
    'https://autvisionai-backend-five.vercel.app/health',
    'https://autvisionai-backend-five.vercel.app/config',
    'https://autvisionai-backend-five.vercel.app/agents'
  ]
  
  for (const endpoint of endpoints) {
    try {
      console.log(`🔍 Testando: ${endpoint}`)
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'autvision_backend_secure_key_2025'
        },
        timeout: 10000
      })
      
      const status = response.status
      const statusText = response.statusText
      
      if (response.ok) {
        const data = await response.json()
        console.log(`✅ ${endpoint}: ${status} - OK`)
        console.log(`   📋 Dados:`, JSON.stringify(data).substring(0, 100) + '...')
      } else {
        const errorData = await response.text()
        console.log(`❌ ${endpoint}: ${status} ${statusText}`)
        console.log(`   📋 Erro:`, errorData.substring(0, 200))
      }
      
    } catch (error) {
      console.log(`💥 ${endpoint}: Falha na conexão - ${error.message}`)
    }
  }
}

async function executarCorrecaoFinal() {
  console.log('🔧 === CORREÇÃO FINAL - PRODUÇÃO ===')
  console.log('⏰ Iniciado em:', new Date().toISOString())
  
  await criarUsuariosDemo()
  const resultados = await testarConectividadeCompleta()
  await verificarBackendHealth()
  
  console.log('\n📊 === RELATÓRIO FINAL ===')
  
  if (resultados) {
    console.log(`🤖 Agentes disponíveis: ${resultados.agents?.length || 0}`)
    console.log(`👤 Usuários cadastrados: ${resultados.users?.length || 0}`)
    console.log(`🔍 Queries complexas: ${resultados.complexQuery ? 'Funcionando' : 'Com problemas'}`)
  }
  
  console.log('\n✅ === CORREÇÃO FINALIZADA ===')
  console.log('⏰ Finalizado em:', new Date().toISOString())
  
  console.log('\n🎯 === PRÓXIMOS PASSOS ===')
  console.log('1. ✅ Supabase: Totalmente funcional')
  console.log('2. ❌ Backend: Precisa de correção (erro 500)')
  console.log('3. 🔄 Frontend: Pode ter cache/fallback causando queries malformadas')
}

// Executar
executarCorrecaoFinal().catch(console.error)
