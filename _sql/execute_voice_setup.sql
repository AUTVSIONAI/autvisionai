-- SQL SIMPLIFICADO PARA VOICE DISPATCHER
-- Versão segura sem funcionalidades complexas

-- 1. TABELA DE ENGINES DE VOZ
CREATE TABLE IF NOT EXISTS voice_engines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    handler_file VARCHAR(100) NOT NULL,
    api_url VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'maintenance')),
    fallback_priority INTEGER NOT NULL DEFAULT 0,
    config JSONB DEFAULT '{}',
    supported_languages TEXT[] DEFAULT ARRAY['pt-BR'],
    max_text_length INTEGER DEFAULT 5000,
    estimated_cost_per_char DECIMAL(10,8) DEFAULT 0,
    requires_api_key BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE LOGS DE SÍNTESE
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
    characters_count INTEGER,
    estimated_cost DECIMAL(10,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE ESTATÍSTICAS DE USO
CREATE TABLE IF NOT EXISTS voice_usage_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engine_name VARCHAR(50) NOT NULL UNIQUE,
    total_requests INTEGER DEFAULT 0,
    total_success INTEGER DEFAULT 0,
    total_errors INTEGER DEFAULT 0,
    total_characters INTEGER DEFAULT 0,
    total_cost DECIMAL(10,2) DEFAULT 0,
    avg_response_time_ms INTEGER DEFAULT 0,
    last_24h_requests INTEGER DEFAULT 0,
    last_24h_errors INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. INSERIR ENGINES PADRÃO
INSERT INTO voice_engines (name, description, handler_file, api_url, status, fallback_priority, config, supported_languages, requires_api_key) VALUES 
('openvoice', 'Engine OpenVoice open-source para síntese de voz', 'openvoice.ts', 'http://localhost:8080', 'offline', 1, 
    '{"api_key": "", "timeout": 30000}', 
    ARRAY['pt-BR', 'en-US'], false),
('elevenlabs', 'API premium ElevenLabs com vozes naturais', 'elevenlabs.ts', 'https://api.elevenlabs.io', 'offline', 2,
    '{"api_key": "", "model_id": "eleven_multilingual_v2", "timeout": 60000}',
    ARRAY['pt-BR', 'en-US', 'es-ES'], true),
('xtts', 'Coqui XTTS para clonagem e síntese de voz', 'xtts.ts', 'http://localhost:8000', 'offline', 3,
    '{"speaker_wav": "", "language": "pt", "timeout": 45000}',
    ARRAY['pt-BR', 'en-US', 'es-ES', 'fr-FR'], false),
('google-tts', 'Google Cloud Text-to-Speech API', 'googletts.ts', 'https://texttospeech.googleapis.com', 'offline', 4,
    '{"api_key": "", "project_id": "", "timeout": 30000}',
    ARRAY['pt-BR', 'pt-PT', 'en-US', 'es-ES'], true)
ON CONFLICT (name) DO NOTHING;

-- 5. ADICIONAR COLUNAS À TABELA available_voices SE NÃO EXISTIREM
ALTER TABLE available_voices ADD COLUMN IF NOT EXISTS engine_name VARCHAR(50) DEFAULT 'openvoice';
ALTER TABLE available_voices ADD COLUMN IF NOT EXISTS external_voice_id VARCHAR(100);
ALTER TABLE available_voices ADD COLUMN IF NOT EXISTS quality_rating INTEGER DEFAULT 5;

-- 6. INSERIR VOZES PADRÃO
INSERT INTO available_voices (voice_id, voice_name, description, language, gender, engine_name, external_voice_id, is_available, is_premium, price_tokens, quality_rating) VALUES 
('openvoice-pt-br-female-1', 'Ana Clara (OpenVoice)', 'Voz feminina brasileira natural', 'pt-BR', 'female', 'openvoice', 'pt-br-female-1', true, false, 0, 8),
('openvoice-pt-br-male-1', 'Carlos (OpenVoice)', 'Voz masculina brasileira natural', 'pt-BR', 'male', 'openvoice', 'pt-br-male-1', true, false, 0, 8),
('elevenlabs-21m00Tcm4TlvDq8ikWAM', 'Rachel (ElevenLabs)', 'Voz feminina premium ElevenLabs', 'en-US', 'female', 'elevenlabs', '21m00Tcm4TlvDq8ikWAM', false, true, 10, 10),
('elevenlabs-AZnzlk1XvdvUeBnXmlld', 'Domi (ElevenLabs)', 'Voz feminina jovem ElevenLabs', 'en-US', 'female', 'elevenlabs', 'AZnzlk1XvdvUeBnXmlld', false, true, 10, 9),
('google-pt-BR-Wavenet-A', 'Cristina (Google)', 'Voz feminina brasileira WaveNet', 'pt-BR', 'female', 'google-tts', 'pt-BR-Wavenet-A-FEMALE', false, true, 5, 9),
('google-pt-BR-Wavenet-B', 'Ricardo (Google)', 'Voz masculina brasileira WaveNet', 'pt-BR', 'male', 'google-tts', 'pt-BR-Wavenet-B-MALE', false, true, 5, 9)
ON CONFLICT (voice_id) DO NOTHING;

-- 7. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_voice_engines_status ON voice_engines(status);
CREATE INDEX IF NOT EXISTS idx_voice_engines_priority ON voice_engines(fallback_priority);
CREATE INDEX IF NOT EXISTS idx_voice_logs_user_id ON voice_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_logs_engine_name ON voice_logs(engine_name);
CREATE INDEX IF NOT EXISTS idx_voice_logs_status ON voice_logs(status);
CREATE INDEX IF NOT EXISTS idx_voice_logs_created_at ON voice_logs(created_at DESC);

-- FINALIZANDO
SELECT 'VoiceDispatcher database setup completed!' as message;
