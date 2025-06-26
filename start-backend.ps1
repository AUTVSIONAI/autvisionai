# 🔥 SCRIPT DE INICIALIZAÇÃO BACKEND AUTVISION (PowerShell)
# Verifica se backend está rodando e inicia se necessário

Write-Host "🔥 Verificando status do backend AUTVISION..." -ForegroundColor Yellow

# Verificar se porta 3001 está sendo usada
$portCheck = netstat -an | Select-String ":3001.*LISTENING"

if (-not $portCheck) {
    Write-Host "❌ Backend não está rodando na porta 3001" -ForegroundColor Red
    Write-Host "🚀 Iniciando backend..." -ForegroundColor Green
    
    # Navegar para diretório do backend
    $backendPath = "..\autvisionai-backend"
    if (Test-Path $backendPath) {
        Set-Location $backendPath
        
        # Verificar se dependências estão instaladas
        if (-not (Test-Path "node_modules")) {
            Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Cyan
            npm install
        }
        
        # Verificar se arquivo .env existe
        if (-not (Test-Path ".env.server")) {
            Write-Host "⚠️ Arquivo .env.server não encontrado!" -ForegroundColor Yellow
            Write-Host "📋 Criando .env.server básico..." -ForegroundColor Cyan
            
            $envContent = @"
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
"@
            
            $envContent | Out-File -FilePath ".env.server" -Encoding UTF8
        }
        
        # Copiar para backend-autvision se existir
        if (Test-Path "backend-autvision") {
            Copy-Item ".env.server" "backend-autvision\.env.server" -Force
        }
        
        # Iniciar backend em background
        Write-Host "🚀 Executando npm run dev..." -ForegroundColor Green
        Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow
        
        # Aguardar alguns segundos para o backend iniciar
        Start-Sleep -Seconds 5
        
        # Verificar se iniciou com sucesso
        $newPortCheck = netstat -an | Select-String ":3001.*LISTENING"
        if (-not $newPortCheck) {
            Write-Host "❌ Falha ao iniciar backend. Tentando modo manual..." -ForegroundColor Red
            Write-Host "💡 Execute manualmente: cd ..\autvisionai-backend && npm run dev" -ForegroundColor Yellow
        } else {
            Write-Host "✅ Backend iniciado com sucesso!" -ForegroundColor Green
        }
        
        # Retornar ao diretório original
        Set-Location ..
        
    } else {
        Write-Host "❌ Diretório do backend não encontrado: $backendPath" -ForegroundColor Red
    }
    
} else {
    Write-Host "✅ Backend já está rodando na porta 3001" -ForegroundColor Green
}

Write-Host "🎯 Status final: Verificação de backend concluída!" -ForegroundColor Cyan
Write-Host "💡 Se o chat ainda não funcionar, use o modo mock (respostas simuladas)" -ForegroundColor Yellow
