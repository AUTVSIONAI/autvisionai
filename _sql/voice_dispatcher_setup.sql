-- 🎙️ VOICE DISPATCHER - ESTRUTURA DE BANCO DE DADOS
-- Tabelas para gerenciar engines de voz, logs e estatísticas

-- ==============================================
-- 1. TABELA DE ENGINES DE VOZ
-- ==============================================

CREATE TABLE IF NOT EXISTS voice_engines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    handler_file VARCHAR(100) NOT NULL, -- Nome do arquivo .ts no diretório engines/
    api_url VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'maintenance')),
    fallback_priority INTEGER NOT NULL DEFAULT 0, -- 0 = maior prioridade
    config JSONB DEFAULT '{}', -- Configurações específicas da engine (API keys, etc.)
    supported_languages TEXT[] DEFAULT ARRAY['pt-BR'],
    max_text_length INTEGER DEFAULT 5000,
    estimated_cost_per_char DECIMAL(10,8) DEFAULT 0,
    requires_api_key BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_voice_engines_status ON voice_engines(status);
CREATE INDEX IF NOT EXISTS idx_voice_engines_priority ON voice_engines(fallback_priority);

-- ==============================================
-- 2. TABELA DE LOGS DE SÍNTESE
-- ==============================================

CREATE TABLE IF NOT EXISTS voice_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    engine_name VARCHAR(50) NOT NULL,
    voice_id VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'error')),
    duration_ms INTEGER,
    audio_url VARCHAR(500),
    error_message TEXT,
    processing_time_ms INTEGER,
    characters_count INTEGER GENERATED ALWAYS AS (char_length(text)) STORED,
    estimated_cost DECIMAL(10,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_voice_logs_user_id ON voice_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_logs_engine_name ON voice_logs(engine_name);
CREATE INDEX IF NOT EXISTS idx_voice_logs_status ON voice_logs(status);
CREATE INDEX IF NOT EXISTS idx_voice_logs_created_at ON voice_logs(created_at DESC);

-- ==============================================
-- 3. TABELA DE ESTATÍSTICAS DE USO
-- ==============================================

CREATE TABLE IF NOT EXISTS voice_usage_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engine_name VARCHAR(50) NOT NULL,
    total_requests INTEGER DEFAULT 0,
    total_success INTEGER DEFAULT 0,
    total_errors INTEGER DEFAULT 0,
    total_characters INTEGER DEFAULT 0,
    total_cost DECIMAL(10,2) DEFAULT 0,
    avg_response_time_ms INTEGER DEFAULT 0,
    last_24h_requests INTEGER DEFAULT 0,
    last_24h_errors INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN total_requests > 0 THEN 
                ROUND((total_success::DECIMAL / total_requests::DECIMAL) * 100, 2)
            ELSE 0 
        END
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(engine_name)
);

-- ==============================================
-- 4. ATUALIZAR TABELA DE VOZES DISPONÍVEIS
-- ==============================================

-- Adicionar colunas para integração com VoiceDispatcher se não existirem
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'available_voices' AND column_name = 'engine_name') THEN
        ALTER TABLE available_voices ADD COLUMN engine_name VARCHAR(50) DEFAULT 'openvoice';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'available_voices' AND column_name = 'external_voice_id') THEN
        ALTER TABLE available_voices ADD COLUMN external_voice_id VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'available_voices' AND column_name = 'quality_rating') THEN
        ALTER TABLE available_voices ADD COLUMN quality_rating INTEGER DEFAULT 5 CHECK (quality_rating >= 1 AND quality_rating <= 10);
    END IF;
END $$;

-- ==============================================
-- 5. INSERIR ENGINES PADRÃO
-- ==============================================

INSERT INTO voice_engines (name, description, handler_file, api_url, status, fallback_priority, config, supported_languages, requires_api_key) VALUES 
-- OpenVoice (prioridade 1 - primeira tentativa)
('openvoice', 'Engine OpenVoice open-source para síntese de voz', 'openvoice.ts', 'http://localhost:8080', 'offline', 1, 
    '{"api_key": "", "timeout": 30000}', 
    ARRAY['pt-BR', 'en-US'], false),

-- ElevenLabs (prioridade 2 - segunda tentativa)  
('elevenlabs', 'API premium ElevenLabs com vozes naturais', 'elevenlabs.ts', 'https://api.elevenlabs.io', 'offline', 2,
    '{"api_key": "", "model_id": "eleven_multilingual_v2", "timeout": 60000}',
    ARRAY['pt-BR', 'en-US', 'es-ES'], true),

