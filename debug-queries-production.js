/**
 * 🔍 DEBUG - QUERIES MALFORMADAS EM PRODUÇÃO
 * Testar diretamente as queries que estão falhando para identificar a origem
 */

import { createClient } from '@supabase/supabase-js'

// Configuração de produção
const supabaseUrl = 'https://woooqlznapzfhmjlyyll.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTYyNTUsImV4cCI6MjA2NTQ3MjI1NX0.Mdeir5LYY8IFzoEKl8hQoK9FW4WCM119MBeCKNTbHvY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testQueries() {
  console.log('🔍 Testando queries problemáticas...')
  
  try {
    // 1. Query simples que deveria funcionar
    console.log('\n1️⃣ Testando query básica...')
    const { data: basicData, error: basicError } = await supabase
      .from('userprofile')
      .select('id')
      .limit(1)
    
    console.log('Resultado básico:', { data: basicData, error: basicError })
    
    // 2. Query com select específico
    console.log('\n2️⃣ Testando query com select específico...')
    const { data: selectData, error: selectError } = await supabase
      .from('userprofile')
      .select('id, email, display_name')
      .limit(1)
    
    console.log('Resultado select:', { data: selectData, error: selectError })
    
    // 3. Verificar se a tabela userprofile existe
    console.log('\n3️⃣ Verificando estrutura da tabela...')
    const { data: schemaData, error: schemaError } = await supabase
      .from('userprofile')
      .select('*')
      .limit(0) // Só para ver a estrutura
    
    console.log('Estrutura:', { data: schemaData, error: schemaError })
    
    // 4. Testar autenticação
    console.log('\n4️⃣ Testando estado de autenticação...')
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    console.log('Sessão:', { user: sessionData?.session?.user?.email || 'Não logado', error: sessionError })
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

// Executar testes
testQueries().then(() => {
  console.log('\n✅ Testes concluídos')
}).catch(error => {
  console.error('❌ Erro fatal:', error)
})
