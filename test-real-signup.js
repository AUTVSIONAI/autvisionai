import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase - usando chave anon como a aplicação real
const supabaseUrl = 'https://woooqlznapzfhmjlyyll.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTYyNTUsImV4cCI6MjA2NTQ3MjI1NX0.Mdeir5LYY8IFzoEKl8hQoK9FW4WCM119MBeCKNTbHvY'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testRealSignup() {
    console.log('🧪 TESTANDO CADASTRO REAL COMO A APLICAÇÃO FAZ...\n')

    const testEmail = `teste.cadastro.${Date.now()}@autvision.com`
    const testPassword = 'TestePassword123!'

    try {
        console.log(`📝 Tentando cadastrar: ${testEmail}`)

        // 1. Tentar cadastro EXATAMENTE como a aplicação faz
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
                data: {
                    full_name: 'Usuário Teste',
                    name: 'Usuário Teste'
                }
            }
        })

        if (signUpError) {
            console.log('❌ ERRO NO SIGNUP:', signUpError.message)
            console.log('   Código:', signUpError.status)
            console.log('   Detalhes:', JSON.stringify(signUpError, null, 2))
            return
        }

        console.log('✅ Signup realizado com sucesso!')
        console.log('   User ID:', signUpData.user?.id)
        console.log('   Email:', signUpData.user?.email)

        // 2. Aguardar um pouco para o trigger executar
        console.log('⏳ Aguardando trigger executar...')
        await new Promise(resolve => setTimeout(resolve, 3000))

        // 3. Verificar se perfil foi criado
        const { data: profile, error: profileError } = await supabase
            .from('userprofile')
            .select('*')
            .eq('id', signUpData.user?.id)
            .single()

        if (profileError) {
            console.log('❌ ERRO AO BUSCAR PERFIL:', profileError.message)
            console.log('   Isso indica que o TRIGGER NÃO FUNCIONOU!')
        } else {
            console.log('✅ Perfil encontrado!')
            console.log('   Display name:', profile.display_name)
            console.log('   Role:', profile.role)
            console.log('   Tokens:', profile.tokens)
        }

        // 4. Tentar login para testar fluxo completo
        console.log('\n🔐 Testando login...')
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPassword
        })

        if (loginError) {
            console.log('❌ ERRO NO LOGIN:', loginError.message)
        } else {
            console.log('✅ Login realizado com sucesso!')
        }

        // 5. Limpeza - remover usuário de teste
        console.log('\n🧹 Limpando usuário de teste...')
        
        // Primeiro fazer logout
        await supabase.auth.signOut()

    } catch (error) {
        console.error('❌ ERRO GERAL:', error.message)
    }
}

async function checkTriggerStatus() {
    console.log('\n🔍 VERIFICANDO STATUS DO TRIGGER...\n')

    const supabaseService = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw')

    try {
        // Verificar estrutura das tabelas para comparar
        console.log('📋 Verificando estrutura auth.users:')
        const { data: authUsers } = await supabaseService.auth.admin.listUsers()
        if (authUsers && authUsers.users.length > 0) {
            const user = authUsers.users[0]
            console.log('   Campos disponíveis:', Object.keys(user))
            console.log('   raw_user_meta_data exemplo:', user.raw_user_meta_data)
        }

        console.log('\n📋 Verificando estrutura userprofile:')
        const { data: profiles } = await supabaseService
            .from('userprofile')
            .select('*')
            .limit(1)

        if (profiles && profiles.length > 0) {
            console.log('   Campos disponíveis:', Object.keys(profiles[0]))
        }

        console.log('\n📊 Comparando quantidades:')
        const { data: allUsers } = await supabaseService.auth.admin.listUsers()
        const { data: allProfiles } = await supabaseService
            .from('userprofile')
            .select('id')

        console.log(`   auth.users: ${allUsers?.users.length || 0}`)
        console.log(`   userprofile: ${allProfiles?.length || 0}`)

    } catch (error) {
        console.error('❌ Erro na verificação:', error.message)
    }
}

// Executar testes
async function runAllTests() {
    await checkTriggerStatus()
    await testRealSignup()
}

runAllTests()
