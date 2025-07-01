# 🚀 AUTVISION QUICK START - DESENVOLVIMENTO ESTÁVEL
# Inicialização rápida com configuração limpa

Write-Host "🚀 AUTVISION QUICK START" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Yellow

# Verificar dependências
Write-Host "📦 Verificando dependências..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# Configuração atual
Write-Host ""
Write-Host "⚙️ CONFIGURAÇÃO ATUAL:" -ForegroundColor Cyan
Write-Host "- Frontend:     http://localhost:3002" -ForegroundColor White
Write-Host "- Backend:      http://localhost:3001 (se disponível)" -ForegroundColor White
Write-Host "- Mock Mode:    ATIVO (dados estáveis)" -ForegroundColor Green
Write-Host "- SyncContext:  OTIMIZADO (sem loops)" -ForegroundColor Green

# Iniciar frontend
Write-Host ""
Write-Host "🎨 Iniciando frontend..." -ForegroundColor Green
npm run dev

Write-Host ""
Write-Host "✨ PRONTO! Sistema funcionando com dados mock estáveis" -ForegroundColor Green
Write-Host "🔧 Para usar backend real, ajuste VITE_LLM_MOCK_MODE=false" -ForegroundColor Gray