-- XTTS (prioridade 3 - terceira tentativa)
('xtts', 'Coqui XTTS para clonagem e síntese de voz', 'xtts.ts', 'http://localhost:8000', 'offline', 3,
    '{"speaker_wav": "", "language": "pt", "timeout": 45000}',
    ARRAY['pt-BR', 'en-US', 'es-ES', 'fr-FR'], false),

-- Google TTS (prioridade 4 - último recurso)
('google-tts', 'Google Cloud Text-to-Speech API', 'googletts.ts', 'https://texttospeech.googleapis.com', 'offline', 4,
    '{"api_key": "", "project_id": "", "timeout": 30000}',
    ARRAY['pt-BR', 'pt-PT', 'en-US', 'es-ES'], true)
ON CONFLICT (name) DO NOTHING;

-- ==============================================
-- 6. INSERIR VOZES PADRÃO PARA CADA ENGINE
-- ==============================================

-- Vozes OpenVoice
INSERT INTO available_voices (voice_id, voice_name, description, language, gender, engine_name, external_voice_id, is_available, is_premium, price_tokens, quality_rating) VALUES 
('openvoice-pt-br-female-1', 'Ana Clara (OpenVoice)', 'Voz feminina brasileira natural', 'pt-BR', 'female', 'openvoice', 'pt-br-female-1', true, false, 0, 8),
('openvoice-pt-br-male-1', 'Carlos (OpenVoice)', 'Voz masculina brasileira natural', 'pt-BR', 'male', 'openvoice', 'pt-br-male-1', true, false, 0, 8)
ON CONFLICT (voice_id) DO NOTHING;

-- Vozes ElevenLabs
INSERT INTO available_voices (voice_id, voice_name, description, language, gender, engine_name, external_voice_id, is_available, is_premium, price_tokens, quality_rating) VALUES 
('elevenlabs-21m00Tcm4TlvDq8ikWAM', 'Rachel (ElevenLabs)', 'Voz feminina premium ElevenLabs', 'en-US', 'female', 'elevenlabs', '21m00Tcm4TlvDq8ikWAM', false, true, 10, 10),
('elevenlabs-AZnzlk1XvdvUeBnXmlld', 'Domi (ElevenLabs)', 'Voz feminina jovem ElevenLabs', 'en-US', 'female', 'elevenlabs', 'AZnzlk1XvdvUeBnXmlld', false, true, 10, 9)
ON CONFLICT (voice_id) DO NOTHING;

-- Vozes Google TTS
INSERT INTO available_voices (voice_id, voice_name, description, language, gender, engine_name, external_voice_id, is_available, is_premium, price_tokens, quality_rating) VALUES 
('google-pt-BR-Wavenet-A', 'Cristina (Google)', 'Voz feminina brasileira WaveNet', 'pt-BR', 'female', 'google-tts', 'pt-BR-Wavenet-A-FEMALE', false, true, 5, 9),
('google-pt-BR-Wavenet-B', 'Ricardo (Google)', 'Voz masculina brasileira WaveNet', 'pt-BR', 'male', 'google-tts', 'pt-BR-Wavenet-B-MALE', false, true, 5, 9)
ON CONFLICT (voice_id) DO NOTHING;

-- ==============================================
-- 7. VIEWS PARA RELATÓRIOS
-- ==============================================

-- View para estatísticas em tempo real
CREATE OR REPLACE VIEW voice_stats_realtime AS
SELECT 
    e.name as engine_name,
    e.status,
    e.fallback_priority,
    COALESCE(s.total_requests, 0) as total_requests,
    COALESCE(s.total_success, 0) as total_success,
    COALESCE(s.total_errors, 0) as total_errors,
    COALESCE(s.success_rate, 0) as success_rate,
    COUNT(l.id) FILTER (WHERE l.created_at >= NOW() - INTERVAL '24 hours') as requests_24h,
    COUNT(l.id) FILTER (WHERE l.created_at >= NOW() - INTERVAL '24 hours' AND l.status = 'success') as success_24h,
    AVG(l.processing_time_ms) FILTER (WHERE l.created_at >= NOW() - INTERVAL '24 hours') as avg_response_time_24h
FROM voice_engines e
LEFT JOIN voice_usage_stats s ON e.name = s.engine_name
LEFT JOIN voice_logs l ON e.name = l.engine_name
GROUP BY e.name, e.status, e.fallback_priority, s.total_requests, s.total_success, s.total_errors, s.success_rate
ORDER BY e.fallback_priority;

