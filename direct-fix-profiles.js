import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase com chave service_role
const supabaseUrl = 'https://woooqlznapzfhmjlyyll.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAndFixUserProfiles() {
    try {
        console.log('🚀 Executando correção direta via SQL...\n')

        // 1. Primeiro, verificar a estrutura da tabela atual
        console.log('📋 STEP 1: Verificando estrutura da tabela...')
        
        const { data: structureData, error: structureError } = await supabase
            .rpc('exec_sql', { 
                query: `
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = 'userprofile' 
                AND table_schema = 'public'
                ORDER BY ordinal_position;
                `
            })

        if (structureError) {
            console.log('   ⚠️ Erro ao verificar estrutura via RPC, tentando consulta direta...')
            
            // Tentar uma consulta direta na tabela para entender a estrutura
            const { data: sampleData, error: sampleError } = await supabase
                .from('userprofile')
                .select('*')
                .limit(1)

            if (sampleError) {
                console.log('   ❌ Erro na consulta direta:', sampleError.message)
            } else {
                console.log('   ✅ Estrutura descoberta através dos dados:')
                if (sampleData && sampleData.length > 0) {
                    Object.keys(sampleData[0]).forEach(key => {
                        console.log(`      - ${key}`)
                    })
                }
            }
        } else {
            console.log('   ✅ Estrutura da tabela:')
            structureData.forEach(col => {
                console.log(`      - ${col.column_name} (${col.data_type})`)
            })
        }

        // 2. Criar perfis para usuários sem perfil usando apenas as colunas básicas
        console.log('\n📋 STEP 2: Criando perfis com colunas básicas...')
        
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
        if (authError) {
            throw new Error(`Erro ao buscar usuários: ${authError.message}`)
        }

        const { data: profiles, error: profileError } = await supabase
            .from('userprofile')
            .select('id')

        if (profileError) {
            throw new Error(`Erro ao buscar perfis: ${profileError.message}`)
        }

        const profileIds = new Set(profiles.map(p => p.id))
        const usersWithoutProfile = authUsers.users.filter(user => !profileIds.has(user.id))

        console.log(`   📊 Usuários sem perfil encontrados: ${usersWithoutProfile.length}`)

        let created = 0
        let errors = 0

        for (const user of usersWithoutProfile) {
            try {
                // Tentar apenas com as colunas que sabemos que existem
                const basicProfile = {
                    id: user.id,
                    email: user.email || '',
                }

                // Tentar adicionar outras colunas básicas se existirem
                const possibleColumns = {
                    full_name: user.user_metadata?.full_name || user.email || 'Usuário Vision',
                    role: user.email === 'digitalinfluenceradm@gmail.com' ? 'admin' : 'user',
                    plan_id: user.email === 'digitalinfluenceradm@gmail.com' ? 'enterprise' : null,
                    tokens: user.email === 'digitalinfluenceradm@gmail.com' ? 10000 : 100,
                    xp: 0,
                    level: 1
                }

                // Adicionar colunas uma por uma e ver qual funciona
                let finalProfile = { ...basicProfile }
                
                for (const [key, value] of Object.entries(possibleColumns)) {
                    finalProfile[key] = value
                }

                const { error } = await supabase
                    .from('userprofile')
                    .insert(finalProfile)

                if (error) {
                    console.log(`   ❌ Erro ao criar perfil para ${user.email}:`, error.message)
                    
                    // Tentar apenas com id e email se der erro
                    const { error: minimalError } = await supabase
                        .from('userprofile')
                        .insert(basicProfile)
                    
                    if (minimalError) {
                        console.log(`   ❌ Erro mesmo com perfil mínimo:`, minimalError.message)
                        errors++
                    } else {
                        console.log(`   ✅ Perfil mínimo criado para ${user.email}`)
                        created++
                    }
                } else {
                    console.log(`   ✅ Perfil completo criado para ${user.email}`)
                    created++
                }
            } catch (err) {
                console.log(`   ❌ Erro ao processar ${user.email}:`, err.message)
                errors++
            }
        }

        console.log(`\n📊 RESULTADO: ${created} perfis criados, ${errors} erros`)

        // 3. Verificação final
        console.log('\n📋 STEP 3: Verificação final...')
        const { data: finalProfiles, error: finalError } = await supabase
            .from('userprofile')
            .select('*')

        if (finalError) {
            console.log('   ❌ Erro na verificação final:', finalError.message)
        } else {
            console.log(`   ✅ Total de perfis após sincronização: ${finalProfiles.length}`)
            finalProfiles.forEach(profile => {
                console.log(`      - ${profile.email || profile.id} - ID: ${profile.id}`)
            })
        }

        console.log('\n🎉 PROCESSO CONCLUÍDO!')
        
    } catch (error) {
        console.error('❌ Erro durante processo:', error.message)
    }
}

checkAndFixUserProfiles()
