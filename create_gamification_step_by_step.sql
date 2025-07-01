-- SCRIPT PARA CRIAR SISTEMA DE GAMIFICAÇÃO PASSO A PASSO
-- Execute cada seção separadamente no SQL Editor do Supabase

-- =====================================================
-- PASSO 1: EXTENSÕES
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PASSO 2: ADICIONAR COLUNAS NA TABELA USERPROFILE
-- =====================================================
ALTER TABLE public.userprofile ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE public.userprofile ADD COLUMN IF NOT EXISTS tokens INTEGER DEFAULT 0;
ALTER TABLE public.userprofile ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE public.userprofile ADD COLUMN IF NOT EXISTS completed_mission_ids TEXT[] DEFAULT '{}';
ALTER TABLE public.userprofile ADD COLUMN IF NOT EXISTS earned_badge_ids TEXT[] DEFAULT '{}';
ALTER TABLE public.userprofile ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0;
ALTER TABLE public.userprofile ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.userprofile ADD COLUMN IF NOT EXISTS total_interactions INTEGER DEFAULT 0;

-- =====================================================
-- PASSO 3: CRIAR ÍNDICES PARA USERPROFILE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_userprofile_xp ON public.userprofile(xp DESC);
CREATE INDEX IF NOT EXISTS idx_userprofile_level ON public.userprofile(level DESC);
CREATE INDEX IF NOT EXISTS idx_userprofile_tokens ON public.userprofile(tokens DESC);
CREATE INDEX IF NOT EXISTS idx_userprofile_last_activity ON public.userprofile(last_activity DESC);

-- =====================================================
-- PASSO 4: REMOVER TABELAS EXISTENTES (SE NECESSÁRIO)
-- =====================================================
DROP TABLE IF EXISTS public.user_mission_progress CASCADE;
DROP TABLE IF EXISTS public.missions CASCADE;
DROP TABLE IF EXISTS public.badges CASCADE;
DROP TABLE IF EXISTS public.gamification_history CASCADE;
DROP TABLE IF EXISTS public.rewards CASCADE;
DROP TABLE IF EXISTS public.user_rewards CASCADE;
DROP TABLE IF EXISTS public.gamification_events CASCADE;

-- =====================================================
-- PASSO 5: CRIAR TABELA MISSIONS
-- =====================================================
CREATE TABLE public.missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(100) NOT NULL,
    goal INTEGER NOT NULL DEFAULT 1,
    xp_reward INTEGER NOT NULL DEFAULT 0,
    token_reward INTEGER NOT NULL DEFAULT 0,
    badge_reward_id VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_repeatable BOOLEAN DEFAULT false,
    cooldown_hours INTEGER DEFAULT 0,
    required_level INTEGER DEFAULT 1,
    prerequisites TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PASSO 6: CRIAR ÍNDICES PARA MISSIONS
-- =====================================================
CREATE INDEX idx_missions_type ON public.missions(type);
CREATE INDEX idx_missions_category ON public.missions(category);
CREATE INDEX idx_missions_active ON public.missions(is_active);
CREATE INDEX idx_missions_level ON public.missions(required_level);

-- =====================================================
-- PASSO 7: CRIAR TABELA BADGES
-- =====================================================
CREATE TABLE public.badges (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) NOT NULL,
    color VARCHAR(50) NOT NULL,
    rarity VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    is_secret BOOLEAN DEFAULT false,
    required_level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PASSO 8: CRIAR TABELA USER_MISSION_PROGRESS
-- =====================================================
CREATE TABLE public.user_mission_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
    current_progress INTEGER DEFAULT 0,
    goal INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, mission_id)
);

-- =====================================================
-- PASSO 9: CRIAR TABELA GAMIFICATION_HISTORY
-- =====================================================
CREATE TABLE public.gamification_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    amount INTEGER NOT NULL DEFAULT 0,
    reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PASSO 10: CRIAR TABELA REWARDS