-- View para análise de usuários
CREATE OR REPLACE VIEW voice_user_analytics AS
SELECT 
    user_id,
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE status = 'success') as successful_requests,
    COUNT(*) FILTER (WHERE status = 'error') as failed_requests,
    SUM(characters_count) as total_characters,
    SUM(estimated_cost) as total_cost,
    AVG(duration_ms) as avg_audio_duration,
    COUNT(DISTINCT engine_name) as engines_used,
    MAX(created_at) as last_request,
    DATE_TRUNC('month', MIN(created_at)) as first_request_month
FROM voice_logs
GROUP BY user_id
ORDER BY total_requests DESC;

-- ==============================================
-- 8. FUNÇÃO PARA ATUALIZAR ESTATÍSTICAS
-- ==============================================

CREATE OR REPLACE FUNCTION update_voice_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar ou inserir estatísticas da engine
    INSERT INTO voice_usage_stats (
        engine_name,
        total_requests,
        total_success,
        total_errors,
        total_characters,
        avg_response_time_ms,
        updated_at
    )
    SELECT 
        NEW.engine_name,
        1,
        CASE WHEN NEW.status = 'success' THEN 1 ELSE 0 END,
        CASE WHEN NEW.status = 'error' THEN 1 ELSE 0 END,
        COALESCE(NEW.characters_count, 0),
        COALESCE(NEW.processing_time_ms, 0),
        NOW()
    ON CONFLICT (engine_name) DO UPDATE SET
        total_requests = voice_usage_stats.total_requests + 1,
        total_success = voice_usage_stats.total_success + (CASE WHEN NEW.status = 'success' THEN 1 ELSE 0 END),
        total_errors = voice_usage_stats.total_errors + (CASE WHEN NEW.status = 'error' THEN 1 ELSE 0 END),
        total_characters = voice_usage_stats.total_characters + COALESCE(NEW.characters_count, 0),
        avg_response_time_ms = (voice_usage_stats.avg_response_time_ms + COALESCE(NEW.processing_time_ms, 0)) / 2,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar estatísticas automaticamente
DROP TRIGGER IF EXISTS trigger_update_voice_stats ON voice_logs;
CREATE TRIGGER trigger_update_voice_stats
    AFTER INSERT ON voice_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_voice_stats();

-- ==============================================
-- 9. POLÍTICAS RLS (Row Level Security)
-- ==============================================

-- Habilitar RLS nas tabelas
ALTER TABLE voice_engines ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_usage_stats ENABLE ROW LEVEL SECURITY;

-- Políticas para voice_engines (apenas admins podem modificar)
CREATE POLICY "voice_engines_select_all" ON voice_engines FOR SELECT USING (true);
CREATE POLICY "voice_engines_admin_all" ON voice_engines FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Políticas para voice_logs (usuários veem apenas seus logs)
CREATE POLICY "voice_logs_user_select" ON voice_logs FOR SELECT USING (
    user_id = auth.uid()::text OR
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "voice_logs_insert" ON voice_logs FOR INSERT WITH CHECK (true);

-- Políticas para voice_usage_stats (apenas leitura para todos, escrita apenas sistema)
CREATE POLICY "voice_stats_select_all" ON voice_usage_stats FOR SELECT USING (true);
CREATE POLICY "voice_stats_system_write" ON voice_usage_stats FOR ALL USING (
    current_setting('role') = 'service_role' OR
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- ==============================================
-- 10. INSERIR DADOS INICIAIS DE CONFIGURAÇÃO
-- ==============================================

-- Configurações padrão do sistema
INSERT INTO system_settings (key, value, description) VALUES 
('voice_dispatcher_enabled', 'true', 'Habilitar VoiceDispatcher'),
('voice_default_engine', 'openvoice', 'Engine padrão para síntese'),
('voice_max_text_length', '5000', 'Tamanho máximo de texto para síntese'),
('voice_rate_limit_per_user', '100', 'Limite de requisições por usuário por hora'),
('voice_cache_duration', '3600', 'Duração do cache de áudio em segundos')
ON CONFLICT (key) DO NOTHING;

-- ==============================================
-- COMMIT E NOTIFICAÇÃO
-- ==============================================

-- Comentário final
COMMENT ON TABLE voice_engines IS 'Configuração das engines de síntese de voz disponíveis';
COMMENT ON TABLE voice_logs IS 'Log de todas as sínteses de voz realizadas';
COMMENT ON TABLE voice_usage_stats IS 'Estatísticas de uso agregadas por engine';

-- Mostrar status final
SELECT 
    'VoiceDispatcher Database Setup' as status,
    COUNT(*) as engines_configured
FROM voice_engines;

SELECT 
    'Available Voices' as status,
    COUNT(*) as total_voices,
    COUNT(*) FILTER (WHERE is_available = true) as active_voices
FROM available_voices;
