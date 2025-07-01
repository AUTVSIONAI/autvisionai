import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase
const supabaseUrl = 'https://woooqlznapzfhmjlyyll.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTYyNTUsImV4cCI6MjA2NTQ3MjI1NX0.Mdeir5LYY8IFzoEKl8hQoK9FW4WCM119MBeCKNTbHvY'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw'

const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function testSignupProcess() {
    try {
        console.log('🧪 Testando processo completo de cadastro...\n')

        // 1. Primeiro, executar o SQL do trigger no Supabase
        console.log('📋 STEP 1: Criando trigger para novos usuários...')
        
        const triggerSQL = `
-- Função para criar perfil com estrutura correta
CREATE OR REPLACE FUNCTION create_user_profile_final()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar se o usuário já existe
    IF EXISTS(SELECT 1 FROM public.userprofile WHERE id = NEW.id) THEN
        RETURN NEW;
    END IF;

    -- Inserir perfil usando as colunas corretas da tabela userprofile
    BEGIN
        INSERT INTO public.userprofile (
            id, 
            email, 
            display_name,
            role,
            plan_id,
            tokens,
            xp,
            level,
            streak,
            total_interactions,
            last_login,
            created_date
        ) VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'Usuário Vision'),
            'user',
            NULL,
            100,
            0,
            1,
            0,
            0,
            NOW(),
            NOW()
        );
        
        RETURN NEW;
        
    EXCEPTION 
        WHEN OTHERS THEN
            -- Fallback: inserção mínima se algo der errado
            BEGIN
                INSERT INTO public.userprofile (id, email) 
                VALUES (NEW.id, COALESCE(NEW.email, ''));
                RETURN NEW;
            EXCEPTION 
                WHEN OTHERS THEN
                    RAISE WARNING 'Erro ao criar perfil para %: %', NEW.email, SQLERRM;
                    RETURN NEW;
            END;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover triggers antigos
DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;
DROP TRIGGER IF EXISTS create_profile_trigger_safe ON auth.users;
DROP TRIGGER IF EXISTS create_profile_trigger_bulletproof ON auth.users;
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
DROP TRIGGER IF EXISTS create_profile_trigger_adaptive ON auth.users;
DROP TRIGGER IF EXISTS create_profile_trigger_final ON auth.users;
DROP TRIGGER IF EXISTS create_profile_trigger_correct ON auth.users;
DROP TRIGGER IF EXISTS create_profile_trigger_production ON auth.users;

-- Criar trigger final
CREATE TRIGGER create_profile_trigger_test
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile_final();
`;

        // Tentar executar o SQL (se a função exec_sql existir)
        try {
            const { error: sqlError } = await supabaseAdmin.rpc('exec_sql', { sql: triggerSQL });
            if (sqlError) {
                console.log('   ⚠️ Função exec_sql não disponível. Execute manualmente no Supabase SQL Editor.')
            } else {
                console.log('   ✅ Trigger criado com sucesso!')
            }
        } catch {
            console.log('   ⚠️ Função exec_sql não disponível. Execute manualmente no Supabase SQL Editor.')
        }

        // 2. Testar criação de usuário de teste via admin
        console.log('\n📋 STEP 2: Testando criação de usuário via API admin...')
        
        const testEmail = `teste.${Date.now()}@autvision.com`
        const testPassword = 'TesteAutVision123!'
        
        console.log(`   📧 Email de teste: ${testEmail}`)
        
        // Criar usuário via admin API
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: testEmail,
            password: testPassword,
            email_confirm: true,
            user_metadata: {
                full_name: 'Usuário Teste AutVision'
            }
        })

        if (createError) {
            console.log('   ❌ Erro ao criar usuário:', createError.message)
            return
        }

        console.log('   ✅ Usuário criado com sucesso!')
        console.log(`   👤 ID: ${newUser.user.id}`)

        // 3. Aguardar um pouco para o trigger executar
        console.log('\n📋 STEP 3: Aguardando trigger executar...')
        await new Promise(resolve => setTimeout(resolve, 2000))

        // 4. Verificar se o perfil foi criado automaticamente
        console.log('\n📋 STEP 4: Verificando se perfil foi criado automaticamente...')
        
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('userprofile')
            .select('*')
            .eq('id', newUser.user.id)
            .single()

        if (profileError) {
            console.log('   ❌ Perfil NÃO foi criado automaticamente:', profileError.message)
            
            // Criar perfil manualmente para teste
            console.log('   🔧 Criando perfil manualmente...')
            const { data: manualProfile, error: manualError } = await supabaseAdmin
                .from('userprofile')
                .insert({
                    id: newUser.user.id,
                    email: testEmail,
                    display_name: 'Usuário Teste AutVision',
                    role: 'user',
                    plan_id: null,
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

            if (manualError) {
                console.log('   ❌ Erro ao criar perfil manualmente:', manualError.message)
            } else {
                console.log('   ✅ Perfil criado manualmente com sucesso!')
            }
        } else {
            console.log('   ✅ Perfil criado automaticamente pelo trigger!')
            console.log('   📊 Dados do perfil:', {
                id: profile.id,
                email: profile.email,
                display_name: profile.display_name,
                tokens: profile.tokens,
                xp: profile.xp,
                level: profile.level
            })
        }

        // 5. Testar login com o usuário criado
        console.log('\n📋 STEP 5: Testando login com usuário criado...')
        
        const { data: loginData, error: loginError } = await supabaseAnon.auth.signInWithPassword({
            email: testEmail,
            password: testPassword
        })

        if (loginError) {
            console.log('   ❌ Erro no login:', loginError.message)
        } else {
            console.log('   ✅ Login realizado com sucesso!')
            
            // Buscar perfil do usuário logado
            const { data: userProfile, error: userProfileError } = await supabaseAnon
                .from('userprofile')
                .select('*')
                .eq('id', loginData.user.id)
                .single()

            if (userProfileError) {
                console.log('   ❌ Erro ao buscar perfil do usuário logado:', userProfileError.message)
            } else {
                console.log('   ✅ Perfil carregado com sucesso após login!')
                console.log('   📊 Dados:', {
                    email: userProfile.email,
                    display_name: userProfile.display_name,
                    tokens: userProfile.tokens,
                    xp: userProfile.xp
                })
            }
            
            // Fazer logout
            await supabaseAnon.auth.signOut()
        }

        // 6. Limpeza - remover usuário de teste
        console.log('\n📋 STEP 6: Limpando usuário de teste...')
        
        // Remover perfil
        await supabaseAdmin
            .from('userprofile')
            .delete()
            .eq('id', newUser.user.id)

        // Remover usuário
        await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
        
        console.log('   🧹 Usuário de teste removido')

        console.log('\n🎉 TESTE CONCLUÍDO!')
        console.log('\n📝 PRÓXIMAS AÇÕES:')
        console.log('   1. Se o trigger não funcionou, execute o SQL manualmente no Supabase')
        console.log('   2. Teste o cadastro real na aplicação')
        console.log('   3. Verifique se novos usuários têm perfil criado automaticamente')
        
    } catch (error) {
        console.error('❌ Erro durante teste:', error.message)
    }
}

testSignupProcess()
