-- 🔥 AUTVISION AI - CRIAR TABELAS VISION SUPREMO (VERSÃO SEGURA)
-- Execute este script no Supabase SQL Editor
-- Versão simplificada sem RLS para evitar conflitos

-- ================================
-- TABELAS DO VISION SUPREMO
-- ================================

-- 1. VISION COMPANIONS - Companions do usuário
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

-- 2. USER PERSONALITY PROFILE - Perfil de personalidade do usuário
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

-- 3. COMPANION LOGS - Logs de interações com companions
CREATE TABLE IF NOT EXISTS public.companion_logs (
    id SERIAL PRIMARY KEY,
    companion_id INTEGER,
    user_id VARCHAR(255),
    interaction_type VARCHAR(100),
    message TEXT,
    response TEXT,
    context JSONB,
    sentiment_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PERSONALITY EVOLUTION LOG - Log de evolução da personalidade
CREATE TABLE IF NOT EXISTS public.personality_evolution_log (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    old_profile JSONB,
    new_profile JSONB,
    evolution_reason TEXT,
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. AUTONOMOUS ANALYSIS LOG - Análises autônomas do sistema
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

-- 6. SENSORIAL ENVIRONMENTS - Ambientes sensoriais
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

-- 7. SENSORIAL STIMULI LOG - Log de estímulos sensoriais
CREATE TABLE IF NOT EXISTS public.sensorial_stimuli_log (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    environment_id INTEGER,
    stimuli_type VARCHAR(100),
    intensity_level INTEGER,
    user_response JSONB,
    effectiveness_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. PERSONALITY ANALYSIS LOG - Log de análises de personalidade
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

-- 9. PERSONALITY ADAPTATION LOG - Log de adaptações de personalidade
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

-- ================================
-- INSERIR DADOS INICIAIS
-- ================================

-- Dados iniciais para SENSORIAL ENVIRONMENTS
INSERT INTO public.sensorial_environments (name, description, environment_config) VALUES
('Focus Zone', 'Ambiente otimizado para concentração', 
 '{"audio": "white_noise", "visual": "minimal", "interactions": "reduced"}'),
('Creative Space', 'Ambiente estimulante para criatividade',
 '{"audio": "ambient", "visual": "colorful", "interactions": "enhanced"}'),
('Relaxation Mode', 'Ambiente para relaxamento',
 '{"audio": "nature", "visual": "soft", "interactions": "gentle"}')
ON CONFLICT DO NOTHING;

-- 🎉 TABELAS DO VISION SUPREMO CRIADAS COM SUCESSO!
-- Execute "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%vision%' OR tablename LIKE '%personality%';" para verificar
