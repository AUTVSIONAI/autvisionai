#!/bin/bash
# Script para rodar OpenVoice REAL

echo "🎙️ Configurando OpenVoice Real..."

# 1. Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando!"
    echo "   Inicie o Docker Desktop primeiro"
    exit 1
fi

# 2. Verificar se porta 3000 está livre
if netstat -an | grep :3000 > /dev/null; then
    echo "⚠️ Porta 3000 ocupada, usando 3002"
    export OPENVOICE_PORT=3002
else
    echo "✅ Porta 3000 disponível"
    export OPENVOICE_PORT=3000
fi

# 3. Clonar OpenVoice se não existir
if [ ! -d "OpenVoice" ]; then
    echo "📥 Clonando OpenVoice..."
    git clone https://github.com/myshell-ai/OpenVoice.git
    cd OpenVoice
else
    echo "📁 OpenVoice já existe"
    cd OpenVoice
fi

# 4. Configurar docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'
services:
  openvoice:
    build: .
    ports:
      - "${OPENVOICE_PORT}:8000"
    environment:
      - PYTHONPATH=/app
    volumes:
      - ./models:/app/models
      - ./checkpoints:/app/checkpoints
    command: python -m uvicorn main:app --host 0.0.0.0 --port 8000
EOF

# 5. Subir o container
echo "🚀 Iniciando OpenVoice..."
docker-compose up --build -d

# 6. Aguardar inicialização
echo "⏳ Aguardando OpenVoice inicializar..."
sleep 30

# 7. Testar se está funcionando
echo "🔍 Testando OpenVoice..."
if curl -s "http://localhost:${OPENVOICE_PORT}/health" > /dev/null; then
    echo "✅ OpenVoice está rodando em http://localhost:${OPENVOICE_PORT}"
    
    # 8. Atualizar banco de dados
    echo "📝 Atualizando configuração no banco..."
    # Aqui você pode adicionar comando SQL para atualizar a URL
    
else
    echo "❌ OpenVoice não respondeu"
    echo "📋 Logs:"
    docker-compose logs
fi

echo "🎉 Setup concluído!"
