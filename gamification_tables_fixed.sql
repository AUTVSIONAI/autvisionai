-- Script SQL corrigido para criar todas as tabelas necessárias para o sistema de gamificação
-- Compatível com a estrutura auth.users do Supabase

-- =====================================================
-- 1. EXTENSÕES NECESSÁRIAS
-- =====================================================

-- Habilitar extensões UUID (se não estiver habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. CRIAR TABELA DE PERFIS DE USUÁRIO (GAMIFICAÇÃO)
-- =====================================================

-- Criar tabela separada para dados de gamificação dos usuários
-- que referencia auth.users
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    xp INTEGER DEFAULT 0,
    tokens INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    completed_mission_ids TEXT[] DEFAULT '{}',
    earned_badge_ids TEXT[] DEFAULT '{}',
    streak INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE,
    total_interactions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_xp ON user_profiles(xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_level ON user_profiles(level DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tokens ON user_profiles(tokens DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_activity ON user_profiles(last_activity DESC);

-- =====================================================
-- 3. TABELA DE MISSÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'use_vision', 'create_routine', 'create_agent', etc.
    goal INTEGER NOT NULL DEFAULT 1,
    xp_reward INTEGER NOT NULL DEFAULT 0,
    token_reward INTEGER NOT NULL DEFAULT 0,
    badge_reward_id VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_repeatable BOOLEAN DEFAULT false,
    cooldown_hours INTEGER DEFAULT 0,
    required_level INTEGER DEFAULT 1,
    prerequisites TEXT[], -- IDs de missões que devem ser completadas antes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para missões
CREATE INDEX IF NOT EXISTS idx_missions_type ON missions(type);
CREATE INDEX IF NOT EXISTS idx_missions_category ON missions(category);
CREATE INDEX IF NOT EXISTS idx_missions_active ON missions(is_active);
CREATE INDEX IF NOT EXISTS idx_missions_level ON missions(required_level);

-- =====================================================
-- 4. TABELA DE BADGES/CONQUISTAS
-- =====================================================

CREATE TABLE IF NOT EXISTS badges (
    id VARCHAR(100) PRIMARY KEY, -- ID único como string (ex: 'first_chat')
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) NOT NULL, -- Emoji ou código do ícone
    color VARCHAR(50) NOT NULL, -- 'bronze', 'silver', 'gold', etc.
    rarity VARCHAR(50) NOT NULL, -- 'comum', 'incomum', 'raro', 'épico', 'lendário'
    category VARCHAR(100),
    is_secret BOOLEAN DEFAULT false,
    required_level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para badges
CREATE INDEX IF NOT EXISTS idx_badges_rarity ON badges(rarity);
CREATE INDEX IF NOT EXISTS idx_badges_category ON badges(category);
CREATE INDEX IF NOT EXISTS idx_badges_secret ON badges(is_secret);

-- =====================================================
-- 5. TABELA DE PROGRESSO DE MISSÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS user_mission_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    current_progress INTEGER DEFAULT 0,
    goal INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, mission_id)
);

-- Índices para progresso de missões
CREATE INDEX IF NOT EXISTS idx_user_mission_progress_user ON user_mission_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_mission_progress_mission ON user_mission_progress(mission_id);
CREATE INDEX IF NOT EXISTS idx_user_mission_progress_completed ON user_mission_progress(is_completed);

-- =====================================================
-- 6. TABELA DE HISTÓRICO DE XP/TOKENS
-- =====================================================

CREATE TABLE IF NOT EXISTS gamification_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL, -- 'xp_gained', 'tokens_earned', 'tokens_spent', 'level_up', 'mission_completed', 'badge_earned'
    amount INTEGER NOT NULL DEFAULT 0,
    reason TEXT,
    metadata JSONB, -- Dados adicionais (ex: mission_id, badge_id, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para histórico
CREATE INDEX IF NOT EXISTS idx_gamification_history_user ON gamification_history(user_id);
CREATE INDEX IF NOT EXISTS idx_gamification_history_type ON gamification_history(action_type);
CREATE INDEX IF NOT EXISTS idx_gamification_history_date ON gamification_history(created_at DESC);

-- =====================================================
-- 7. TABELA DE RECOMPENSAS/LOJA
-- =====================================================

CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    cost_tokens INTEGER NOT NULL,
    reward_type VARCHAR(100) NOT NULL, -- 'feature_unlock', 'cosmetic', 'boost', 'premium_access'
    reward_data JSONB, -- Dados específicos da recompensa
    is_active BOOLEAN DEFAULT true,
    is_limited BOOLEAN DEFAULT false,
    stock_quantity INTEGER,
    required_level INTEGER DEFAULT 1,
    required_badges TEXT[], -- IDs de badges necessários
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para recompensas
CREATE INDEX IF NOT EXISTS idx_rewards_active ON rewards(is_active);
CREATE INDEX IF NOT EXISTS idx_rewards_type ON rewards(reward_type);
CREATE INDEX IF NOT EXISTS idx_rewards_cost ON rewards(cost_tokens);

-- =====================================================
-- 8. TABELA DE RECOMPENSAS RESGATADAS
-- =====================================================

CREATE TABLE IF NOT EXISTS user_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
    tokens_spent INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para recompensas do usuário
CREATE INDEX IF NOT EXISTS idx_user_rewards_user ON user_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_reward ON user_rewards(reward_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_active ON user_rewards(is_active);

-- =====================================================
-- 9. TABELA DE EVENTOS DE GAMIFICAÇÃO
-- =====================================================

CREATE TABLE IF NOT EXISTS gamification_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- 'login', 'chat_message', 'routine_created', etc.
    event_data JSONB,
    xp_awarded INTEGER DEFAULT 0,
    tokens_awarded INTEGER DEFAULT 0,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para eventos
CREATE INDEX IF NOT EXISTS idx_gamification_events_user ON gamification_events(user_id);
CREATE INDEX IF NOT EXISTS idx_gamification_events_type ON gamification_events(event_type);
CREATE INDEX IF NOT EXISTS idx_gamification_events_processed ON gamification_events(processed);
CREATE INDEX IF NOT EXISTS idx_gamification_events_date ON gamification_events(created_at DESC);

-- =====================================================
-- 10. FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON badges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON rewards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_mission_progress_updated_at BEFORE UPDATE ON user_mission_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, full_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para criar perfil automaticamente
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- =====================================================
-- 11. POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_events ENABLE ROW LEVEL SECURITY;

-- Políticas para perfis de usuário (usuários só veem o próprio perfil)
CREATE POLICY "Usuários veem apenas seu perfil" ON user_profiles
    FOR ALL USING (auth.uid() = id);

-- Políticas para missões (todos podem ler missões ativas)
CREATE POLICY "Missões são visíveis para todos" ON missions
    FOR SELECT USING (is_active = true);

-- Políticas para badges (todos podem ler badges não secretos)
CREATE POLICY "Badges são visíveis para todos" ON badges
    FOR SELECT USING (is_secret = false OR auth.uid() IS NOT NULL);

-- Políticas para progresso de missões (usuários só veem o próprio progresso)
CREATE POLICY "Usuários veem apenas seu progresso" ON user_mission_progress
    FOR ALL USING (auth.uid() = user_id);

-- Políticas para histórico (usuários só veem o próprio histórico)
CREATE POLICY "Usuários veem apenas seu histórico" ON gamification_history
    FOR ALL USING (auth.uid() = user_id);

-- Políticas para recompensas (todos podem ler recompensas ativas)
CREATE POLICY "Recompensas são visíveis para todos" ON rewards
    FOR SELECT USING (is_active = true);

-- Políticas para recompensas do usuário (usuários só veem suas recompensas)
CREATE POLICY "Usuários veem apenas suas recompensas" ON user_rewards
    FOR ALL USING (auth.uid() = user_id);

-- Políticas para eventos (usuários só veem seus eventos)
CREATE POLICY "Usuários veem apenas seus eventos" ON gamification_events
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 12. INSERIR DADOS PADRÃO
-- =====================================================

-- Inserir missões padrão
INSERT INTO missions (title, description, type, goal, xp_reward, token_reward, badge_reward_id, category) VALUES
('Primeira Conversa', 'Tenha sua primeira conversa com o Vision', 'use_vision', 1, 50, 5, 'first_chat', 'iniciante'),
('Criador de Rotinas', 'Crie sua primeira rotina automatizada', 'create_routine', 1, 100, 10, 'routine_creator', 'automacao'),
('Mestre dos Agentes', 'Configure 3 agentes diferentes', 'create_agent', 3, 150, 15, 'agent_master', 'agentes'),
('Perfil Completo', 'Complete todas as informações do seu perfil', 'complete_profile', 1, 75, 8, 'profile_complete', 'perfil'),
('Conversador Ativo', 'Tenha 10 conversas com o Vision', 'use_vision', 10, 200, 20, 'active_user', 'engajamento'),
('Sequência de 7 Dias', 'Use o sistema por 7 dias consecutivos', 'daily_streak', 7, 300, 30, 'week_streak', 'consistencia'),
('Integrador', 'Configure 2 integrações diferentes', 'setup_integration', 2, 250, 25, 'integrator', 'integracao')
ON CONFLICT DO NOTHING;

-- Inserir badges padrão
INSERT INTO badges (id, name, description, icon, color, rarity) VALUES
('first_chat', 'Primeira Conversa', 'Teve a primeira conversa com o Vision', '💬', 'bronze', 'comum'),
('routine_creator', 'Criador de Rotinas', 'Criou sua primeira rotina', '⚡', 'silver', 'incomum'),
('agent_master', 'Mestre dos Agentes', 'Configurou múltiplos agentes', '🤖', 'gold', 'raro'),
('profile_complete', 'Perfil Completo', 'Completou todas as informações do perfil', '👤', 'bronze', 'comum'),
('active_user', 'Usuário Ativo', 'Teve múltiplas conversas', '🔥', 'silver', 'incomum'),
('week_streak', 'Sequência Semanal', 'Usou o sistema por 7 dias consecutivos', '📅', 'gold', 'raro'),
('integrator', 'Integrador', 'Configurou múltiplas integrações', '🔗', 'blue', 'incomum')
ON CONFLICT DO NOTHING;

-- Inserir algumas recompensas padrão
INSERT INTO rewards (name, description, cost_tokens, reward_type, reward_data) VALUES
('Tema Premium', 'Desbloqueie temas exclusivos para a interface', 100, 'cosmetic', '{"themes": ["dark_premium", "neon", "minimal"]}'),
('Boost de XP', 'Ganhe 50% mais XP por 24 horas', 150, 'boost', '{"multiplier": 1.5, "duration_hours": 24}'),
('Acesso Premium', 'Acesso a funcionalidades premium por 7 dias', 500, 'premium_access', '{"duration_days": 7}'),
('Avatar Personalizado', 'Personalize seu avatar com opções exclusivas', 200, 'cosmetic', '{"avatar_options": ["premium_frames", "special_effects"]}'),
('Prioridade no Suporte', 'Atendimento prioritário por 30 dias', 300, 'feature_unlock', '{"priority_level": "high", "duration_days": 30}')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 13. VIEWS ÚTEIS
-- =====================================================

-- View para ranking de usuários
CREATE OR REPLACE VIEW user_ranking AS
SELECT 
    up.id,
    au.email,
    up.full_name,
    up.xp,
    up.level,
    up.tokens,
    array_length(up.earned_badge_ids, 1) as badge_count,
    ROW_NUMBER() OVER (ORDER BY up.xp DESC) as rank
FROM user_profiles up
JOIN auth.users au ON au.id = up.id
WHERE up.xp > 0
ORDER BY up.xp DESC;

-- View para estatísticas globais
CREATE OR REPLACE VIEW global_gamification_stats AS
SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE xp > 0) as active_users,
    COALESCE(AVG(xp), 0)::INTEGER as average_xp,
    COALESCE(SUM(xp), 0) as total_xp_distributed,
    COALESCE(SUM(tokens), 0) as total_tokens_distributed,
    SUM(array_length(completed_mission_ids, 1)) as total_mission_completions,
    SUM(array_length(earned_badge_ids, 1)) as total_badge_earnings
FROM user_profiles;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

-- Comentários finais:
-- 1. Execute este script no SQL Editor do Supabase
-- 2. Verifique se todas as tabelas foram criadas corretamente
-- 3. Teste as políticas RLS com diferentes usuários
-- 4. Monitore a performance com os índices criados
-- 5. Ajuste as recompensas e missões conforme necessário
-- 6. A tabela user_profiles será criada automaticamente para novos usuários
-- 7. Para usuários existentes, execute: INSERT INTO user_profiles (id, full_name) SELECT id, email FROM auth.users ON CONFLICT DO NOTHING;