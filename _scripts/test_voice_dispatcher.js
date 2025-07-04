const axios = require('axios');

async function testVoiceDispatcher() {
    try {
        console.log('🔊 Testando VoiceDispatcher...');
        
        // 1. Primeiro, vamos ativar a engine OpenVoice diretamente via Supabase
        console.log('⚙️ Ativando engine OpenVoice...');
        const updateResponse = await axios.patch('https://woooqlznapzfhmjlyyll.supabase.co/rest/v1/voice_engines?name=eq.openvoice', {
            status: 'online'
        }, {
            headers: {
                'Authorization': 'Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE',
                'apikey': 'YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE',
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ Engine ativada:', updateResponse.status);
        
        // 2. Verificar as engines disponíveis
        console.log('📋 Verificando engines disponíveis...');
        const enginesResponse = await axios.get('https://woooqlznapzfhmjlyyll.supabase.co/rest/v1/voice_engines?select=name,status,fallback_priority&order=fallback_priority', {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw'
            }
        });
        console.log('📊 Engines:', enginesResponse.data);
        
        // 3. Verificar vozes disponíveis
        console.log('🎤 Verificando vozes disponíveis...');
        const voicesResponse = await axios.get('https://woooqlznapzfhmjlyyll.supabase.co/rest/v1/available_voices?select=voice_id,voice_name,engine_name,is_available&engine_name=eq.openvoice', {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw'
            }
        });
        console.log('🎵 Vozes OpenVoice:', voicesResponse.data);
        
        // 4. Testar síntese de voz
        console.log('🎙️ Testando síntese de voz...');
        const synthesisResponse = await axios.post('http://localhost:3001/voice-dispatcher/synthesize', {
            text: 'Olá, este é um teste do VoiceDispatcher!',
            voice_id: 'openvoice-pt-br-female-1',
            user_id: 'test_user_123'
        });
        console.log('🎵 Resultado da síntese:', synthesisResponse.data);
        
    } catch (error) {
        console.error('❌ Erro:', error.response?.data || error.message);
    }
}

testVoiceDispatcher();
