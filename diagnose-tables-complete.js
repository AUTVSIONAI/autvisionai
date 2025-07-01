/**
 * 🔍 DIAGNÓSTICO COMPLETO DE TABELAS SUPABASE
 * Verificar quais tabelas existem e suas estruturas
 */

import { createClient } from '@supabase/supabase-js'

// Configuração de produção
const supabaseUrl = 'https://woooqlznapzfhmjlyyll.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTYyNTUsImV4cCI6MjA2NTQ3MjI1NX0.Mdeir5LYY8IFzoEKl8hQoK9FW4WCM119MBeCKNTbHvY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
  console.log('🔍 Diagnóstico completo de tabelas Supabase...\n')
  
  const tables = [
    'userprofile',
    'agents', 
    'users',
    'routines',
    'integrations',
    'plans',
    'affiliates',
    'llm_configs',
    'platform_configs',
    'missions',
    'badges',
    'logs'
  ]
  
  const results = {}
  
  for (const table of tables) {
    try {
      console.log(`📊 Verificando tabela: ${table}`)
      
      // Tentar fazer select básico
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(1)
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`)
        results[table] = { exists: false, error: error.message }
      } else {
        console.log(`✅ ${table}: Existe (${count || 0} registros)`)
        results[table] = { 
          exists: true, 
          count: count || 0,
          sampleData: data?.[0] || null
        }
        
        // Se tem dados, mostrar estrutura do primeiro registro
        if (data?.[0]) {
          console.log(`   Colunas: ${Object.keys(data[0]).join(', ')}`)
        }
      }
      
    } catch (error) {
      console.log(`💥 ${table}: Erro fatal - ${error.message}`)
      results[table] = { exists: false, error: error.message }
    }
    
    console.log('') // Linha em branco
  }
  
  // Resumo final
  console.log('\n📋 RESUMO:')
  console.log('=====================================')
  
  const existing = Object.entries(results).filter(([table, info]) => info.exists)
  const missing = Object.entries(results).filter(([table, info]) => !info.exists)
  
  console.log(`✅ Tabelas existentes (${existing.length}):`)
  existing.forEach(([table, info]) => {
    console.log(`   - ${table} (${info.count} registros)`)
  })
  
  console.log(`\n❌ Tabelas ausentes/com erro (${missing.length}):`)
  missing.forEach(([table, info]) => {
    console.log(`   - ${table}: ${info.error}`)
  })
  
  return results
}

// Executar verificação
checkTables().then((results) => {
  console.log('\n🎯 Verificação completa!')
  
  // Se userprofile existe, verificar sua estrutura detalhada
  if (results.userprofile?.exists) {
    console.log('\n🔍 Estrutura detalhada de userprofile:')
    if (results.userprofile.sampleData) {
      console.log(JSON.stringify(results.userprofile.sampleData, null, 2))
    }
  }
  
}).catch(error => {
  console.error('❌ Erro fatal na verificação:', error)
})
