/**
 * 🔥 TESTE SIGNUP ESPECÍFICO - INVESTIGAR ERRO 500
 * Diagnóstico detalhado do erro de cadastro
 */

console.log('🔥 TESTE SIGNUP ESPECÍFICO - INICIANDO...')

// 🔥 FUNÇÃO PARA TESTAR SIGNUP DIRETO
async function testDirectSignup() {
  console.log('\n=== 📝 TESTE SIGNUP DIRETO ===')
  
  try {
    const testEmail = `teste_${Date.now()}@autvision.com`
    const testPassword = 'Teste123456!'
    
    console.log('1. Dados do teste:')
    console.log('   - Email:', testEmail)
    console.log('   - Password: [PROTEGIDO]')
    
    // Teste direto com Supabase
    console.log('2. Executando signup no Supabase...')
    
    const response = await fetch('https://woooqlznapzfhmjlyyll.supabase.co/auth/v1/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTYyNTUsImV4cCI6MjA2NTQ3MjI1NX0.Mdeir5LYY8IFzoEKl8hQoK9FW4WCM119MBeCKNTbHvY'
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        data: {
          full_name: 'Usuário Teste'
        }
      })
    })
    
    console.log('3. Resposta do servidor:')
    console.log('   - Status:', response.status)
    console.log('   - Status Text:', response.statusText)
    
    const responseText = await response.text()
    console.log('   - Response Text:', responseText)
    
    if (response.status === 500) {
      console.log('\n🚨 ERRO 500 DETECTADO!')
      console.log('📋 Possíveis causas:')
      console.log('1. Trigger na tabela auth.users falhando')
      console.log('2. Função automática de criação de perfil com erro')
      console.log('3. RLS (Row Level Security) bloqueando inserção')
      console.log('4. Constraint de banco de dados violada')
      console.log('5. Função SQL malformada ou com dados incorretos')
      
      console.log('\n🔧 Soluções sugeridas:')
      console.log('1. Verificar triggers na tabela auth.users')
      console.log('2. Verificar políticas RLS nas tabelas profiles/userprofile')
      console.log('3. Verificar se as colunas esperadas existem')
      console.log('4. Testar inserção manual nas tabelas de perfil')
      console.log('5. Verificar logs do Supabase Dashboard')
    }
    
    if (response.ok) {
      const data = JSON.parse(responseText)
      console.log('✅ Signup bem-sucedido!')
      console.log('   - User ID:', data.user?.id)
      console.log('   - Session:', data.session ? 'Ativa' : 'Pendente')
    }
    
  } catch (error) {
    console.error('❌ Erro no teste direto:', error)
  }
}

// 🔥 FUNÇÃO PARA TESTAR CRIAÇÃO DE PERFIL
async function testProfileCreation() {
  console.log('\n=== 👤 TESTE CRIAÇÃO DE PERFIL ===')
  
  try {
    // Simular dados de um usuário recém-criado
    const testUserId = '12345678-1234-1234-1234-123456789012'
    const testEmail = 'teste@autvision.com'
    
    console.log('1. Testando inserção na tabela profiles...')
    
    const profileData = {
      id: testUserId,
      email: testEmail,
      full_name: 'Usuário Teste',
      role: 'user',
      plan_id: 'starter',
      tokens: 100,
      created_at: new Date().toISOString()
    }
    
    console.log('   - Dados:', profileData)
    
    // Teste de inserção na tabela profiles
    const profileResponse = await fetch('https://woooqlznapzfhmjlyyll.supabase.co/rest/v1/profiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTYyNTUsImV4cCI6MjA2NTQ3MjI1NX0.Mdeir5LYY8IFzoEKl8hQoK9FW4WCM119MBeCKNTbHvY',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(profileData)
    })
    
    console.log('2. Resultado da inserção em profiles:')
    console.log('   - Status:', profileResponse.status)
    
    const profileText = await profileResponse.text()
    console.log('   - Response:', profileText)
    
    if (profileResponse.status === 403) {
      console.log('🚨 ERRO 403 - RLS bloqueando inserção!')
      console.log('   - As políticas RLS podem estar muito restritivas')
      console.log('   - Usuário anônimo pode não ter permissão para inserir')
    }
    
    if (profileResponse.status === 409) {
      console.log('🚨 ERRO 409 - Conflito de dados!')
      console.log('   - ID duplicado ou constraint violada')
    }
    
  } catch (error) {
    console.error('❌ Erro no teste de perfil:', error)
  }
}

// 🔥 FUNÇÃO PARA VERIFICAR ESTRUTURA DAS TABELAS
async function checkTableStructure() {
  console.log('\n=== 🗃️ VERIFICAÇÃO ESTRUTURA TABELAS ===')
  
  try {
    console.log('1. Verificando tabela profiles...')
    
    const profilesResponse = await fetch('https://woooqlznapzfhmjlyyll.supabase.co/rest/v1/profiles?select=*&limit=1', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTYyNTUsImV4cCI6MjA2NTQ3MjI1NX0.Mdeir5LYY8IFzoEKl8hQoK9FW4WCM119MBeCKNTbHvY'
      }
    })
    
    console.log('   - Status:', profilesResponse.status)
    
    if (profilesResponse.ok) {
      const profilesData = await profilesResponse.json()
      if (profilesData.length > 0) {
        console.log('   - Estrutura exemplo:', Object.keys(profilesData[0]))
      } else {
        console.log('   - Tabela vazia, mas acessível')
      }
    } else {
      const errorText = await profilesResponse.text()
      console.log('   - Erro:', errorText)
    }
    
    console.log('2. Verificando tabela userprofile...')
    
    const userprofileResponse = await fetch('https://woooqlznapzfhmjlyyll.supabase.co/rest/v1/userprofile?select=*&limit=1', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTYyNTUsImV4cCI6MjA2NTQ3MjI1NX0.Mdeir5LYY8IFzoEKl8hQoK9FW4WCM119MBeCKNTbHvY'
      }
    })
    
    console.log('   - Status:', userprofileResponse.status)
    
    if (userprofileResponse.ok) {
      const userprofileData = await userprofileResponse.json()
      if (userprofileData.length > 0) {
        console.log('   - Estrutura exemplo:', Object.keys(userprofileData[0]))
      } else {
        console.log('   - Tabela vazia, mas acessível')
      }
    } else {
      const errorText = await userprofileResponse.text()
      console.log('   - Erro:', errorText)
    }
    
  } catch (error) {
    console.error('❌ Erro na verificação de estrutura:', error)
  }
}

// 🔥 EXECUTAR TODOS OS TESTES
async function runSignupDiagnostic() {
  console.log('🔥 INICIANDO DIAGNÓSTICO COMPLETO DO SIGNUP')
  console.log('===========================================')
  
  await testDirectSignup()
  await testProfileCreation()
  await checkTableStructure()
  
  console.log('\n✅ DIAGNÓSTICO CONCLUÍDO')
  console.log('\n📋 PRÓXIMOS PASSOS:')
  console.log('1. Analisar logs acima para identificar erro específico')
  console.log('2. Verificar Supabase Dashboard → Logs → API')
  console.log('3. Verificar políticas RLS se necessário')
  console.log('4. Ajustar triggers ou funções se identificado')
  console.log('5. Testar novamente após correções')
}

// Executar quando o script for carregado
if (typeof window !== 'undefined') {
  // Browser
  runSignupDiagnostic()
} else {
  // Node.js
  console.log('Execute este script no browser (console do DevTools)')
}