-- =====================================================
CREATE TABLE public.rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    cost_tokens INTEGER NOT NULL,
    reward_type VARCHAR(100) NOT NULL,
    reward_data JSONB,
    is_active BOOLEAN DEFAULT true,
    is_limited BOOLEAN DEFAULT false,
    stock_quantity INTEGER,
    required_level INTEGER DEFAULT 1,
    required_badges TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PASSO 11: CRIAR TABELA USER_REWARDS
-- =====================================================
CREATE TABLE public.user_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
    tokens_spent INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PASSO 12: CRIAR TABELA GAMIFICATION_EVENTS
-- =====================================================
CREATE TABLE public.gamification_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    xp_awarded INTEGER DEFAULT 0,
    tokens_awarded INTEGER DEFAULT 0,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PASSO 13: CRIAR ÍNDICES ADICIONAIS
-- =====================================================
CREATE INDEX idx_user_mission_progress_user ON public.user_mission_progress(user_id);
CREATE INDEX idx_user_mission_progress_mission ON public.user_mission_progress(mission_id);
CREATE INDEX idx_user_mission_progress_completed ON public.user_mission_progress(is_completed);
CREATE INDEX idx_badges_rarity ON public.badges(rarity);
CREATE INDEX idx_badges_category ON public.badges(category);
CREATE INDEX idx_badges_secret ON public.badges(is_secret);
CREATE INDEX idx_gamification_history_user ON public.gamification_history(user_id);
CREATE INDEX idx_gamification_history_type ON public.gamification_history(action_type);
CREATE INDEX idx_rewards_active ON public.rewards(is_active);
CREATE INDEX idx_user_rewards_user ON public.user_rewards(user_id);
CREATE INDEX idx_gamification_events_user ON public.gamification_events(user_id);
CREATE INDEX idx_gamification_events_processed ON public.gamification_events(processed);

-- =====================================================
-- PASSO 14: CRIAR FUNÇÃO UPDATE_UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- PASSO 15: CRIAR TRIGGERS
-- =====================================================
CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON public.missions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON public.badges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON public.rewards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PASSO 16: HABILITAR RLS
-- =====================================================
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_events ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASSO 17: CRIAR POLÍTICAS RLS
-- =====================================================
CREATE POLICY "Missões são visíveis para todos" ON public.missions
    FOR SELECT USING (is_active = true);

CREATE POLICY "Badges são visíveis para todos" ON public.badges
    FOR SELECT USING (is_secret = false OR auth.uid() IS NOT NULL);

CREATE POLICY "Usuários veem apenas seu progresso" ON public.user_mission_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Usuários veem apenas seu histórico" ON public.gamification_history
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Recompensas são visíveis para todos" ON public.rewards
    FOR SELECT USING (is_active = true);

CREATE POLICY "Usuários veem apenas suas recompensas" ON public.user_rewards
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Usuários veem apenas seus eventos" ON public.gamification_events
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- PASSO 18: INSERIR DADOS PADRÃO - MISSÕES
-- =====================================================
INSERT INTO public.missions (title, description, type, goal, xp_reward, token_reward, badge_reward_id, category) VALUES
('Primeira Conversa', 'Tenha sua primeira conversa com o Vision', 'use_vision', 1, 50, 5, 'first_chat', 'iniciante'),
('Criador de Rotinas', 'Crie sua primeira rotina automatizada', 'create_routine', 1, 100, 10, 'routine_creator', 'automacao'),
('Mestre dos Agentes', 'Configure 3 agentes diferentes', 'create_agent', 3, 150, 15, 'agent_master', 'agentes'),
('Perfil Completo', 'Complete todas as informações do seu perfil', 'complete_profile', 1, 75, 8, 'profile_complete', 'perfil'),
('Conversador Ativo', 'Tenha 10 conversas com o Vision', 'use_vision', 10, 200, 20, 'active_user', 'engajamento'),
('Sequência de 7 Dias', 'Use o sistema por 7 dias consecutivos', 'daily_streak', 7, 300, 30, 'week_streak', 'consistencia'),
('Integrador', 'Configure 2 integrações diferentes', 'setup_integration', 2, 250, 25, 'integrator', 'integracao')
ON CONFLICT DO NOTHING;

