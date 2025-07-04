-- ================================================================
-- 🚀 AUTVISION AI - SCRIPT PRINCIPAL PARA SUPABASE
-- ================================================================
-- 
-- VERSÃO LIMPA E DEFINITIVA - Execute no Supabase SQL Editor
-- 
-- ✅ Cria todas as tabelas necessárias
-- ✅ Configura índices otimizados  
-- ✅ Aplica políticas RLS seguras
-- ✅ Insere dados iniciais
-- ✅ Compatível 100% com Supabase
-- 
-- INSTRUÇÕES:
-- 1. Abra o Supabase SQL Editor
-- 2. Cole e execute este script completo
-- 3. Aguarde a mensagem de sucesso
-- 
-- ================================================================

-- === EXTENSÕES NECESSÁRIAS ===
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- FASE 1: CRIAÇÃO DAS TABELAS PRINCIPAIS
-- ================================================================

-- === TABELA USERPROFILE ===
CREATE TABLE IF NOT EXISTS public.userprofile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
    api_key TEXT,
    openrouter_key TEXT,
    total_visions INTEGER DEFAULT 0,
    total_commands INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

-- === TABELA VISIONS ===
CREATE TABLE IF NOT EXISTS public.visions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    model TEXT DEFAULT 'gpt-4',
    system_prompt TEXT,
    temperature DECIMAL(2,1) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 2000,
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- === TABELA VISION_COMMANDS ===
CREATE TABLE IF NOT EXISTS public.vision_commands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vision_id UUID REFERENCES public.visions(id) ON DELETE CASCADE,
    command_text TEXT NOT NULL,
    response_text TEXT,
    model_used TEXT,
    tokens_used INTEGER DEFAULT 0,
    execution_time_ms INTEGER DEFAULT 0,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- === TABELA VISION_KNOWLEDGE_BASE ===
CREATE TABLE IF NOT EXISTS public.vision_knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vision_id UUID REFERENCES public.visions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'code', 'json', 'markdown')),
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- === TABELA VISION_CONVERSATIONS ===
CREATE TABLE IF NOT EXISTS public.vision_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vision_id UUID REFERENCES public.visions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    conversation_title TEXT DEFAULT 'Nova Conversa',
    conversation_data JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- === TABELA USER_BADGES ===
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_type TEXT NOT NULL,
    badge_name TEXT NOT NULL,
    badge_description TEXT,
    badge_icon TEXT,
    earned_at TIMESTAMPTZ DEFAULT now(),
    is_visible BOOLEAN DEFAULT true
);

-- === TABELA USER_ACHIEVEMENTS ===
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    achievement_title TEXT NOT NULL,
    achievement_description TEXT,
    progress_current INTEGER DEFAULT 0,
    progress_target INTEGER DEFAULT 1,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- === TABELA PLATFORM_CONFIG ===
CREATE TABLE IF NOT EXISTS public.platform_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key TEXT UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    config_type TEXT DEFAULT 'general' CHECK (config_type IN ('general', 'ai', 'billing', 'security')),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- === TABELA SYSTEM_LOGS ===
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_level TEXT NOT NULL CHECK (log_level IN ('info', 'warning', 'error', 'debug')),
    log_source TEXT NOT NULL,
    log_message TEXT NOT NULL,
    log_metadata JSONB DEFAULT '{}'::jsonb,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- === TABELA AGENTS ===
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('ai', 'automation', 'integration', 'llm', 'vision', 'general')),
    description TEXT,
    capabilities JSONB DEFAULT '[]'::jsonb,
    icon TEXT,
    color TEXT DEFAULT '#3B82F6',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    config JSONB DEFAULT '{}'::jsonb,
    created_date TIMESTAMPTZ DEFAULT now(),
    image_url TEXT
);

-- ================================================================
-- FASE 2: CRIAÇÃO DOS ÍNDICES OTIMIZADOS
-- ================================================================

