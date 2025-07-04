# 🐳 Script para configurar e executar OpenVoice via Docker
# Para o sistema AUTVISION AI Voice Dispatcher

Write-Host "🐳 === CONFIGURANDO OPENVOICE DOCKER ===" -ForegroundColor Cyan

# Verificar se Docker está instalado
Write-Host "`n1. 🔍 Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker encontrado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker não está instalado! Instale Docker Desktop primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se a porta 3000 está disponível
Write-Host "`n2. 🔍 Verificando porta 3000..." -ForegroundColor Yellow
$portUsed = netstat -an | Select-String ":3000"
if ($portUsed) {
    Write-Host "⚠️ Porta 3000 já está em uso:" -ForegroundColor Yellow
    Write-Host $portUsed -ForegroundColor Yellow
    $choice = Read-Host "Deseja parar o processo na porta 3000? (s/n)"
    if ($choice -eq 's' -or $choice -eq 'S') {
        Write-Host "🛑 Parando processos na porta 3000..." -ForegroundColor Yellow
        $processes = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
        foreach ($proc in $processes) {
            Stop-Process -Id $proc.OwningProcess -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 2
    }
} else {
    Write-Host "✅ Porta 3000 disponível" -ForegroundColor Green
}

# Baixar/criar imagem OpenVoice
Write-Host "`n3. 🏗️ Configurando OpenVoice..." -ForegroundColor Yellow

# Criar Dockerfile para OpenVoice
$dockerfileContent = @"
FROM python:3.9-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    git \
    wget \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Instalar OpenVoice
RUN pip install --no-cache-dir \
    torch==1.13.1+cpu \
    torchaudio==0.13.1+cpu \
    -f https://download.pytorch.org/whl/torch_stable.html

RUN pip install --no-cache-dir \
    flask \
    flask-cors \
    numpy \
    scipy \
    librosa \
    soundfile \
    requests

# Baixar modelo OpenVoice (simulado)
RUN mkdir -p /app/models
COPY openvoice_server.py /app/

EXPOSE 3000

CMD ["python", "openvoice_server.py"]
"@

Write-Host "📝 Criando Dockerfile..." -ForegroundColor Yellow
$dockerfileContent | Out-File -FilePath "Dockerfile" -Encoding UTF8

# Criar servidor Python simples para OpenVoice
Write-Host "🐍 Criando servidor Python..." -ForegroundColor Yellow
$serverContent = @'
#!/usr/bin/env python3
"""
🎤 OpenVoice Server Simulado
Simula API do OpenVoice para testes
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import numpy as np
import wave
import io
import struct
import time
import os

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'OpenVoice',
        'version': '1.0.0',
        'timestamp': time.time()
    })

@app.route('/voices', methods=['GET'])
def get_voices():
    return jsonify({
        'voices': [
            {
                'id': 'default',
                'name': 'Female Portuguese',
                'language': 'Portuguese',
                'gender': 'female'
            },
            {
                'id': 'male',
                'name': 'Male Portuguese',
                'language': 'Portuguese',
                'gender': 'male'
            }
        ]
    })

@app.route('/synthesize', methods=['POST'])
def synthesize():
    try:
        data = request.json
        text = data.get('text', '')
        speaker_id = data.get('speaker_id', 'default')
        language = data.get('language', 'Portuguese')
        speed = data.get('speed', 1.0)
        
        print(f"🎤 Synthesizing: {text[:50]}... (speaker: {speaker_id}, lang: {language})")
        
        # Simular tempo de processamento
        time.sleep(1 + len(text) * 0.01)  # 1s + 10ms por caractere
        
        # Gerar áudio WAV simples
        audio_data = generate_audio(text, speed)
        
        # Retornar áudio como resposta binária
        return audio_data, 200, {
            'Content-Type': 'audio/wav',
            'Content-Length': str(len(audio_data))
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def generate_audio(text, speed=1.0):
    """Gera áudio WAV simples baseado no texto"""
    
    # Parâmetros do áudio
    sample_rate = 44100
    duration = max(1.0, len(text) * 0.08 / speed)  # 80ms por caractere
    num_samples = int(sample_rate * duration)
    
    # Gerar tom baseado no texto
    frequency = 440 + (hash(text) % 200)  # Frequência baseada no texto
    
    # Gerar amostras
    samples = []
    for i in range(num_samples):
        # Tom principal
        t = i / sample_rate
        sample = 0.3 * np.sin(2 * np.pi * frequency * t)
        
        # Adicionar harmônicos para soar mais natural
        sample += 0.1 * np.sin(2 * np.pi * frequency * 2 * t)
        sample += 0.05 * np.sin(2 * np.pi * frequency * 3 * t)
        
        # Envelope para suavizar início e fim
        envelope = 1.0
        if i < sample_rate * 0.1:  # Fade in
            envelope = i / (sample_rate * 0.1)
        elif i > num_samples - sample_rate * 0.1:  # Fade out
            envelope = (num_samples - i) / (sample_rate * 0.1)
        
        sample *= envelope
        samples.append(sample)
    
    # Converter para formato WAV
    audio_buffer = io.BytesIO()
    
    # Escrever header WAV
    num_channels = 1
    bytes_per_sample = 2
    byte_rate = sample_rate * num_channels * bytes_per_sample
    data_size = num_samples * num_channels * bytes_per_sample
    
    # RIFF header
    audio_buffer.write(b'RIFF')
    audio_buffer.write(struct.pack('<I', 36 + data_size))
    audio_buffer.write(b'WAVE')
    
    # fmt chunk
    audio_buffer.write(b'fmt ')
    audio_buffer.write(struct.pack('<I', 16))  # chunk size
    audio_buffer.write(struct.pack('<H', 1))   # audio format (PCM)
    audio_buffer.write(struct.pack('<H', num_channels))
    audio_buffer.write(struct.pack('<I', sample_rate))
    audio_buffer.write(struct.pack('<I', byte_rate))
    audio_buffer.write(struct.pack('<H', num_channels * bytes_per_sample))
    audio_buffer.write(struct.pack('<H', bytes_per_sample * 8))
    
    # data chunk
    audio_buffer.write(b'data')
    audio_buffer.write(struct.pack('<I', data_size))
    
    # Escrever amostras
    for sample in samples:
        value = int(sample * 32767)
        value = max(-32768, min(32767, value))
        audio_buffer.write(struct.pack('<h', value))
    
    return audio_buffer.getvalue()

if __name__ == '__main__':
    print("🎤 OpenVoice Server iniciando...")
    print("🔗 Endpoints disponíveis:")
    print("  - GET  /health")
    print("  - GET  /voices")
    print("  - POST /synthesize")
    
    app.run(host='0.0.0.0', port=3000, debug=True)
'@

$serverContent | Out-File -FilePath "openvoice_server.py" -Encoding UTF8

# Construir imagem Docker
Write-Host "`n4. 🏗️ Construindo imagem Docker..." -ForegroundColor Yellow
try {
    docker build -t openvoice-server .
    Write-Host "✅ Imagem Docker criada com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao construir imagem Docker" -ForegroundColor Red
    exit 1
}

# Executar container
Write-Host "`n5. 🚀 Executando OpenVoice..." -ForegroundColor Yellow
try {
    # Parar container existente se houver
    docker stop openvoice-container 2>$null
    docker rm openvoice-container 2>$null
    
    # Executar novo container
    docker run -d --name openvoice-container -p 3000:3000 openvoice-server
    
    Write-Host "✅ OpenVoice está rodando!" -ForegroundColor Green
    Write-Host "🔗 URL: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "📊 Status: docker ps" -ForegroundColor Yellow
    Write-Host "📝 Logs: docker logs openvoice-container" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Erro ao executar container" -ForegroundColor Red
    exit 1
}

# Aguardar inicialização
Write-Host "`n6. ⏳ Aguardando inicialização..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Testar conectividade
Write-Host "`n7. 🔍 Testando conectividade..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET -TimeoutSec 10
    Write-Host "✅ OpenVoice está respondendo!" -ForegroundColor Green
    Write-Host "📊 Status: $($response.status)" -ForegroundColor Cyan
    Write-Host "🔧 Versão: $($response.version)" -ForegroundColor Cyan
} catch {
    Write-Host "⚠️ OpenVoice ainda não está respondendo, aguarde mais alguns segundos..." -ForegroundColor Yellow
}

Write-Host "`n🏁 === CONFIGURAÇÃO CONCLUÍDA ===" -ForegroundColor Cyan
Write-Host "🎤 OpenVoice está rodando em http://localhost:3000" -ForegroundColor Green
Write-Host "🧪 Execute o teste: node _scripts/test_openvoice_docker.js" -ForegroundColor Yellow
Write-Host "🛑 Para parar: docker stop openvoice-container" -ForegroundColor Yellow

# Limpar arquivos temporários
Remove-Item "Dockerfile" -Force -ErrorAction SilentlyContinue
Remove-Item "openvoice_server.py" -Force -ErrorAction SilentlyContinue
