# ===== AUTVISION AI - SCRIPT DE INICIALIZAÇÃO COMPLETA =====
# Script PowerShell para iniciar todo o ecosistema AutVision

Write-Host "🚀 INICIANDO AUTVISION AI - ECOSISTEMA COMPLETO" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan

# Verificar se Node.js está instalado
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não encontrado! Instale o Node.js primeiro." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js encontrado: $(node -v)" -ForegroundColor Green

# Função para verificar se uma porta está em uso
function Test-Port {
    param($Port)
    $result = netstat -an | Select-String ":$Port "
    return $result -ne $null
}

# Verificar portas
Write-Host "`n🔍 Verificando portas..." -ForegroundColor Yellow

if (Test-Port 3001) {
    Write-Host "⚠️  Porta 3001 (Backend) já está em uso" -ForegroundColor Yellow
} else {
    Write-Host "✅ Porta 3001 (Backend) disponível" -ForegroundColor Green
}

if (Test-Port 3002) {
    Write-Host "⚠️  Porta 3002 (Frontend) já está em uso" -ForegroundColor Yellow
} else {
    Write-Host "✅ Porta 3002 (Frontend) disponível" -ForegroundColor Green
}

# Instalar dependências se necessário
Write-Host "`n📦 Verificando dependências..." -ForegroundColor Yellow

# Backend
Set-Location "autvisionai-backend"
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Instalando dependências do Backend..." -ForegroundColor Yellow
    npm install
}
Set-Location ".."

# Frontend
Set-Location "autvisionai-front"
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Instalando dependências do Frontend..." -ForegroundColor Yellow
    npm install
}
Set-Location ".."

Write-Host "`n🎯 Iniciando serviços..." -ForegroundColor Cyan

# Função para iniciar em nova janela do PowerShell
function Start-Service {
    param($Name, $Path, $Command, $Color)
    
    Write-Host "🔄 Iniciando $Name..." -ForegroundColor $Color
    
    $scriptBlock = @"
`$Host.UI.RawUI.WindowTitle = "AutVision - $Name"
Write-Host "🚀 $Name iniciando..." -ForegroundColor $Color
Set-Location "$Path"
$Command
"@
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $scriptBlock
    Start-Sleep 2
}

# Iniciar Backend (Porta 3001)
Start-Service "Backend API" "autvisionai-backend" "npm run dev" "Blue"

# Aguardar backend inicializar
Write-Host "⏳ Aguardando Backend inicializar..." -ForegroundColor Yellow
Start-Sleep 5

# Iniciar Frontend (Porta 3002)
Start-Service "Frontend React" "autvisionai-front" "npm run dev" "Magenta"

# Aguardar frontend inicializar
Start-Sleep 3

Write-Host "`n✨ AUTVISION AI INICIADO COM SUCESSO!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "🔗 Backend API: http://localhost:3001" -ForegroundColor Blue
Write-Host "🎨 Frontend App: http://localhost:3002" -ForegroundColor Magenta
Write-Host "📊 Health Check: http://localhost:3001/config/health" -ForegroundColor Yellow
Write-Host "`n🎯 Acesse http://localhost:3002 para começar!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan

# Manter o script ativo para monitoramento
Write-Host "`n📊 Monitoramento ativo... Pressione Ctrl+C para parar" -ForegroundColor Yellow

try {
    while ($true) {
        Start-Sleep 10
        $backendStatus = if (Test-Port 3001) { "🟢 Online" } else { "🔴 Offline" }
        $frontendStatus = if (Test-Port 3002) { "🟢 Online" } else { "🔴 Offline" }
        
        $timestamp = Get-Date -Format "HH:mm:ss"
        Write-Host "[$timestamp] Backend: $backendStatus | Frontend: $frontendStatus" -ForegroundColor Gray
    }
} catch {
    Write-Host "`n👋 Encerrando monitoramento..." -ForegroundColor Yellow
}