-- =====================================================
-- PASSO 19: INSERIR DADOS PADRÃO - BADGES
-- =====================================================
INSERT INTO public.badges (id, name, description, icon, color, rarity) VALUES
('first_chat', 'Primeira Conversa', 'Teve a primeira conversa com o Vision', '💬', 'bronze', 'comum'),
('routine_creator', 'Criador de Rotinas', 'Criou sua primeira rotina', '⚡', 'silver', 'incomum'),
('agent_master', 'Mestre dos Agentes', 'Configurou múltiplos agentes', '🤖', 'gold', 'raro'),
('profile_complete', 'Perfil Completo', 'Completou todas as informações do perfil', '👤', 'bronze', 'comum'),
('active_user', 'Usuário Ativo', 'Teve múltiplas conversas', '🔥', 'silver', 'incomum'),
('week_streak', 'Sequência Semanal', 'Usou o sistema por 7 dias consecutivos', '📅', 'gold', 'raro'),
('integrator', 'Integrador', 'Configurou múltiplas integrações', '🔗', 'blue', 'incomum')
ON CONFLICT DO NOTHING;

-- =====================================================
-- PASSO 20: INSERIR DADOS PADRÃO - RECOMPENSAS
-- =====================================================
INSERT INTO public.rewards (name, description, cost_tokens, reward_type, reward_data) VALUES
('Tema Premium', 'Desbloqueie temas exclusivos para a interface', 100, 'cosmetic', '{"themes": ["dark_premium", "neon", "minimal"]}'),
('Boost de XP', 'Ganhe 50% mais XP por 24 horas', 150, 'boost', '{"multiplier": 1.5, "duration_hours": 24}'),
('Acesso Premium', 'Acesso a funcionalidades premium por 7 dias', 500, 'premium_access', '{"duration_days": 7}'),
('Avatar Personalizado', 'Personalize seu avatar com opções exclusivas', 200, 'cosmetic', '{"avatar_options": ["premium_frames", "special_effects"]}'),
('Prioridade no Suporte', 'Atendimento prioritário por 30 dias', 300, 'feature_unlock', '{"priority_level": "high", "duration_days": 30}')
ON CONFLICT DO NOTHING;

-- =====================================================
-- PASSO 21: CRIAR VIEWS ÚTEIS
-- =====================================================
CREATE OR REPLACE VIEW user_ranking AS
SELECT 
    u.id,
    u.xp,
    u.level,
    u.tokens,
    array_length(u.earned_badge_ids, 1) as badge_count,
    ROW_NUMBER() OVER (ORDER BY u.xp DESC) as rank
FROM public.userprofile u
WHERE u.xp > 0
ORDER BY u.xp DESC;

CREATE OR REPLACE VIEW global_gamification_stats AS
SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE xp > 0) as active_users,
    COALESCE(AVG(xp), 0)::INTEGER as average_xp,
    COALESCE(SUM(xp), 0) as total_xp_distributed,
    COALESCE(SUM(tokens), 0) as total_tokens_distributed,
    SUM(array_length(completed_mission_ids, 1)) as total_mission_completions,
    SUM(array_length(earned_badge_ids, 1)) as total_badge_earnings
FROM public.userprofile;

-- =====================================================
-- PASSO 22: INICIALIZAR USUÁRIOS EXISTENTES
-- =====================================================
UPDATE public.userprofile 
SET 
    xp = COALESCE(xp, 0),
    tokens = COALESCE(tokens, 0),
    level = COALESCE(level, 1),
    completed_mission_ids = COALESCE(completed_mission_ids, '{}'),
    earned_badge_ids = COALESCE(earned_badge_ids, '{}'),
    streak = COALESCE(streak, 0),
    total_interactions = COALESCE(total_interactions, 0)
WHERE xp IS NULL OR tokens IS NULL OR level IS NULL;

-- =====================================================
-- CONCLUÍDO!
-- =====================================================
-- Execute cada passo separadamente no Supabase SQL Editor
-- Verifique se cada comando foi executado com sucesso antes de prosseguir
-- Em caso de erro, execute apenas o comando que falhou