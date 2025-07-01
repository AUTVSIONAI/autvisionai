# =====================================================
# 🧹 AUTVISION AI - LIMPEZA COMPLETA E SINCRONIZAÇÃO
# =====================================================

Write-Host "🧹 AUTVISION AI - LIMPEZA COMPLETA E SINCRONIZAÇÃO" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# VERIFICAR SE ESTÁ NO DIRETÓRIO CORRETO
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Execute este script no diretório do frontend (autvisionai-front)!" -ForegroundColor Red
    exit 1
}

# PARAR TODOS OS PROCESSOS NODE EXISTENTES
Write-Host "🛑 Parando processos Node.js existentes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# LIMPAR CACHE DO NPM E NODE_MODULES
Write-Host "🗑️ Limpando cache do Node.js..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
}
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue
}
npm cache clean --force

# GARANTIR QUE O .ENV.LOCAL ESTÁ CORRETO
Write-Host "⚙️ Configurando .env.local para dados reais..." -ForegroundColor Yellow

$envContent = @"
# ===== AUTVISION AI - CONFIGURAÇÃO FRONTEND =====
# Backend URL - SEMPRE LOCAL PRIMEIRO, depois produção
VITE_API_BASE_URL=http://localhost:3001

# ===== SUPABASE CONFIGURATION =====
VITE_SUPABASE_URL=https://woooqlznapzfhmjlyyll.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb29xbHpuYXB6Zmhtamx5eWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4OTYyNTUsImV4cCI6MjA2NTQ3MjI1NX0.Mdeir5LYY8IFzoEKl8hQoK9FW4WCM119MBeCKNTbHvY

# ===== API KEYS - DADOS REAIS =====
VITE_OPENROUTER_API_KEY=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
VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# ===== FEATURE FLAGS - DADOS REAIS =====
VITE_LLM_MOCK_MODE=false
VITE_USE_REAL_DATA=true
VITE_ENABLE_VOICE=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=true

# ===== APP CONFIGURATION =====
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
VITE_AUTH_TOKEN_KEY=autvision_token

# ===== FRONTEND SPECIFIC =====
VITE_FRONTEND_PORT=3003
VITE_BACKEND_PORT=3001
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host "✅ .env.local configurado" -ForegroundColor Green

# REINSTALAR DEPENDÊNCIAS
Write-Host "📦 Reinstalando dependências..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro na instalação das dependências!" -ForegroundColor Red
    exit 1
}

# VERIFICAR BACKEND
Write-Host "🔍 Verificando backend local..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/config/health" -Method GET -TimeoutSec 5 -Headers @{'x-api-key' = 'autvision_backend_secure_key_2025'} -ErrorAction Stop
    Write-Host "✅ Backend local está online na porta 3001" -ForegroundColor Green
    
    # TESTAR ENDPOINT DE AGENTES
    try {
        $agentsResponse = Invoke-RestMethod -Uri "http://localhost:3001/agents" -Method GET -TimeoutSec 5 -Headers @{'x-api-key' = 'autvision_backend_secure_key_2025'} -ErrorAction Stop
        Write-Host "✅ Endpoint /agents está funcionando" -ForegroundColor Green
        Write-Host "📊 Agentes encontrados: $($agentsResponse.Length)" -ForegroundColor Cyan
    } catch {
        Write-Host "⚠️ Endpoint /agents com problema: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Backend não está rodando na porta 3001!" -ForegroundColor Red
    Write-Host "📝 Para iniciar o backend:" -ForegroundColor Cyan
    Write-Host "   cd ..\autvisionai-backend" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "🔄 Prosseguindo com frontend..." -ForegroundColor Yellow
}
}

# VERIFICAR PORTAS DISPONÍVEIS
$frontendPort = 3003
if (Test-NetConnection -ComputerName localhost -Port $frontendPort -InformationLevel Quiet -ErrorAction SilentlyContinue) {
    Write-Host "⚠️ Porta $frontendPort está em uso, tentando próxima..." -ForegroundColor Yellow
    $frontendPort = 3004
}

Write-Host ""
Write-Host "🚀 CONFIGURAÇÃO FINAL:" -ForegroundColor Green
Write-Host "   ✅ Modo: DADOS REAIS" -ForegroundColor White
Write-Host "   ✅ Backend: http://localhost:3001" -ForegroundColor White
Write-Host "   ✅ Frontend: http://localhost:$frontendPort" -ForegroundColor White
Write-Host "   ✅ Supabase: Configurado" -ForegroundColor White
Write-Host "   ✅ OpenRouter: Configurado" -ForegroundColor White
Write-Host "   ✅ Mock Mode: DESABILITADO" -ForegroundColor White
Write-Host ""

Write-Host "🚀 Iniciando frontend limpo..." -ForegroundColor Green
npm run dev
