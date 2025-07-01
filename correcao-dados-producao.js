/**
 * 🛠️ CORREÇÃO E POPULAÇÃO DE DADOS - PRODUÇÃO
 * 
 * Script para corrigir os problemas identificados e popular dados essenciais
 */

import { createClient } from '@supabase/supabase-js'

// Configuração correta do Supabase
const SUPABASE_URL = 'https://woooqlznapzfhmjlyyll.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTYyNTUsImV4cCI6MjA2NTQ3MjI1NX0.Mdeir5LYY8IFzoEKl8hQoK9FW4WCM119MBeCKNTbHvY'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Dados de exemplo para popular as tabelas
const agentesExemplo = [
  {
    id: 'agent-vision-001',
    name: 'Vision Supremo',
    description: 'Assistente IA principal com capacidades avançadas de análise e automação',
    icon: 'Eye',
    color: '#8B5CF6',
    type: 'vision',
    status: 'active',
    config: {
      model: 'gpt-4-vision',
      maxTokens: 4096,
      temperature: 0.7
    },
    capabilities: ['vision', 'analysis', 'automation', 'chat']
  },
  {
    id: 'agent-ada-002',
    name: 'Ada Assistant',
    description: 'Assistente especializado em casa inteligente e automação residencial',
    icon: 'Home',
    color: '#10B981',
    type: 'ada',
    status: 'active',
    config: {
      model: 'gpt-3.5-turbo',
      maxTokens: 2048,
      temperature: 0.5
    },
    capabilities: ['home-automation', 'iot', 'scheduling']
  },
  {
    id: 'agent-creative-003',
    name: 'Creative Genius',
    description: 'Agente criativo para geração de conteúdo, designs e ideias inovadoras',
    icon: 'Sparkles',
    color: '#F59E0B',
    type: 'creative',
    status: 'active',
    config: {
      model: 'gpt-4',
      maxTokens: 3072,
      temperature: 0.9
    },
    capabilities: ['content-generation', 'design', 'brainstorming']
  }
]

