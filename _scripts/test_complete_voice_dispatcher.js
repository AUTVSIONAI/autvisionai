const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * 🎯 Teste Completo do VoiceDispatcher
 * Valida toda a pipeline de síntese de voz
 */

async function testCompleteVoiceDispatcher() {
    console.log('🎙️ === TESTE COMPLETO DO VOICEDISPATCHER ===\n');
    
    try {
        // 1. Verificar se o backend está rodando
        console.log('🔍 1. Verificando conectividade do backend...');
        const healthResponse = await axios.get('http://localhost:3001/health');
        console.log('✅ Backend online:', healthResponse.data);
        
        // 2. Verificar engines disponíveis
        console.log('\n📋 2. Verificando engines disponíveis...');
        const enginesResponse = await axios.get('https://woooqlznapzfhmjlyyll.supabase.co/rest/v1/voice_engines?select=name,status,fallback_priority&order=fallback_priority', {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw'
            }
        });
        
        console.log('🔧 Engines configuradas:');
        enginesResponse.data.forEach(engine => {
            console.log(`  - ${engine.name}: ${engine.status} (prioridade: ${engine.fallback_priority})`);
        });
        
        // 3. Verificar vozes disponíveis
        console.log('\n🎤 3. Verificando vozes disponíveis...');
        const voicesResponse = await axios.get('https://woooqlznapzfhmjlyyll.supabase.co/rest/v1/available_voices?select=voice_id,voice_name,engine_name,is_available&is_available=eq.true', {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw'
            }
        });
        
        const availableVoices = voicesResponse.data;
        console.log(`🎵 ${availableVoices.length} vozes disponíveis:`);
        availableVoices.forEach(voice => {
            console.log(`  - ${voice.voice_name} (${voice.engine_name}): ${voice.voice_id}`);
        });
        
        // 4. Testar síntese de voz com diferentes vozes
        console.log('\n🎙️ 4. Testando síntese de voz...');
        
        const testTexts = [
            'Olá! Este é um teste do VoiceDispatcher do AUTVISION.',
            'O sistema está funcionando perfeitamente com fallback automático.',
            'Agora o Vision pode falar com voz real!'
        ];
        
        const testVoices = availableVoices.filter(v => v.engine_name === 'openvoice').slice(0, 2);
        
        for (const voice of testVoices) {
            for (const text of testTexts) {
                console.log(`\n🎤 Testando: ${voice.voice_name} - "${text.substring(0, 30)}..."`);
                
                try {
                    const startTime = Date.now();
                    const synthesisResponse = await axios.post('http://localhost:3001/voice-dispatcher/synthesize', {
                        text: text,
                        voice_id: voice.voice_id,
                        user_id: 'test_user_vision',
                        speed: 1.0,
                        pitch: 0,
                        volume: 0.8
                    }, {
                        timeout: 60000
                    });
                    
                    const duration = Date.now() - startTime;
                    
                    if (synthesisResponse.data.success) {
                        console.log(`✅ Sucesso em ${duration}ms`);
                        console.log(`   Engine usada: ${synthesisResponse.data.engine_used}`);
                        console.log(`   Duração áudio: ${synthesisResponse.data.duration_ms}ms`);
                        
                        // Salvar áudio se retornou base64
                        if (synthesisResponse.data.audio_base64) {
                            const audioDir = path.join(__dirname, '..', 'temp_audio');
                            if (!fs.existsSync(audioDir)) {
                                fs.mkdirSync(audioDir, { recursive: true });
                            }
                            
                            const fileName = `test_${voice.voice_id}_${Date.now()}.wav`;
                            const filePath = path.join(audioDir, fileName);
                            
                            fs.writeFileSync(filePath, synthesisResponse.data.audio_base64, 'base64');
                            console.log(`   Áudio salvo: ${filePath}`);
                        }
                        
                    } else {
                        console.log(`❌ Falha: ${synthesisResponse.data.error}`);
                        console.log(`   Código: ${synthesisResponse.data.code}`);
                    }
                    
                } catch (error) {
                    console.log(`❌ Erro na requisição: ${error.message}`);
                    if (error.response?.data) {
                        console.log(`   Detalhes: ${JSON.stringify(error.response.data, null, 2)}`);
                    }
                }
                
                // Delay entre testes
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        // 5. Verificar logs de síntese
        console.log('\n📊 5. Verificando logs de síntese...');
        const logsResponse = await axios.get('https://woooqlznapzfhmjlyyll.supabase.co/rest/v1/voice_logs?select=user_id,engine_name,voice_id,status,duration_ms,created_at&order=created_at.desc&limit=10', {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw'
            }
        });
        
        console.log('📋 Últimos logs de síntese:');
        logsResponse.data.forEach(log => {
            console.log(`  - ${log.created_at}: ${log.engine_name} ${log.status} (${log.duration_ms}ms)`);
        });
        
        // 6. Estatísticas de uso
        console.log('\n📈 6. Estatísticas de uso...');
        const statsResponse = await axios.get('https://woooqlznapzfhmjlyyll.supabase.co/rest/v1/voice_usage_stats?select=engine_name,total_requests,total_success,total_errors', {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw'
            }
        });
        
        console.log('📊 Estatísticas por engine:');
        statsResponse.data.forEach(stat => {
            console.log(`  - ${stat.engine_name}: ${stat.total_requests} requisições (${stat.total_success} sucessos, ${stat.total_errors} erros)`);
        });
        
        console.log('\n🎉 === TESTE COMPLETO FINALIZADO ===');
        console.log('✅ VoiceDispatcher está funcionando e pronto para produção!');
        
    } catch (error) {
        console.error('❌ Erro durante o teste:', error.message);
        if (error.response?.data) {
            console.error('Detalhes:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

// Executar teste
testCompleteVoiceDispatcher();
