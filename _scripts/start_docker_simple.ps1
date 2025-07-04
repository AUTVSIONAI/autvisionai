# Script simplificado para OpenVoice REAL
Write-Host "🐳 Iniciando OpenVoice REAL..." -ForegroundColor Cyan

# Parar containers existentes
Write-Host "🛑 Parando containers existentes..." -ForegroundColor Yellow
docker stop openvoice-container 2>$null
docker rm openvoice-container 2>$null

# Construir imagem
Write-Host "🏗️ Construindo imagem..." -ForegroundColor Yellow
docker build -t openvoice-real .

# Executar container
Write-Host "🚀 Iniciando container..." -ForegroundColor Yellow
docker run -d --name openvoice-container -p 3000:3000 openvoice-real

# Aguardar
Write-Host "⏳ Aguardando inicialização..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Testar
Write-Host "🔍 Testando conectividade..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET -TimeoutSec 10
    Write-Host "✅ OpenVoice REAL está funcionando!" -ForegroundColor Green
    Write-Host "📊 Status: $($response.service)" -ForegroundColor Cyan
} catch {
    Write-Host "⚠️ Ainda inicializando, aguarde mais alguns segundos..." -ForegroundColor Yellow
}

Write-Host "🎉 OpenVoice REAL configurado!" -ForegroundColor Green
Write-Host "🔗 URL: http://localhost:3000" -ForegroundColor Cyan
