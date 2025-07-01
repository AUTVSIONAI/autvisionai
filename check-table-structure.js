import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase com chave service_role
const supabaseUrl = 'https://woooqlznapzfhmjlyyll.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTableStructure() {
    try {
        console.log('🔍 Verificando estrutura real da tabela userprofile...\n')

        // Verificar estrutura da tabela
        const { data: columns, error: columnsError } = await supabase
            .from('information_schema.columns')
            .select('column_name, data_type, is_nullable, column_default')
            .eq('table_name', 'userprofile')
            .eq('table_schema', 'public')
            .order('ordinal_position')

        if (columnsError) {
            console.error('❌ Erro ao verificar colunas:', columnsError)
            return
        }

        console.log('📋 COLUNAS ENCONTRADAS:')
        columns.forEach(col => {
            console.log(`   - ${col.column_name} (${col.data_type}) - Nullable: ${col.is_nullable}`)
        })

        // Tentar consulta simples para ver o que funciona
        console.log('\n🔍 Testando consulta simples...')
        const { data: testData, error: testError } = await supabase
            .from('userprofile')
            .select('*')
            .limit(1)

        if (testError) {
            console.error('❌ Erro na consulta teste:', testError)
        } else {
            console.log('✅ Consulta funcionou! Exemplo de dados:')
            console.log(testData)
        }

        // Verificar quantos registros existem
        const { count, error: countError } = await supabase
            .from('userprofile')
            .select('*', { count: 'exact', head: true })

        if (countError) {
            console.error('❌ Erro ao contar registros:', countError)
        } else {
            console.log(`\n📊 Total de registros na tabela: ${count}`)
        }

    } catch (error) {
        console.error('❌ Erro durante verificação:', error.message)
    }
}

checkTableStructure()
