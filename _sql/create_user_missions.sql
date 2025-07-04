-- Script para criar tabela user_missions

-- Criar tabela user_missions se não existir
CREATE TABLE IF NOT EXISTS public.user_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL,
    mission_name TEXT NOT NULL,
    mission_description TEXT,
    mission_type TEXT NOT NULL,
    progress_current INTEGER DEFAULT 0,
    progress_target INTEGER DEFAULT 1,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    reward_points INTEGER DEFAULT 0,
    reward_badge TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_missions_user_id ON public.user_missions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_mission_id ON public.user_missions(mission_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_is_completed ON public.user_missions(is_completed);

-- Habilitar RLS
ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
DO $$
BEGIN
    -- Usuários podem ver e gerenciar suas próprias missões
    DROP POLICY IF EXISTS "Users manage own missions" ON public.user_missions;
    CREATE POLICY "Users manage own missions" ON public.user_missions
        FOR ALL USING (auth.uid() = user_id);
    
    -- Service role tem acesso total
    DROP POLICY IF EXISTS "Service role full access missions" ON public.user_missions;
    CREATE POLICY "Service role full access missions" ON public.user_missions
        FOR ALL USING (auth.role() = 'service_role');
    
    -- Usuários autenticados podem ver apenas missões públicas (exemplo)
    DROP POLICY IF EXISTS "Public missions readable" ON public.user_missions;
    CREATE POLICY "Public missions readable" ON public.user_missions
        FOR SELECT USING (auth.role() = 'authenticated' AND mission_type = 'public');
END
$$;

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_missions_updated_at') THEN
        CREATE TRIGGER update_user_missions_updated_at
            BEFORE UPDATE ON public.user_missions
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- Verificar se tabela foi criada
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_missions'
) AS table_exists;

-- Verificar as políticas RLS
SELECT 
    schemaname, 
    tablename, 
    policyname,
    cmd
FROM 
    pg_policies 
WHERE 
    tablename = 'user_missions';
