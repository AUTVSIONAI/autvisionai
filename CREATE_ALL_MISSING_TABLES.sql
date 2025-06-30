-- 🔥 AUTVISION AI - CRIAR TODAS AS TABELAS NECESSÁRIAS
-- Execute este script no Supabase SQL Editor para criar TODAS as tabelas do sistema
-- Desenvolvido para deixar o sistema completamente funcional!

-- ================================
-- TABELAS PRINCIPAIS DO SISTEMA
-- ================================

-- 1. TABELA AGENTS (já existe, mas vamos garantir)
CREATE TABLE IF NOT EXISTS public.agents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL DEFAULT 'assistant',
    description TEXT,
    capabilities TEXT[],
    plan_required VARCHAR(50) DEFAULT 'free',
    is_active BOOLEAN DEFAULT true,
    icon VARCHAR(255),
    image VARCHAR(255),
    image_url VARCHAR(500),
    prompt TEXT,
    color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- TABELAS DO VISION SUPREMO
-- ================================

-- 2. VISION COMPANIONS - Companions do usuário
CREATE TABLE IF NOT EXISTS public.vision_companions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    total_interactions INTEGER DEFAULT 0,
    personality_profile JSONB,
    preferences JSONB,
    learning_data JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. USER PERSONALITY PROFILE - Perfil de personalidade do usuário
