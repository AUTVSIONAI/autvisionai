import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase service_role para acessar logs
const supabaseUrl = 'https://woooqlznapzfhmjlyyll.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function debugSignupIssue() {
    console.log('🔍 DEBUGANDO PROBLEMA DE CADASTRO...\n')

    try {
        // 1. Verificar se o trigger existe mesmo
        console.log('📋 STEP 1: Verificando triggers ativos...')
        
        // Usando consulta SQL direta
        const { data: triggerCheck, error: triggerError } = await supabase
            .rpc('exec_sql', { 
                query: `
                SELECT 
                    trigger_name,
                    event_manipulation,
                    action_timing,
                    event_object_table,
                    event_object_schema
                FROM information_schema.triggers 
                WHERE event_object_table = 'users' 
                AND trigger_schema = 'auth'
                ORDER BY trigger_name;
                `
            })

        if (triggerError) {
            console.log('   ❌ Erro ao verificar triggers:', triggerError.message)
        } else {
            console.log('   ✅ Triggers encontrados:')
            if (triggerCheck && triggerCheck.length > 0) {
                triggerCheck.forEach(trigger => {
                    console.log(`      - ${trigger.trigger_name} (${trigger.action_timing} ${trigger.event_manipulation})`)
                })
            } else {
                console.log('      ⚠️ NENHUM TRIGGER ENCONTRADO!')
            }
        }

        // 2. Testar criação manual de perfil
        console.log('\n📋 STEP 2: Testando criação manual de perfil...')
        
        const testUserId = '00000000-1111-2222-3333-444444444444'
        const testEmail = 'teste.manual@debug.com'

        // Remover se existir
        await supabase
            .from('userprofile')
            .delete()
            .eq('id', testUserId)

        // Tentar criar manualmente
        const { data: manualProfile, error: manualError } = await supabase
            .from('userprofile')
            .insert({
                id: testUserId,
                email: testEmail,
                display_name: 'Teste Manual',
                role: 'user',
                tokens: 100,
                xp: 0,
                level: 1
            })
            .select()

        if (manualError) {
            console.log('   ❌ Erro na criação manual:', manualError.message)
            console.log('   Detalhes:', JSON.stringify(manualError, null, 2))
        } else {
            console.log('   ✅ Criação manual funcionou!')
            
            // Limpar
            await supabase
                .from('userprofile')
                .delete()
                .eq('id', testUserId)
        }

        // 3. Verificar políticas RLS
        console.log('\n📋 STEP 3: Verificando políticas RLS...')
        
        const { data: policies, error: policyError } = await supabase
            .rpc('exec_sql', {
                query: `
                SELECT 
                    policyname,
                    cmd,
                    roles,
                    qual,
                    with_check
                FROM pg_policies 
                WHERE tablename = 'userprofile'
                ORDER BY policyname;
                `
            })

        if (policyError) {
            console.log('   ❌ Erro ao verificar políticas:', policyError.message)
        } else {
            console.log('   ✅ Políticas RLS encontradas:')
            if (policies && policies.length > 0) {
                policies.forEach(policy => {
                    console.log(`      - ${policy.policyname} (${policy.cmd}) - Roles: ${policy.roles}`)
                })
            } else {
                console.log('      ⚠️ NENHUMA POLÍTICA ENCONTRADA!')
            }
        }

        // 4. Testar função do trigger diretamente
        console.log('\n📋 STEP 4: Testando função do trigger diretamente...')
        
        try {
            const { data: functionTest, error: functionError } = await supabase
                .rpc('exec_sql', {
                    query: `
                    -- Simular trigger manualmente
                    DO $$
                    DECLARE
                        test_user_id UUID := '11111111-2222-3333-4444-555555555555';
                        test_email TEXT := 'teste.trigger@debug.com';
                    BEGIN
                        -- Primeiro, limpar se existir
                        DELETE FROM public.userprofile WHERE id = test_user_id;
                        
                        -- Simular inserção na auth.users (só para teste do trigger)
                        -- Vamos chamar a função diretamente
                        RAISE NOTICE 'Testando função do trigger...';
                        
                        -- Inserir perfil diretamente como o trigger faria
                        INSERT INTO public.userprofile (
                            id,
                            email,
                            display_name,
                            role,
                            tokens,
                            xp,
                            level
                        ) VALUES (
                            test_user_id,
                            test_email,
                            'Teste Trigger',
                            'user',
                            100,
                            0,
                            1
                        );
                        
                        RAISE NOTICE 'Teste do trigger FUNCIONOU!';
                        
                        -- Limpar
                        DELETE FROM public.userprofile WHERE id = test_user_id;
                    END $$;
                    `
                })

            if (functionError) {
                console.log('   ❌ Erro no teste da função:', functionError.message)
            } else {
                console.log('   ✅ Função do trigger testada com sucesso!')
            }
        } catch (err) {
            console.log('   ❌ Erro no teste direto:', err.message)
        }

        console.log('\n🎯 PRÓXIMOS PASSOS:')
        console.log('   1. Verificar se o trigger realmente existe')
        console.log('   2. Verificar se as políticas RLS estão corretas')
        console.log('   3. Testar novamente o cadastro')

    } catch (error) {
        console.error('❌ Erro geral no debug:', error.message)
    }
}

debugSignupIssue()
