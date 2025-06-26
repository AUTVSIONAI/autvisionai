#!/bin/bash

# 🔥 SCRIPT DE INICIALIZAÇÃO BACKEND AUTVISION
# Verifica se backend está rodando e inicia se necessário

echo "🔥 Verificando status do backend AUTVISION..."

# Verificar se porta 3001 está em uso
PORT_CHECK=$(netstat -an | grep ":3001")

if [ -z "$PORT_CHECK" ]; then
    echo "❌ Backend não está rodando na porta 3001"
    echo "🚀 Iniciando backend..."
    
    # Navegar para diretório do backend
    cd ../autvisionai-backend
    
    # Verificar se dependências estão instaladas
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependências do backend..."
        npm install
    fi
    
    # Verificar se arquivo .env existe
    if [ ! -f ".env.server" ]; then
        echo "⚠️ Arquivo .env.server não encontrado!"
        echo "📋 Criando .env.server básico..."
        
        cat > .env.server << 'EOF'
# AUTVISION Backend Configuration
PORT=3001
NODE_ENV=development
API_KEY=autvision_backend_secure_key_2025

# Supabase (credenciais do projeto)
SUPABASE_URL=https://woooqlznapzfhmjlyyll.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTYyNTUsImV4cCI6MjA2NTQ3MjI1NX0.Mdeir5LYY8IFzoEKl8hQoK9FW4WCM119MBeCKNTbHvY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9zZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg5NjI1NSwiZXhwIjoyMDY1NDcyMjU1fQ.GvhV1UKmG47sm5CEdHB9UD-GUqSORmskTZBVGDxhuRw

# OpenRouter LLMs - Chaves para desenvolvimento
OPENROUTER_API_KEY=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
EOF
    fi
    
    # Iniciar backend
    echo "🚀 Executando npm run dev..."
    npm run dev &
    
    # Aguardar alguns segundos para o backend iniciar
    sleep 5
    
    # Verificar se iniciou com sucesso
    NEW_PORT_CHECK=$(netstat -an | grep ":3001")
    if [ -z "$NEW_PORT_CHECK" ]; then
        echo "❌ Falha ao iniciar backend"
        exit 1
    else
        echo "✅ Backend iniciado com sucesso!"
    fi
    
else
    echo "✅ Backend já está rodando na porta 3001"
fi

echo "🎯 Status final: Backend AUTVISION operacional!"