const usuariosExemplo = [
  {
    id: 'user-admin-001',
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
    id: 'user-demo-002',
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

async function popularAgentes() {
  console.log('\n🤖 === POPULANDO TABELA AGENTS ===')
  
  try {
    // Verificar quantos agentes já existem
    const { data: existingAgents, error: countError } = await supabase
      .from('agents')
      .select('id')
    
    if (countError) {
      console.error('❌ Erro ao verificar agentes existentes:', countError)
      return
    }
    
    console.log(`📊 Agentes existentes: ${existingAgents?.length || 0}`)
    
    // Adicionar novos agentes se necessário
    if (!existingAgents || existingAgents.length < 5) {
      console.log('📝 Adicionando agentes de exemplo...')
      
      for (const agente of agentesExemplo) {
        // Verificar se já existe
        const { data: existing } = await supabase
          .from('agents')
          .select('id')
          .eq('id', agente.id)
          .maybeSingle()
        
        if (!existing) {
          const { data, error } = await supabase
            .from('agents')
            .insert(agente)
            .select()
            .single()
          
          if (error) {
            console.error(`❌ Erro ao inserir ${agente.name}:`, error)
          } else {
            console.log(`✅ Agente ${agente.name} adicionado com sucesso`)
          }
        } else {
          console.log(`⚠️ Agente ${agente.name} já existe`)
        }
      }
    } else {
      console.log('✅ Tabela agents já tem dados suficientes')
    }
    
  } catch (error) {
    console.error('💥 Erro geral ao popular agentes:', error)
  }
}

async function popularUsuarios() {
  console.log('\n👤 === POPULANDO TABELA USERPROFILE ===')
  
  try {
    // Verificar quantos usuários já existem
    const { data: existingUsers, error: countError } = await supabase
      .from('userprofile')
      .select('id')
    
    if (countError) {
      console.error('❌ Erro ao verificar usuários existentes:', countError)
      return
    }
    
    console.log(`📊 Usuários existentes: ${existingUsers?.length || 0}`)
    
    // Adicionar usuários de exemplo se a tabela estiver vazia
    if (!existingUsers || existingUsers.length === 0) {
      console.log('📝 Adicionando usuários de exemplo...')
      
      for (const usuario of usuariosExemplo) {
        const { data, error } = await supabase
          .from('userprofile')
          .insert(usuario)
          .select()
          .single()
        
        if (error) {
          console.error(`❌ Erro ao inserir ${usuario.display_name}:`, error)
        } else {
          console.log(`✅ Usuário ${usuario.display_name} adicionado com sucesso`)
        }
      }
    } else {
      console.log('✅ Tabela userprofile já tem dados')
    }
    
  } catch (error) {
    console.error('💥 Erro geral ao popular usuários:', error)
  }
}

async function testarQueriesComPlexas() {
  console.log('\n🔍 === TESTANDO QUERIES COMPLEXAS ===')
  
  try {
    // Testar query que estava causando problemas em produção
    console.log('🔄 Testando query userprofile com muitas colunas...')
    
    const { data, error } = await supabase
      .from('userprofile')
      .select(`
        id,
        email,
        display_name,
        role,
        plan_id,
        tokens,
        xp,
        level,
        completed_mission_ids,
        earned_badge_ids,
        streak,
        total_interactions,
        last_login,
        created_date
      `)
      .limit(5)
    
    if (error) {
      console.error('❌ Query complexa falhou:', error)
    } else {
      console.log('✅ Query complexa funcionou!')
      console.log(`📊 Registros retornados: ${data?.length || 0}`)
      if (data && data.length > 0) {
        console.log('📋 Primeiro registro:', data[0])
      }
    }
    
  } catch (error) {
    console.error('💥 Erro ao testar queries complexas:', error)
  }
}

async function verificarPermissoes() {
  console.log('\n🔐 === VERIFICANDO PERMISSÕES ===')
  
  try {
    // Testar diferentes tipos de operações
    console.log('🔄 Testando SELECT...')
    const { data: selectData, error: selectError } = await supabase
      .from('agents')
      .select('count')
      .limit(1)
    
    console.log(selectError ? '❌ SELECT falhou' : '✅ SELECT OK')
    
    console.log('🔄 Testando INSERT (simulado)...')
    const testAgent = {
      name: 'Test Agent',
      type: 'test',
      description: 'Agente de teste'
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('agents')
      .insert(testAgent)
      .select()
    
    if (insertError) {
      console.log('❌ INSERT falhou:', insertError.message)
    } else {
      console.log('✅ INSERT OK - removendo teste...')
      // Remover o registro de teste
      await supabase
        .from('agents')
        .delete()
        .eq('id', insertData[0].id)
    }
    
  } catch (error) {
    console.error('💥 Erro ao verificar permissões:', error)
  }
}

async function executarCorrecaoCompleta() {
  console.log('🛠️ === CORREÇÃO COMPLETA - PRODUÇÃO ===')
  console.log('⏰ Iniciado em:', new Date().toISOString())
  
  await popularAgentes()
  await popularUsuarios()
  await testarQueriesComPlexas()
  await verificarPermissoes()
  
  console.log('\n✅ === CORREÇÃO CONCLUÍDA ===')
  console.log('⏰ Finalizado em:', new Date().toISOString())
  
  // Resumo final
  console.log('\n📊 === RESUMO ===')
  
  try {
    const { data: agents } = await supabase.from('agents').select('count')
    const { data: users } = await supabase.from('userprofile').select('count')
    
    console.log(`🤖 Total de agentes: ${agents?.[0]?.count || 'N/A'}`)
    console.log(`👤 Total de usuários: ${users?.[0]?.count || 'N/A'}`)
    
  } catch (error) {
    console.error('❌ Erro no resumo:', error)
  }
}

// Executar correção
executarCorrecaoCompleta().catch(console.error)
