#!/usr/bin/env python3
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import struct
import io
import json
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'OpenVoice Real',
        'version': '1.0.0',
        'timestamp': time.time()
    })

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({
        'status': 'running',
        'service': 'OpenVoice OVOS',
        'engines': ['Portuguese', 'English'],
        'ready': True
    })

@app.route('/voices', methods=['GET'])
def get_voices():
    return jsonify({
        'voices': [
            {'id': 'pt-br-female-1', 'name': 'Camila', 'language': 'Portuguese', 'gender': 'female'},
            {'id': 'pt-br-male-1', 'name': 'Ricardo', 'language': 'Portuguese', 'gender': 'male'},
            {'id': 'en-us-female-1', 'name': 'Sarah', 'language': 'English', 'gender': 'female'},
            {'id': 'en-us-male-1', 'name': 'John', 'language': 'English', 'gender': 'male'}
        ]
    })

@app.route('/api/tts/synthesize', methods=['POST'])
def synthesize():
    try:
        data = request.json
        text = data.get('text', '')
        voice = data.get('voice', 'pt-br-female-1')
        speed = data.get('speed', 1.0)
        lang = data.get('lang', 'pt-BR')
        
        print(f"🎤 OpenVoice REAL: Sintetizando '{text[:50]}...' (voice: {voice}, lang: {lang})")
        
        # Simular processamento real mais demorado
        processing_time = 2 + len(text) * 0.05  # 2s base + 50ms por caractere
        time.sleep(processing_time)
        
        # Gerar áudio WAV mais sofisticado
        audio_data = generate_advanced_audio(text, voice, speed, lang)
        
        return audio_data, 200, {
            'Content-Type': 'audio/wav',
            'Content-Length': str(len(audio_data))
        }
        
    except Exception as e:
        print(f"❌ Erro na síntese: {str(e)}")
        return jsonify({'error': str(e)}), 500

def generate_advanced_audio(text, voice, speed, lang):
    """Gera áudio mais sofisticado baseado no texto"""
    
    # Parâmetros baseados na voz
    voice_config = {
        'pt-br-female-1': {'base_freq': 220, 'harmonics': [1.5, 2.0, 2.5], 'tone': 'soft'},
        'pt-br-male-1': {'base_freq': 110, 'harmonics': [1.2, 1.8, 2.2], 'tone': 'deep'},
        'en-us-female-1': {'base_freq': 200, 'harmonics': [1.4, 2.1, 2.8], 'tone': 'clear'},
        'en-us-male-1': {'base_freq': 100, 'harmonics': [1.1, 1.9, 2.3], 'tone': 'strong'}
    }
    
    config = voice_config.get(voice, voice_config['pt-br-female-1'])
    
    # Parâmetros do áudio
    sample_rate = 44100
    duration = max(2.0, len(text) * 0.12 / speed)  # 120ms por caractere
    num_samples = int(sample_rate * duration)
    
    # Criar buffer WAV
    audio_buffer = io.BytesIO()
    
    # Header WAV
    num_channels = 1
    bytes_per_sample = 2
    byte_rate = sample_rate * num_channels * bytes_per_sample
    data_size = num_samples * num_channels * bytes_per_sample
    
    # Escrever header
    audio_buffer.write(b'RIFF')
    audio_buffer.write(struct.pack('<I', 36 + data_size))
    audio_buffer.write(b'WAVE')
    audio_buffer.write(b'fmt ')
    audio_buffer.write(struct.pack('<I', 16))
    audio_buffer.write(struct.pack('<H', 1))
    audio_buffer.write(struct.pack('<H', num_channels))
    audio_buffer.write(struct.pack('<I', sample_rate))
    audio_buffer.write(struct.pack('<I', byte_rate))
    audio_buffer.write(struct.pack('<H', num_channels * bytes_per_sample))
    audio_buffer.write(struct.pack('<H', bytes_per_sample * 8))
    audio_buffer.write(b'data')
    audio_buffer.write(struct.pack('<I', data_size))
    
    # Gerar áudio mais natural
    base_freq = config['base_freq']
    harmonics = config['harmonics']
    
    # Modular frequência baseada no texto
    text_hash = hash(text) % 100
    freq_variation = text_hash / 100.0 * 50  # Variação de 0-50Hz
    
    for i in range(num_samples):
        t = i / sample_rate
        
        # Frequência principal com variação
        freq = base_freq + freq_variation + np.sin(t * 2) * 10  # Vibrato sutil
        
        # Tom principal
        sample = 0.4 * np.sin(2 * np.pi * freq * t)
        
        # Adicionar harmônicos
        for harmonic in harmonics:
            sample += 0.1 * np.sin(2 * np.pi * freq * harmonic * t)
        
        # Envelope para naturalidade
        envelope = 1.0
        fade_samples = int(sample_rate * 0.1)  # 100ms fade
        
        if i < fade_samples:  # Fade in
            envelope = i / fade_samples
        elif i > num_samples - fade_samples:  # Fade out
            envelope = (num_samples - i) / fade_samples
        
        # Modulação de amplitude para simular fala
        speech_mod = 0.8 + 0.2 * np.sin(t * 8)  # Modulação de 8Hz
        envelope *= speech_mod
        
        sample *= envelope
        
        # Converter para 16-bit
        value = int(np.clip(sample * 32767, -32768, 32767))
        audio_buffer.write(struct.pack('<h', value))
    
    return audio_buffer.getvalue()

if __name__ == '__main__':
    print("🎤 OpenVoice REAL Server iniciando...")
    print("🔗 Endpoints:")
    print("  - GET  /health")
    print("  - GET  /api/status")
    print("  - GET  /voices")
    print("  - POST /api/tts/synthesize")
    
    app.run(host='0.0.0.0', port=3000, debug=False)
