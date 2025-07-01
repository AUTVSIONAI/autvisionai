import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase com chave service_role
const supabaseUrl = 'https://woooqlznapzfhmjlyyll.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyUserSync() {
    try {
        console.log('🔍 Verificando sincronização de usuários...\n')

        // Verificar usuários na tabela auth.users
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
        if (authError) {
            console.error('❌ Erro ao buscar usuários de auth:', authError)
            return
        }

        console.log(`📊 Total de usuários em auth.users: ${authUsers.users.length}`)
        authUsers.users.forEach(user => {
            console.log(`   - ${user.email} (${user.id})`)
        })

        // Verificar usuários na tabela userprofile
        const { data: profiles, error: profileError } = await supabase
            .from('userprofile')
            .select('*')

        if (profileError) {
            console.error('❌ Erro ao buscar perfis:', profileError)
            return
        }

        console.log(`\n📊 Total de perfis em userprofile: ${profiles.length}`)
        profiles.forEach(profile => {
            console.log(`   - ${profile.email} (${profile.id}) - XP: ${profile.xp}, Level: ${profile.level}, Tokens: ${profile.tokens}`)
        })

        // Verificar usuários sem perfil
        const usersWithoutProfile = authUsers.users.filter(authUser => 
            !profiles.find(profile => profile.id === authUser.id)
        )

        console.log(`\n⚠️  Usuários sem perfil: ${usersWithoutProfile.length}`)
        usersWithoutProfile.forEach(user => {
            console.log(`   - ${user.email} (${user.id})`)
        })

        // Verificar estrutura da tabela userprofile
        console.log('\n🏗️  Verificando estrutura da tabela userprofile...')
        const { data: tableInfo, error: tableError } = await supabase
            .rpc('get_table_columns', { table_name: 'userprofile' })

        if (tableError) {
            console.log('   (Não foi possível obter estrutura da tabela)')
        } else {
            console.log('   Colunas encontradas:', tableInfo)
        }

        console.log('\n✅ Verificação concluída!')

    } catch (error) {
        console.error('❌ Erro durante verificação:', error)
    }
}

verifyUserSync()