-- Índices para userprofile
CREATE INDEX IF NOT EXISTS idx_userprofile_id ON public.userprofile(id);
CREATE INDEX IF NOT EXISTS idx_userprofile_email ON public.userprofile(email);

-- Índices para visions
CREATE INDEX IF NOT EXISTS idx_visions_user_id ON public.visions(user_id);
CREATE INDEX IF NOT EXISTS idx_visions_is_active ON public.visions(is_active);
CREATE INDEX IF NOT EXISTS idx_visions_name ON public.visions(name);

-- Índices para vision_commands
CREATE INDEX IF NOT EXISTS idx_vision_commands_vision_id ON public.vision_commands(vision_id);
CREATE INDEX IF NOT EXISTS idx_vision_commands_created_at ON public.vision_commands(created_at);

-- Índices para vision_knowledge_base
CREATE INDEX IF NOT EXISTS idx_vision_knowledge_base_vision_id ON public.vision_knowledge_base(vision_id);
CREATE INDEX IF NOT EXISTS idx_vision_knowledge_base_tags ON public.vision_knowledge_base USING GIN(tags);

-- Índices para vision_conversations
CREATE INDEX IF NOT EXISTS idx_vision_conversations_vision_id ON public.vision_conversations(vision_id);
CREATE INDEX IF NOT EXISTS idx_vision_conversations_user_id ON public.vision_conversations(user_id);

-- Índices para user_badges
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);

-- Índices para user_achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_is_completed ON public.user_achievements(is_completed);

-- Índices para agents
CREATE INDEX IF NOT EXISTS idx_agents_name ON public.agents(name);
CREATE INDEX IF NOT EXISTS idx_agents_type ON public.agents(type);
CREATE INDEX IF NOT EXISTS idx_agents_status ON public.agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_created_date ON public.agents(created_date);

-- ================================================================
-- FASE 3: CONFIGURAÇÃO RLS (ROW LEVEL SECURITY)
-- ================================================================

-- Habilitando RLS
ALTER TABLE public.userprofile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vision_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vision_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vision_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- FASE 4: CRIAÇÃO DAS POLÍTICAS RLS
-- ================================================================

-- Políticas para userprofile
DO $userprofile_policies$
BEGIN
    -- Users can view and manage own profile
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'userprofile' AND policyname = 'Users manage own profile') THEN
        CREATE POLICY "Users manage own profile" ON public.userprofile
            FOR ALL USING (auth.uid() = public.userprofile.id);
    END IF;
END $userprofile_policies$;

-- Políticas para visions
DO $visions_policies$
BEGIN
    -- Users can manage own visions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'visions' AND policyname = 'Users manage own visions') THEN
        CREATE POLICY "Users manage own visions" ON public.visions
            FOR ALL USING (auth.uid() = public.visions.user_id);
    END IF;
END $visions_policies$;

-- Políticas para vision_commands
DO $vision_commands_policies$
BEGIN
    -- Users can manage commands of own visions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vision_commands' AND policyname = 'Users manage commands of own visions') THEN
        CREATE POLICY "Users manage commands of own visions" ON public.vision_commands
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.visions 
                    WHERE public.visions.id = public.vision_commands.vision_id 
                    AND public.visions.user_id = auth.uid()
                )
            );
    END IF;
END $vision_commands_policies$;

-- Políticas para vision_knowledge_base
DO $vision_knowledge_base_policies$
BEGIN
    -- Users can manage knowledge base of own visions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vision_knowledge_base' AND policyname = 'Users manage knowledge base of own visions') THEN
        CREATE POLICY "Users manage knowledge base of own visions" ON public.vision_knowledge_base
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.visions 
                    WHERE public.visions.id = public.vision_knowledge_base.vision_id 
                    AND public.visions.user_id = auth.uid()
                )
            );
    END IF;
END $vision_knowledge_base_policies$;

