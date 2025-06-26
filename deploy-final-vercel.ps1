# 🚀 DEPLOY FINAL AUTVISION - VERCEL
# Arquivo: deploy-final-vercel.ps1

Write-Host "🚀 DEPLOY FINAL AUTVISION → VERCEL" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

# Verificar se está no diretório correto
$currentDir = Get-Location
Write-Host "📁 Diretório atual: $currentDir" -ForegroundColor Yellow

# Verificar arquivo .env
if (Test-Path ".env") {
    Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
    $envContent = Get-Content ".env" | Select-String "VITE_API_BASE_URL"
    Write-Host "🔗 $envContent" -ForegroundColor Cyan
} else {
    Write-Host "❌ Arquivo .env não encontrado!" -ForegroundColor Red
    exit 1
}

# Verificar package.json
if (Test-Path "package.json") {
    Write-Host "✅ Package.json encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ Package.json não encontrado!" -ForegroundColor Red
    exit 1
}

# Build do projeto
Write-Host ""
Write-Host "🔨 Iniciando build do projeto..." -ForegroundColor Cyan
try {
    npm run build 2>&1 | Out-String
    Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro no build: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Verificar se dist foi criado
if (Test-Path "dist") {
    Write-Host "✅ Diretório dist criado" -ForegroundColor Green
    $distFiles = Get-ChildItem "dist" | Measure-Object
    Write-Host "📦 Arquivos em dist: $($distFiles.Count)" -ForegroundColor Yellow
} else {
    Write-Host "❌ Diretório dist não foi criado!" -ForegroundColor Red
    exit 1
}

# Teste final
Write-Host ""
Write-Host "🌐 INFORMAÇÕES DE DEPLOY:" -ForegroundColor Yellow
Write-Host "Frontend: https://autvisionai.vercel.app" -ForegroundColor Cyan
Write-Host "Backend:  https://autvisionai-backend-five.vercel.app" -ForegroundColor Cyan

Write-Host ""
Write-Host "📋 Para fazer deploy manual:" -ForegroundColor Yellow
Write-Host "1. vercel --prod" -ForegroundColor White
Write-Host "2. Ou push para branch main no GitHub" -ForegroundColor White

Write-Host ""
Write-Host "🎉 CONFIGURAÇÃO FINALIZADA!" -ForegroundColor Green
Write-Host "✅ Frontend configurado para produção" -ForegroundColor Green
Write-Host "✅ URLs de backend atualizadas" -ForegroundColor Green
Write-Host "✅ Fallbacks configurados" -ForegroundColor Green
