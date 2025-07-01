import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase com chave service_role
const supabaseUrl = 'https://woooqlznapzfhmjlyyll.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixUserSync() {
    try {
        console.log('🚀 Iniciando correção de sincronização de usuários...\n')

        // 1. Executar SQL para criar/corrigir trigger e políticas
        console.log('📋 STEP 1: Configurando políticas RLS e trigger...')
        
        const setupSQL = `
-- =====================================================
-- STEP 1: POLÍTICAS RLS ULTRA-PERMISSIVAS (TEMPORÁRIAS)
-- =====================================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Ultra permissive select" ON public.userprofile;
DROP POLICY IF EXISTS "Ultra permissive insert" ON public.userprofile;
DROP POLICY IF EXISTS "Ultra permissive update" ON public.userprofile;
DROP POLICY IF EXISTS "Service role total access" ON public.userprofile;
DROP POLICY IF EXISTS "Anon insert for triggers" ON public.userprofile;

-- Garantir que RLS está habilitado
ALTER TABLE public.userprofile ENABLE ROW LEVEL SECURITY;

-- Política para leitura
CREATE POLICY "Ultra permissive select" 
ON public.userprofile FOR SELECT 
TO authenticated, anon 
USING (true);

-- Política para inserção
CREATE POLICY "Ultra permissive insert" 
ON public.userprofile FOR INSERT 
TO authenticated, anon 
WITH CHECK (true);

-- Política para atualização
CREATE POLICY "Ultra permissive update" 
ON public.userprofile FOR UPDATE 
TO authenticated, anon 
USING (true)
WITH CHECK (true);

-- Política para service_role ter acesso total
CREATE POLICY "Service role total access" 
ON public.userprofile FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- =====================================================
-- STEP 2: CRIAR TRIGGER PARA NOVOS USUÁRIOS
-- =====================================================

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION create_user_profile_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar se o usuário já existe
    IF EXISTS(SELECT 1 FROM public.userprofile WHERE id = NEW.id) THEN
        RETURN NEW;
    END IF;

    -- Tentar inserção completa
    BEGIN
        INSERT INTO public.userprofile (
            id, 
            email, 
            full_name, 
            role,
            plan_id,
            tokens,
            xp,
            level,
            daily_login_streak,
            total_logins,
            total_interactions,
            last_login,
            created_at,
            updated_at
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
            0,
            NOW(),
            NOW(),
            NOW()
        );
        
        RETURN NEW;
    EXCEPTION 
        WHEN OTHERS THEN
            -- Fallback: inserção mínima
            BEGIN
                INSERT INTO public.userprofile (id, email, full_name) 
                VALUES (NEW.id, COALESCE(NEW.email, ''), COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'Usuário Vision'));
                RETURN NEW;
            EXCEPTION 
                WHEN OTHERS THEN
                    RAISE WARNING 'Erro ao criar perfil (não crítico): %', SQLERRM;
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

-- Criar novo trigger
CREATE TRIGGER create_profile_trigger_final
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile_trigger();
`;

        const { error: setupError } = await supabase.rpc('exec_sql', { sql: setupSQL });
        if (setupError) {
            console.log('   ⚠️ Erro na configuração (tentando método alternativo):', setupError.message);
        } else {
            console.log('   ✅ Políticas e trigger configurados!');
        }

        // 2. Sincronizar usuários existentes manualmente
        console.log('\n📋 STEP 2: Sincronizando usuários existentes...')
        
        // Buscar usuários sem perfil
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
                const { error } = await supabase
                    .from('userprofile')
                    .insert({
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata?.full_name || user.email || 'Usuário Vision',
                        role: user.email === 'digitalinfluenceradm@gmail.com' ? 'admin' : 'user',
                        plan_id: user.email === 'digitalinfluenceradm@gmail.com' ? 'enterprise' : null,
                        tokens: user.email === 'digitalinfluenceradm@gmail.com' ? 10000 : 100,
                        xp: 0,
                        level: 1,
                        daily_login_streak: 0,
                        total_logins: 0,
                        total_interactions: 0,
                        last_login: new Date().toISOString(),
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })

                if (error) {
                    console.log(`   ❌ Erro ao criar perfil para ${user.email}:`, error.message)
                    errors++
                } else {
                    console.log(`   ✅ Perfil criado para ${user.email}`)
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
            .select('id, email, full_name, role, plan_id, tokens, xp, level')

        if (finalError) {
            console.log('   ❌ Erro na verificação final:', finalError.message)
        } else {
            console.log(`   ✅ Total de perfis após sincronização: ${finalProfiles.length}`)
            finalProfiles.forEach(profile => {
                console.log(`      - ${profile.email} (${profile.role}) - XP: ${profile.xp}, Tokens: ${profile.tokens}`)
            })
        }

        console.log('\n🎉 SINCRONIZAÇÃO CONCLUÍDA!')
        
    } catch (error) {
        console.error('❌ Erro durante sincronização:', error.message)
    }
}

fixUserSync()