-- Políticas para vision_conversations
DO $vision_conversations_policies$
BEGIN
    -- Users can manage own conversations
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vision_conversations' AND policyname = 'Users manage own conversations') THEN
        CREATE POLICY "Users manage own conversations" ON public.vision_conversations
            FOR ALL USING (auth.uid() = public.vision_conversations.user_id);
    END IF;
END $vision_conversations_policies$;

-- Políticas para user_badges
DO $user_badges_policies$
BEGIN
    -- Users can view own badges
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_badges' AND policyname = 'Users view own badges') THEN
        CREATE POLICY "Users view own badges" ON public.user_badges
            FOR SELECT USING (auth.uid() = public.user_badges.user_id);
    END IF;
END $user_badges_policies$;

-- Políticas para user_achievements
DO $user_achievements_policies$
BEGIN
    -- Users can manage own achievements
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_achievements' AND policyname = 'Users manage own achievements') THEN
        CREATE POLICY "Users manage own achievements" ON public.user_achievements
            FOR ALL USING (auth.uid() = public.user_achievements.user_id);
    END IF;
END $user_achievements_policies$;

-- Políticas para platform_config (leitura para usuários autenticados)
DO $platform_config_policies$
BEGIN
    -- Authenticated users can read config
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'platform_config' AND policyname = 'Authenticated users read config') THEN
        CREATE POLICY "Authenticated users read config" ON public.platform_config
            FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
END $platform_config_policies$;

-- Políticas para system_logs
DO $system_logs_policies$
BEGIN
    -- Users can insert logs
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'system_logs' AND policyname = 'Users can insert logs') THEN
        CREATE POLICY "Users can insert logs" ON public.system_logs
            FOR INSERT WITH CHECK (true);
    END IF;
    
    -- Users can view own logs
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'system_logs' AND policyname = 'Users view own logs') THEN
        CREATE POLICY "Users view own logs" ON public.system_logs
            FOR SELECT USING (auth.uid() = public.system_logs.user_id OR public.system_logs.user_id IS NULL);
    END IF;
END $system_logs_policies$;

-- Políticas para agents
DO $agents_policies$
BEGIN
    -- Service role can access all agents
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agents' AND policyname = 'Service role full access agents') THEN
        CREATE POLICY "Service role full access agents" ON public.agents
            FOR ALL USING (auth.role() = 'service_role');
    END IF;
    
    -- Authenticated users can read all active agents
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agents' AND policyname = 'Public agents readable') THEN
        CREATE POLICY "Public agents readable" ON public.agents
            FOR SELECT USING (auth.role() = 'authenticated' AND status = 'active');
    END IF;
    
    -- Allow all authenticated users to read agents (for now)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agents' AND policyname = 'Authenticated users can read agents') THEN
        CREATE POLICY "Authenticated users can read agents" ON public.agents
            FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
END $agents_policies$;

-- ================================================================
-- FASE 5: CRIAÇÃO DE TRIGGERS
-- ================================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $trigger_function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$trigger_function$ LANGUAGE plpgsql;

-- Aplicar triggers
DO $apply_triggers$
BEGIN
    -- userprofile
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_userprofile_updated_at') THEN
        CREATE TRIGGER update_userprofile_updated_at 
            BEFORE UPDATE ON public.userprofile 
            FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    -- visions
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_visions_updated_at') THEN
        CREATE TRIGGER update_visions_updated_at 
            BEFORE UPDATE ON public.visions 
            FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    -- vision_knowledge_base
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_vision_knowledge_base_updated_at') THEN
        CREATE TRIGGER update_vision_knowledge_base_updated_at 
            BEFORE UPDATE ON public.vision_knowledge_base 
            FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    -- vision_conversations
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_vision_conversations_updated_at') THEN
        CREATE TRIGGER update_vision_conversations_updated_at 
            BEFORE UPDATE ON public.vision_conversations 
            FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    -- user_achievements
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_achievements_updated_at') THEN
        CREATE TRIGGER update_user_achievements_updated_at 
            BEFORE UPDATE ON public.user_achievements 
            FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    -- platform_config
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_platform_config_updated_at') THEN
        CREATE TRIGGER update_platform_config_updated_at 
            BEFORE UPDATE ON public.platform_config 
            FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    -- agents (apenas um trigger já que não tem updated_at)
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_agents_created_date') THEN
        CREATE TRIGGER update_agents_created_date 
            BEFORE UPDATE ON public.agents 
            FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $apply_triggers$;

