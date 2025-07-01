import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase - usando chave service_role para verificar
const supabaseUrl = 'https://woooqlznapzfhmjlyyll.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw'

const supabaseService = createClient(supabaseUrl, supabaseServiceKey)

async function debugAuthIssue() {
    console.log('🔍 INVESTIGANDO PROBLEMA DE AUTH...\n')

    try {
        // 1. Verificar se conseguimos criar usuário via admin API
        console.log('📝 Teste 1: Criação via Admin API...')
        
        const testEmail = `admin.test.${Date.now()}@autvision.com`
        const testPassword = 'TestPassword123!'

        const { data: adminUser, error: adminError } = await supabaseService.auth.admin.createUser({
            email: testEmail,
            password: testPassword,
            email_confirm: true,
            user_metadata: {
                full_name: 'Usuário Admin Teste'
            }
        })

        if (adminError) {
            console.log('❌ ERRO na criação via Admin:', adminError.message)
        } else {
            console.log('✅ Usuário criado via Admin API!')
            console.log('   ID:', adminUser.user.id)
            console.log('   Email:', adminUser.user.email)

            // Tentar criar perfil manualmente
            console.log('\n📝 Criando perfil manualmente...')
            
            const { data: profile, error: profileError } = await supabaseService
                .from('userprofile')
                .insert({
                    id: adminUser.user.id,
                    email: testEmail,
                    display_name: 'Usuário Admin Teste',
                    role: 'user',
                    tokens: 100,
                    xp: 0,
                    level: 1,
                    streak: 0,
                    total_interactions: 0,
                    last_login: new Date().toISOString(),
                    created_date: new Date().toISOString()
                })
                .select()
                .single()

            if (profileError) {
                console.log('❌ Erro ao criar perfil:', profileError.message)
            } else {
                console.log('✅ Perfil criado com sucesso!')
            }

            // Limpar usuário de teste
            console.log('\n🧹 Removendo usuário de teste...')
            await supabaseService.auth.admin.deleteUser(adminUser.user.id)
            await supabaseService.from('userprofile').delete().eq('id', adminUser.user.id)
        }

        // 2. Verificar configurações de auth
        console.log('\n📋 Verificando configurações...')
        
        // Tentar listar usuários para ver se API está funcionando
        const { data: usersList, error: listError } = await supabaseService.auth.admin.listUsers()
        if (listError) {
            console.log('❌ Erro ao listar usuários:', listError.message)
        } else {
            console.log(`✅ API funcionando - ${usersList.users.length} usuários encontrados`)
        }

        // 3. Testar criação sem metadados
        console.log('\n📝 Teste 2: Signup simples (sem metadados)...')
        
        const supabaseAnon = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTYyNTUsImV4cCI6MjA2NTQ3MjI1NX0.Mdeir5LYY8IFzoEKl8hQoK9FW4WCM119MBeCKNTbHvY')
        
        const simpleEmail = `simple.test.${Date.now()}@autvision.com`
        
        const { data: simpleUser, error: simpleError } = await supabaseAnon.auth.signUp({
            email: simpleEmail,
            password: testPassword
        })

        if (simpleError) {
            console.log('❌ ERRO no signup simples:', simpleError.message)
            console.log('   Status:', simpleError.status)
            console.log('   Code:', simpleError.code)
        } else {
            console.log('✅ Signup simples funcionou!')
            console.log('   User ID:', simpleUser.user?.id)
        }

    } catch (error) {
        console.error('❌ ERRO GERAL:', error.message)
    }
}

debugAuthIssue()
