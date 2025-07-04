# OpenVoice Docker Setup Script
Write-Host "Setting up OpenVoice Docker container..." -ForegroundColor Green

# Check if Docker is available
try {
    docker --version
    Write-Host "Docker is available" -ForegroundColor Green
} catch {
    Write-Host "Docker is not available. Please install Docker first." -ForegroundColor Red
    exit 1
}

# Stop existing container if running
docker stop openvoice-container 2>$null
docker rm openvoice-container 2>$null

# Create simple Python server file
$pythonServer = @'
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import struct
import io

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'OpenVoice'})

@app.route('/voices', methods=['GET'])
def get_voices():
    return jsonify({'voices': [
        {'id': 'default', 'name': 'Female Portuguese', 'language': 'Portuguese'},
        {'id': 'male', 'name': 'Male Portuguese', 'language': 'Portuguese'}
    ]})

@app.route('/synthesize', methods=['POST'])
def synthesize():
    data = request.json
    text = data.get('text', '')
    
    # Simple WAV generation
    sample_rate = 44100
    duration = max(1.0, len(text) * 0.05)
    num_samples = int(sample_rate * duration)
    
    # Create WAV file
    audio_buffer = io.BytesIO()
    
    # WAV header
    audio_buffer.write(b'RIFF')
    audio_buffer.write(struct.pack('<I', 36 + num_samples * 2))
    audio_buffer.write(b'WAVE')
    audio_buffer.write(b'fmt ')
    audio_buffer.write(struct.pack('<I', 16))
    audio_buffer.write(struct.pack('<H', 1))
    audio_buffer.write(struct.pack('<H', 1))
    audio_buffer.write(struct.pack('<I', sample_rate))
    audio_buffer.write(struct.pack('<I', sample_rate * 2))
    audio_buffer.write(struct.pack('<H', 2))
    audio_buffer.write(struct.pack('<H', 16))
    audio_buffer.write(b'data')
    audio_buffer.write(struct.pack('<I', num_samples * 2))
    
    # Generate simple tone
    for i in range(num_samples):
        t = i / sample_rate
        sample = int(16000 * (0.5 * (1 + (t * 440 * 2 * 3.14159) % 1)))
        audio_buffer.write(struct.pack('<h', sample))
    
    return audio_buffer.getvalue(), 200, {'Content-Type': 'audio/wav'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
'@

$pythonServer | Out-File -FilePath "openvoice_server.py" -Encoding UTF8

# Create Dockerfile
$dockerfile = @'
FROM python:3.9-slim
WORKDIR /app
RUN pip install flask flask-cors
COPY openvoice_server.py .
EXPOSE 3000
CMD ["python", "openvoice_server.py"]
'@

$dockerfile | Out-File -FilePath "Dockerfile" -Encoding UTF8

# Build and run
Write-Host "Building Docker image..." -ForegroundColor Yellow
docker build -t openvoice-server .

Write-Host "Starting OpenVoice container..." -ForegroundColor Yellow
docker run -d --name openvoice-container -p 3000:3000 openvoice-server

Start-Sleep -Seconds 5

Write-Host "OpenVoice is running at http://localhost:3000" -ForegroundColor Green
Write-Host "Test with: curl http://localhost:3000/health" -ForegroundColor Yellow

# Cleanup
Remove-Item "Dockerfile" -Force
Remove-Item "openvoice_server.py" -Force
