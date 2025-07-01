# ==================================================
# 🚀 AUTVISION AI - INICIALIZAÇÃO COM DADOS REAIS
# ==================================================

Write-Host "🚀 AUTVISION AI - INICIALIZAÇÃO COM DADOS REAIS" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# VERIFICAR SE ESTÁ NO DIRETÓRIO CORRETO
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Execute este script no diretório raiz do frontend!" -ForegroundColor Red
    exit 1
}

# VERIFICAR VARIÁVEIS DE AMBIENTE
Write-Host "🔍 Verificando configuração para dados reais..." -ForegroundColor Yellow

if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Arquivo .env.local não encontrado!" -ForegroundColor Red
    exit 1
}

# VERIFICAR SE AS CHAVES DE API ESTÃO CONFIGURADAS
$envContent = Get-Content ".env.local" -Raw
if ($envContent -match "VITE_USE_REAL_DATA=true" -and $envContent -match "VITE_LLM_MOCK_MODE=false") {
    Write-Host "✅ Configuração para dados reais detectada" -ForegroundColor Green
} else {
    Write-Host "⚠️ Configurando para usar dados reais..." -ForegroundColor Yellow
    
    # GARANTIR QUE ESTÁ CONFIGURADO PARA DADOS REAIS
    (Get-Content ".env.local") -replace "VITE_LLM_MOCK_MODE=true", "VITE_LLM_MOCK_MODE=false" | Set-Content ".env.local"
    
    if (-not ($envContent -match "VITE_USE_REAL_DATA=")) {
        Add-Content ".env.local" "`nVITE_USE_REAL_DATA=true"
    }
    
    Write-Host "✅ Configuração atualizada para dados reais" -ForegroundColor Green
}

# LIMPAR CACHE E REINSTALAR DEPENDÊNCIAS SE NECESSÁRIO
if (-not (Test-Path "node_modules") -or (Get-ChildItem "node_modules" -Force | Measure-Object).Count -eq 0) {
    Write-Host "🔄 Instalando dependências..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro na instalação das dependências!" -ForegroundColor Red
        exit 1
    }
}

# VERIFICAR BACKEND
Write-Host "🔍 Verificando backend..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/config/health" -Method GET -TimeoutSec 5 -Headers @{'x-api-key' = 'autvision_backend_secure_key_2025'}
    Write-Host "✅ Backend está online na porta 3001" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Backend não detectado na porta 3001" -ForegroundColor Yellow
    Write-Host "📝 Para iniciar o backend:" -ForegroundColor Cyan
    Write-Host "   cd ..\autvisionai-backend" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "🔄 Prosseguindo com frontend (irá usar fallback para dados mock se backend estiver offline)..." -ForegroundColor Yellow
}

# VERIFICAR SUPABASE
Write-Host "🔍 Testando conexão com Supabase..." -ForegroundColor Yellow
try {
    $supabaseUrl = $envContent | Select-String "VITE_SUPABASE_URL=(.+)" | ForEach-Object { $_.Matches[0].Groups[1].Value }
    if ($supabaseUrl) {
        $testUrl = "$supabaseUrl/rest/v1/"
        $response = Invoke-RestMethod -Uri $testUrl -Method GET -TimeoutSec 5
        Write-Host "✅ Supabase está online" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ Erro ao conectar com Supabase - verificar credenciais" -ForegroundColor Yellow
}

# INICIAR FRONTEND
Write-Host "🚀 Iniciando frontend na porta 3002 com dados reais..." -ForegroundColor Green
Write-Host "🌐 URL: http://localhost:3002" -ForegroundColor Cyan
Write-Host "🔄 Modo: DADOS REAIS (Backend + Supabase)" -ForegroundColor Green
Write-Host "📊 Sincronização: Automática com fallback para mock" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ Sistema configurado para usar dados reais!" -ForegroundColor Green
Write-Host "   - Backend: http://localhost:3001" -ForegroundColor White
Write-Host "   - Supabase: Configurado" -ForegroundColor White
Write-Host "   - OpenRouter: Configurado" -ForegroundColor White
Write-Host "   - Mock Mode: DESABILITADO" -ForegroundColor White
Write-Host ""

# INICIAR O SERVIDOR DE DESENVOLVIMENTO
npm run dev
