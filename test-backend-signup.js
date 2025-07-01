import { createClient } from '@supabase/supabase-js'

// Configuração igual à aplicação
const supabaseUrl = 'https://woooqlznapzfhmjlyyll.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTYyNTUsImV4cCI6MjA2NTQ3MjI1NX0.Mdeir5LYY8IFzoEKl8hQoK9FW4WCM119MBeCKNTbHvY'

async function testBackendSignup() {
    console.log('🧪 TESTANDO CADASTRO VIA BACKEND...\n')

    try {
        // Testar endpoint do backend diretamente
        const backendUrl = 'http://localhost:3001'
        const testData = {
            email: `teste.backend.${Date.now()}@autvision.com`,
            password: 'TestePassword123!',
            full_name: 'Usuário Teste Backend'
        }

        console.log(`📝 Tentando cadastro via backend: ${testData.email}`)

        const response = await fetch(`${backendUrl}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        })

        const result = await response.json()

        if (!response.ok) {
            console.log('❌ ERRO NO BACKEND:', result)
            console.log('   Status:', response.status)
            console.log('   Mensagem:', result.message || result.error)
        } else {
            console.log('✅ Cadastro via backend funcionou!')
            console.log('   User ID:', result.user?.id)
            console.log('   Email:', result.user?.email)
        }

    } catch (backendError) {
        console.log('❌ Erro ao conectar com backend:', backendError.message)
        console.log('   Tentando cadastro direto no Supabase...\n')

        // Fallback: teste direto no Supabase
        await testDirectSupabase()
    }
}

async function testDirectSupabase() {
    console.log('🔄 TESTANDO CADASTRO DIRETO NO SUPABASE...\n')

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    try {
        const testEmail = `teste.direto.${Date.now()}@autvision.com`
        const testPassword = 'TestePassword123!'

        console.log(`📝 Cadastro direto: ${testEmail}`)

        // Teste mais simples - sem metadata
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword
        })

        if (signUpError) {
            console.log('❌ ERRO NO CADASTRO DIRETO:', signUpError.message)
            console.log('   Código:', signUpError.status)
            console.log('   Tipo:', signUpError.name)
            
            if (signUpError.message.includes('Database error')) {
                console.log('\n🔍 PROBLEMA CONFIRMADO: Erro no trigger do banco!')
                console.log('   O trigger está falhando ao criar o perfil.')
                console.log('   Vamos tentar uma abordagem diferente...')
                
                await tryAlternativeApproach()
            }
        } else {
            console.log('✅ Cadastro direto funcionou!')
            console.log('   User ID:', signUpData.user?.id)
            
            // Verificar se perfil foi criado
            setTimeout(async () => {
                const { data: profile, error: profileError } = await supabase
                    .from('userprofile')
                    .select('*')
                    .eq('id', signUpData.user?.id)
                    .single()

                if (profileError) {
                    console.log('❌ Perfil NÃO foi criado automaticamente')
                } else {
                    console.log('✅ Perfil criado automaticamente!')
                    console.log('   Nome:', profile.display_name)
                }
            }, 2000)
        }

    } catch (error) {
        console.error('❌ Erro geral:', error.message)
    }
}

async function tryAlternativeApproach() {
    console.log('\n🔧 TENTATIVA ALTERNATIVA: Desabilitando trigger e criando perfil manualmente...\n')

    const supabaseService = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw')

    try {
        // Teste: criar usuário via admin API (bypassa triggers)
        const testEmail = `teste.admin.${Date.now()}@autvision.com`
        
        console.log(`📝 Criando usuário via admin API: ${testEmail}`)

        const { data: adminUser, error: adminError } = await supabaseService.auth.admin.createUser({
            email: testEmail,
            password: 'TestePassword123!',
            email_confirm: true,
            user_metadata: {
                full_name: 'Usuário Admin Test'
            }
        })

        if (adminError) {
            console.log('❌ Erro na criação admin:', adminError.message)
        } else {
            console.log('✅ Usuário admin criado!')
            console.log('   User ID:', adminUser.user?.id)

            // Criar perfil manualmente
            const { data: manualProfile, error: manualError } = await supabaseService
                .from('userprofile')
                .insert({
                    id: adminUser.user.id,
                    email: testEmail,
                    display_name: 'Usuário Admin Test',
                    role: 'user',
                    tokens: 100,
                    xp: 0,
                    level: 1
                })
                .select()

            if (manualError) {
                console.log('❌ Erro ao criar perfil manual:', manualError.message)
            } else {
                console.log('✅ Perfil manual criado com sucesso!')
                console.log('\n🎯 SOLUÇÃO ENCONTRADA:')
                console.log('   1. O problema ESTÁ no trigger')
                console.log('   2. Podemos usar criação manual de perfil')
                console.log('   3. Ou ajustar a aplicação para criar perfil após signup')
            }
        }

    } catch (error) {
        console.error('❌ Erro na abordagem alternativa:', error.message)
    }
}

testBackendSignup()