CREATE TABLE IF NOT EXISTS public.user_personality_profile (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    personality_traits JSONB,
    communication_style JSONB,
    preferences JSONB,
    emotional_profile JSONB,
    learning_patterns JSONB,
    adaptation_level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. COMPANION LOGS - Logs de interações com companions
CREATE TABLE IF NOT EXISTS public.companion_logs (
    id SERIAL PRIMARY KEY,
    companion_id INTEGER REFERENCES vision_companions(id),
    user_id VARCHAR(255),
    interaction_type VARCHAR(100),
    message TEXT,
    response TEXT,
    context JSONB,
    sentiment_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PERSONALITY EVOLUTION LOG - Log de evolução da personalidade
CREATE TABLE IF NOT EXISTS public.personality_evolution_log (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    old_profile JSONB,
    new_profile JSONB,
    evolution_reason TEXT,
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. AUTONOMOUS ANALYSIS LOG - Análises autônomas do sistema
CREATE TABLE IF NOT EXISTS public.autonomous_analysis_log (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    analysis_type VARCHAR(100),
    insights JSONB,
    patterns_detected JSONB,
    recommendations JSONB,
    confidence_score DECIMAL(3,2),
    is_applied BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. SENSORIAL ENVIRONMENTS - Ambientes sensoriais
CREATE TABLE IF NOT EXISTS public.sensorial_environments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    environment_config JSONB,
    audio_settings JSONB,
    visual_settings JSONB,
    interaction_patterns JSONB,
    is_active BOOLEAN DEFAULT true,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. SENSORIAL STIMULI LOG - Log de estímulos sensoriais
CREATE TABLE IF NOT EXISTS public.sensorial_stimuli_log (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    environment_id INTEGER REFERENCES sensorial_environments(id),
    stimuli_type VARCHAR(100),
    intensity_level INTEGER,
    user_response JSONB,
    effectiveness_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. PERSONALITY ANALYSIS LOG - Log de análises de personalidade
CREATE TABLE IF NOT EXISTS public.personality_analysis_log (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    analysis_data JSONB,
    ai_insights JSONB,
    behavioral_patterns JSONB,
    improvement_suggestions JSONB,
    analysis_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. PERSONALITY ADAPTATION LOG - Log de adaptações de personalidade
CREATE TABLE IF NOT EXISTS public.personality_adaptation_log (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    adaptation_type VARCHAR(100),
    previous_state JSONB,
    new_state JSONB,
    trigger_event TEXT,
    success_rate DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- TABELAS ADICIONAIS DO SISTEMA
-- ================================

-- 11. USERS - Usuários do sistema (se não existir)
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    plan VARCHAR(50) DEFAULT 'free',
    is_active BOOLEAN DEFAULT true,
    avatar_url VARCHAR(500),
    preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. PLANS - Planos de assinatura
CREATE TABLE IF NOT EXISTS public.plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'BRL',
    features JSONB,
    limits JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. INTEGRATIONS - Integrações disponíveis
CREATE TABLE IF NOT EXISTS public.integrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    category VARCHAR(100),
    config_schema JSONB,
    is_active BOOLEAN DEFAULT true,
    plan_required VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. AFFILIATES - Sistema de afiliados
CREATE TABLE IF NOT EXISTS public.affiliates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    total_sales DECIMAL(10,2) DEFAULT 0,
    total_commission DECIMAL(10,2) DEFAULT 0,
    referral_code VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. TUTORIALS - Tutoriais do sistema
CREATE TABLE IF NOT EXISTS public.tutorials (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    category VARCHAR(100),
    difficulty_level INTEGER DEFAULT 1,
    estimated_time INTEGER,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. ROUTINES - Rotinas automatizadas
CREATE TABLE IF NOT EXISTS public.routines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    user_id VARCHAR(255) NOT NULL,
    steps JSONB,
    schedule JSONB,
    is_active BOOLEAN DEFAULT true,
    last_execution TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. MISSIONS - Missões do sistema
CREATE TABLE IF NOT EXISTS public.missions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    objectives JSONB,
    rewards JSONB,
    difficulty_level INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. BADGES - Badges/Conquistas
CREATE TABLE IF NOT EXISTS public.badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    criteria JSONB,
    reward_points INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- CRIAR ÍNDICES PARA PERFORMANCE
-- ================================

-- Índices para Vision Companions
CREATE INDEX IF NOT EXISTS idx_vision_companions_created_by ON vision_companions(created_by);
CREATE INDEX IF NOT EXISTS idx_vision_companions_active ON vision_companions(is_active);

-- Índices para User Personality Profile
CREATE INDEX IF NOT EXISTS idx_user_personality_profile_user_id ON user_personality_profile(user_id);

-- Índices para Logs
CREATE INDEX IF NOT EXISTS idx_companion_logs_companion_id ON companion_logs(companion_id);
CREATE INDEX IF NOT EXISTS idx_companion_logs_user_id ON companion_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_companion_logs_created_at ON companion_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_personality_evolution_log_user_id ON personality_evolution_log(user_id);
CREATE INDEX IF NOT EXISTS idx_autonomous_analysis_log_user_id ON autonomous_analysis_log(user_id);
CREATE INDEX IF NOT EXISTS idx_sensorial_stimuli_log_user_id ON sensorial_stimuli_log(user_id);
CREATE INDEX IF NOT EXISTS idx_personality_analysis_log_user_id ON personality_analysis_log(user_id);

-- Índices para tabelas principais
CREATE INDEX IF NOT EXISTS idx_agents_type ON agents(type);
CREATE INDEX IF NOT EXISTS idx_agents_active ON agents(is_active);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_plans_active ON plans(is_active);

-- ================================
-- INSERIR DADOS INICIAIS
-- ================================

-- Dados iniciais para AGENTS
INSERT INTO public.agents (name, type, description, capabilities, plan_required, icon, color) VALUES
('Vision', 'assistant', 'Assistente principal da AutVision AI', ARRAY['analysis', 'conversation', 'automation'], 'free', '🤖', '#00D4FF'),
('Analytics Pro', 'analytics', 'Especialista em análise de dados', ARRAY['data_analysis', 'reporting', 'insights'], 'pro', '📊', '#FF6B6B'),
('Automation Master', 'automation', 'Especialista em automação', ARRAY['workflow', 'integration', 'scheduling'], 'premium', '⚡', '#4ECDC4')
ON CONFLICT DO NOTHING;

-- Dados iniciais para PLANS
INSERT INTO public.plans (name, description, price, features, limits) VALUES
('Free', 'Plano gratuito com funcionalidades básicas', 0.00, 
 '{"agents": ["Vision"], "conversations_per_month": 100, "storage": "1GB"}',
 '{"max_agents": 1, "max_integrations": 3, "priority_support": false}'),
('Pro', 'Plano profissional com recursos avançados', 29.90,
 '{"agents": ["Vision", "Analytics Pro"], "conversations_per_month": 1000, "storage": "10GB"}',
 '{"max_agents": 5, "max_integrations": 10, "priority_support": true}'),
('Premium', 'Plano premium com acesso completo', 99.90,
 '{"agents": "all", "conversations_per_month": "unlimited", "storage": "100GB"}',
 '{"max_agents": "unlimited", "max_integrations": "unlimited", "priority_support": true}')
ON CONFLICT DO NOTHING;

-- Dados iniciais para INTEGRATIONS
INSERT INTO public.integrations (name, description, icon, category) VALUES
('N8N', 'Automação de workflows', '⚡', 'automation'),
('Zapier', 'Conecte suas aplicações', '🔗', 'automation'),
('Slack', 'Integração com Slack', '💬', 'communication'),
('WhatsApp', 'Integração com WhatsApp', '📱', 'communication')
ON CONFLICT DO NOTHING;

-- Dados iniciais para SENSORIAL ENVIRONMENTS
INSERT INTO public.sensorial_environments (name, description, environment_config) VALUES
('Focus Zone', 'Ambiente otimizado para concentração', 
 '{"audio": "white_noise", "visual": "minimal", "interactions": "reduced"}'),
('Creative Space', 'Ambiente estimulante para criatividade',
 '{"audio": "ambient", "visual": "colorful", "interactions": "enhanced"}'),
('Relaxation Mode', 'Ambiente para relaxamento',
 '{"audio": "nature", "visual": "soft", "interactions": "gentle"}')
ON CONFLICT DO NOTHING;

-- ================================
-- HABILITAR RLS (Row Level Security)
-- ================================

-- Habilitar RLS nas tabelas sensíveis (se ainda não estiver habilitado)
DO $$
BEGIN
    -- Habilitar RLS para vision_companions
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'vision_companions' 
        AND schemaname = 'public'
    ) THEN
        ALTER TABLE public.vision_companions ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Habilitar RLS para user_personality_profile
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'user_personality_profile' 
        AND schemaname = 'public'
    ) THEN
        ALTER TABLE public.user_personality_profile ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Habilitar RLS para companion_logs
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'companion_logs' 
        AND schemaname = 'public'
    ) THEN
        ALTER TABLE public.companion_logs ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Criar políticas RLS (drop se existir, depois cria)
DO $$
BEGIN
    -- Policy para vision_companions
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own companions') THEN
        DROP POLICY "Users can view their own companions" ON vision_companions;
    END IF;
    
    -- Policy para user_personality_profile
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile') THEN
        DROP POLICY "Users can view their own profile" ON user_personality_profile;
    END IF;
    
    -- Policy para companion_logs
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own logs') THEN
        DROP POLICY "Users can view their own logs" ON companion_logs;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Ignora se as policies não existem
        NULL;
END $$;

-- Criar as policies
CREATE POLICY "Users can view their own companions" ON vision_companions
    FOR SELECT USING (created_by = current_user::text);

CREATE POLICY "Users can view their own profile" ON user_personality_profile
    FOR SELECT USING (user_id = current_user::text);

CREATE POLICY "Users can view their own logs" ON companion_logs
    FOR SELECT USING (user_id = current_user::text);

-- ================================
-- FINALIZAÇÃO
-- ================================

-- Atualizar timestamps automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers nas tabelas que têm updated_at (com proteção contra duplicação)
DO $$
BEGIN
    -- Trigger para agents
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_agents_updated_at') THEN
        CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Trigger para vision_companions
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_vision_companions_updated_at') THEN
        CREATE TRIGGER update_vision_companions_updated_at BEFORE UPDATE ON vision_companions
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Trigger para user_personality_profile
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_personality_profile_updated_at') THEN
        CREATE TRIGGER update_user_personality_profile_updated_at BEFORE UPDATE ON user_personality_profile
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Trigger para users
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 🎉 SUCESSO! Todas as tabelas foram criadas!
-- Execute "SELECT * FROM pg_tables WHERE schemaname = 'public';" para verificar