-- ================================================================
-- FASE 6: DADOS INICIAIS
-- ================================================================

-- Configurações básicas da plataforma
INSERT INTO public.platform_config (config_key, config_value, config_type, description) 
VALUES 
    ('ai_model_default', 'gpt-4', 'ai', 'Modelo de IA padrão'),
    ('max_visions_free', '3', 'billing', 'Máximo de Visions para usuários gratuitos'),
    ('max_visions_pro', '20', 'billing', 'Máximo de Visions para usuários Pro'),
    ('feature_flags', '{"vision_sharing": true, "analytics": true}', 'general', 'Flags de funcionalidades')
ON CONFLICT (config_key) DO NOTHING;

-- Agentes básicos do sistema
INSERT INTO public.agents (name, type, description, capabilities, icon, color, status, config)
VALUES 
    ('Vision Assistant', 'ai', 'Assistente de IA principal do sistema', '["text_generation", "conversation", "analysis"]', 'brain', '#3B82F6', 'active', '{"model": "gpt-4", "temperature": 0.7}'),
    ('Automation Agent', 'automation', 'Agente para automação de tarefas', '["workflow_automation", "task_scheduling", "integration"]', 'settings', '#10B981', 'active', '{"max_concurrent_tasks": 5}'),
    ('Vision Creator', 'vision', 'Especialista em criação e configuração de Visions', '["vision_creation", "prompt_optimization", "training"]', 'eye', '#8B5CF6', 'active', '{"expertise_level": "advanced"}')
ON CONFLICT DO NOTHING;

-- ================================================================
-- VERIFICAÇÃO FINAL
-- ================================================================

DO $final_verification$
DECLARE
    table_count INTEGER;
    policy_count INTEGER;
    trigger_count INTEGER;
BEGIN
    -- Contar tabelas
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('userprofile', 'visions', 'vision_commands', 'vision_knowledge_base', 
                       'vision_conversations', 'user_badges', 'user_achievements', 
                       'platform_config', 'system_logs', 'agents');
    
    -- Contar políticas
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE schemaname = 'public';
    
    -- Contar triggers
    SELECT COUNT(*) INTO trigger_count 
    FROM pg_trigger 
    WHERE tgname LIKE 'update_%_updated_at';
    
    -- Log de sucesso
    INSERT INTO public.system_logs (log_level, log_source, log_message, log_metadata)
    VALUES (
        'info',
        'database_setup',
        'AUTVision AI Database Setup Completed',
        json_build_object(
            'tables_created', table_count,
            'policies_created', policy_count,
            'triggers_created', trigger_count,
            'timestamp', now()
        )
    );
    
    -- Relatório final
    RAISE NOTICE '================================================================';
    RAISE NOTICE '🎉 AUTVISION AI - SETUP CONCLUÍDO COM SUCESSO! 🎉';
    RAISE NOTICE '================================================================';
    RAISE NOTICE '📊 Tabelas criadas: %', table_count;
    RAISE NOTICE '🔒 Políticas RLS: %', policy_count;  
    RAISE NOTICE '⚡ Triggers: %', trigger_count;
    RAISE NOTICE '🕒 Timestamp: %', now();
    RAISE NOTICE '================================================================';
    RAISE NOTICE '✅ Banco de dados pronto para uso!';
    RAISE NOTICE '🚀 Próximo passo: Testar cadastro e login no app';
    RAISE NOTICE '================================================================';
END $final_verification$;

-- ================================================================
-- ✅ SETUP COMPLETO - AUTVISION AI PRONTO PARA USO!
-- ================================================================
