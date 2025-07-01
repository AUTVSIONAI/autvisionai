/**
 * 🔍 DIAGNÓSTICO DE QUERIES SUPABASE - PRODUÇÃO
 * 
 * Script para identificar e corrigir queries malformadas que estão causando
 * erros 400/409 em produção
 */

// Importar configuração do Supabase
import { createClient } from '@supabase/supabase-js'

// URLs e chaves de produção (corretas do .env.production)
const SUPABASE_URL = 'https://woooqlznapzfhmjlyyll.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTYyNTUsImV4cCI6MjA2NTQ3MjI1NX0.Mdeir5LYY8IFzoEKl8hQoK9FW4WCM119MBeCKNTbHvY'

console.log('🚀 Conectando ao Supabase de produção...')
console.log('📍 URL:', SUPABASE_URL)

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function diagnosticarTabelas() {
  console.log('\n📊 === DIAGNÓSTICO DAS TABELAS ===')
  
  try {
    // 1. Testar tabela agents
    console.log('\n🤖 Testando tabela agents...')
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('*')
      .limit(5)
    
    if (agentsError) {
      console.error('❌ Erro na tabela agents:', agentsError)
    } else {
      console.log('✅ Tabela agents OK - Registros encontrados:', agents?.length || 0)
      if (agents?.length > 0) {
        console.log('📋 Primeira entrada:', agents[0])
      }
    }

    // 2. Testar tabela userprofile
    console.log('\n👤 Testando tabela userprofile...')
    const { data: profiles, error: profileError } = await supabase
      .from('userprofile')
      .select('id, email, display_name, role, xp, level, tokens')
      .limit(3)
    
    if (profileError) {
      console.error('❌ Erro na tabela userprofile:', profileError)
    } else {
      console.log('✅ Tabela userprofile OK - Registros encontrados:', profiles?.length || 0)
      if (profiles?.length > 0) {
        console.log('📋 Primeira entrada:', profiles[0])
      }
    }

    // 3. Testar queries específicas que estão falhando
    console.log('\n🔍 Testando queries problemáticas...')
    
    // Query que estava gerando erro 400/409
    const { data: testQuery, error: testError } = await supabase
      .from('userprofile')
      .select('id, email, display_name, role, plan_id, tokens, xp, level, completed_mission_ids, earned_badge_ids, streak, total_interactions, last_login, created_date')
      .limit(1)
    
    if (testError) {
      console.error('❌ Query problemática falhou:', testError)
    } else {
      console.log('✅ Query teste funcionou - Dados:', testQuery?.length || 0)
    }

  } catch (error) {
    console.error('💥 Erro geral no diagnóstico:', error)
  }
}

async function testarBackendAgents() {
  console.log('\n🌐 === TESTANDO BACKEND /agents ===')
  
  try {
    const backendUrl = 'https://autvisionai-backend-five.vercel.app/agents'
    console.log('📡 Testando:', backendUrl)
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'autvision_backend_secure_key_2025'
      }
    })
    
    console.log('📊 Status:', response.status)
    console.log('📊 Status Text:', response.statusText)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Backend /agents funcionando!')
      console.log('📋 Dados recebidos:', data)
    } else {
      const errorText = await response.text()
      console.error('❌ Backend /agents falhou:')
      console.error('📊 Erro:', errorText)
    }
    
  } catch (error) {
    console.error('💥 Erro ao testar backend:', error)
  }
}

async function executarDiagnostico() {
  console.log('🔍 === DIAGNÓSTICO COMPLETO - PRODUÇÃO ===')
  console.log('⏰ Iniciado em:', new Date().toISOString())
  
  await diagnosticarTabelas()
  await testarBackendAgents()
  
  console.log('\n✅ === DIAGNÓSTICO CONCLUÍDO ===')
  console.log('⏰ Finalizado em:', new Date().toISOString())
}

// Executar diagnóstico
executarDiagnostico().catch(console.error)
