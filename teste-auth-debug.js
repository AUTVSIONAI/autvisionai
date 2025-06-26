/**
 * 🔥 TESTE AUTH DEBUG - DIAGNÓSTICO PROBLEMAS DE AUTENTICAÇÃO
 * 
 * PROBLEMAS IDENTIFICADOS:
 * 1. Bug de logout - usuário não desloga completamente
 * 2. Erro 500 no cadastro de novo usuário
 */

console.log('🔥 TESTE AUTH DEBUG - INICIANDO...')

// 🔥 TESTES DE LOGOUT
async function testLogout() {
  console.log('\n=== 🚪 TESTE LOGOUT ===')
  
  try {
    // Simular estado antes do logout
    console.log('1. Estado antes do logout:')
    console.log('   - localStorage keys:', Object.keys(localStorage))
    console.log('   - sessionStorage keys:', Object.keys(sessionStorage))
    
    // Verificar se há sessão ativa
    const response = await fetch('https://woooqlznapzfhmjlyyll.supabase.co/auth/v1/user', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('sb-woooqlznapzfhmjlyyll-auth-token') || 'sem-token'}`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTYyNTUsImV4cCI6MjA2NTQ3MjI1NX0.Mdeir5LYY8IFzoEKl8hQoK9FW4WCM119MBeCKNTbHvY'
      }
    })
    
    console.log('   - Status da sessão:', response.status)
    
    if (response.ok) {
      const userData = await response.json()
      console.log('   - Usuário atual:', userData.email || 'Sem email')
    }
    
    // Verificar chaves do localStorage relacionadas ao auth
    const authKeys = Object.keys(localStorage).filter(key => 
      key.includes('supabase') || 
      key.includes('auth') || 
      key.includes('user') ||
      key.includes('sb-')
    )
    
    console.log('   - Chaves de auth no localStorage:', authKeys)
    
    authKeys.forEach(key => {
      console.log(`     ${key}: ${localStorage.getItem(key)?.substring(0, 50)}...`)
    })
    
  } catch (error) {
    console.error('❌ Erro no teste de logout:', error)
  }
}

// 🔥 TESTES DE SIGNUP
async function testSignup() {
  console.log('\n=== 📝 TESTE SIGNUP ===')
  
  try {
    // Teste de cadastro com dados de teste
    const testEmail = `teste_${Date.now()}@teste.com`
    const testPassword = 'teste123456'
    
    console.log('1. Tentando cadastrar usuário de teste:')
    console.log('   - Email:', testEmail)
    console.log('   - Password: [OCULTO]')
    
    const signupResponse = await fetch('https://woooqlznapzfhmjlyyll.supabase.co/auth/v1/signup', {
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
    
    console.log('2. Resposta do signup:')
    console.log('   - Status:', signupResponse.status)
    console.log('   - Status Text:', signupResponse.statusText)
    
    const signupData = await signupResponse.json()
    console.log('   - Response body:', JSON.stringify(signupData, null, 2))
    
    if (signupResponse.status === 500) {
      console.log('🚨 ERRO 500 DETECTADO!')
      console.log('   - Possíveis causas:')
      console.log('     * RLS (Row Level Security) bloqueando inserção')
      console.log('     * Trigger de banco de dados falhando')
      console.log('     * Constraint violation (dados duplicados)')
      console.log('     * Função do banco mal configurada')
    }
    
  } catch (error) {
    console.error('❌ Erro no teste de signup:', error)
  }
}

// 🔥 TESTE DE VERIFICAÇÃO DE TABELAS
async function testTables() {
  console.log('\n=== 🗃️ TESTE TABELAS ===')
  
  try {
    // Verificar estrutura das tabelas profiles e userprofile
    console.log('1. Verificando tabela profiles...')
    
    const profilesResponse = await fetch('https://woooqlznapzfhmjlyyll.supabase.co/rest/v1/profiles?select=*&limit=1', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTYyNTUsImV4cCI6MjA2NTQ3MjI1NX0.Mdeir5LYY8IFzoEKl8hQoK9FW4WCM119MBeCKNTbHvY',
        'Authorization': `Bearer ${localStorage.getItem('sb-woooqlznapzfhmjlyyll-auth-token') || 'sem-token'}`
      }
    })
    
    console.log('   - Status:', profilesResponse.status)
    if (profilesResponse.ok) {
      const profilesData = await profilesResponse.json()
      console.log('   - Dados:', profilesData)
    } else {
      const errorText = await profilesResponse.text()
      console.log('   - Erro:', errorText)
    }
    
    console.log('2. Verificando tabela userprofile...')
    
    const userprofileResponse = await fetch('https://woooqlznapzfhmjlyyll.supabase.co/rest/v1/userprofile?select=*&limit=1', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTYyNTUsImV4cCI6MjA2NTQ3MjI1NX0.Mdeir5LYY8IFzoEKl8hQoK9FW4WCM119MBeCKNTbHvY',
        'Authorization': `Bearer ${localStorage.getItem('sb-woooqlznapzfhmjlyyll-auth-token') || 'sem-token'}`
      }
    })
    
    console.log('   - Status:', userprofileResponse.status)
    if (userprofileResponse.ok) {
      const userprofileData = await userprofileResponse.json()
      console.log('   - Dados:', userprofileData)
    } else {
      const errorText = await userprofileResponse.text()
      console.log('   - Erro:', errorText)
    }
    
  } catch (error) {
    console.error('❌ Erro no teste de tabelas:', error)
  }
}

// 🔥 EXECUTAR TODOS OS TESTES
async function runAllTests() {
  console.log('🔥 INICIANDO TODOS OS TESTES DE AUTH DEBUG')
  
  await testLogout()
  await testSignup()
  await testTables()
  
  console.log('\n✅ TODOS OS TESTES CONCLUÍDOS')
  console.log('\n📋 PRÓXIMOS PASSOS:')
  console.log('1. Analisar logs acima para identificar problemas')
  console.log('2. Corrigir AuthContext.jsx se necessário')
  console.log('3. Verificar RLS no Supabase')
  console.log('4. Testar fluxo de auth completo')
}

// Executar quando o script for carregado
if (typeof window !== 'undefined') {
  // Browser
  runAllTests()
} else {
  // Node.js
  console.log('Execute este script no browser (console do DevTools)')
}
