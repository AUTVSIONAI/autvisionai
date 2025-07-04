# Script final para ativar OpenVoice REAL no AUTVISION

Write-Host "AUTVISION - Ativando OpenVoice REAL" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# 1. Verificar se Docker está rodando
Write-Host "Verificando Docker..." -ForegroundColor Cyan
try {
    docker version | Out-Null
    Write-Host "Docker está rodando" -ForegroundColor Green
} catch {
    Write-Host "Docker não está rodando! Inicie o Docker primeiro." -ForegroundColor Red
    exit 1
}

# 2. Verificar se container já está rodando
Write-Host "Verificando container OpenVoice..." -ForegroundColor Cyan
$existingContainer = docker ps --filter "name=openvoice-real-container" --format "table {{.Names}}" | Select-String "openvoice-real-container"

if ($existingContainer) {
    Write-Host "Container já está rodando!" -ForegroundColor Green
} else {
    Write-Host "Container não está rodando, iniciando..." -ForegroundColor Yellow
    
    # Parar containers antigos
    docker stop openvoice-real-container 2>$null
    docker rm openvoice-real-container 2>$null
    
    # Iniciar container na porta 3005
    $containerId = docker run -d -p 3005:3000 --name openvoice-real-container openvoice-real
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Container iniciado: $($containerId.Substring(0,12))" -ForegroundColor Green
    } else {
        Write-Host "Erro ao iniciar container" -ForegroundColor Red
        exit 1
    }
    
    # Aguardar inicialização
    Write-Host "Aguardando inicialização (10s)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
}

# 3. Testar conectividade
Write-Host "Testando conectividade..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3005/health" -Method GET -TimeoutSec 10
    Write-Host "OpenVoice REAL está funcionando!" -ForegroundColor Green
    Write-Host "Serviço: $($response.service)" -ForegroundColor Cyan
    Write-Host "Status: $($response.status)" -ForegroundColor Cyan
    Write-Host "Versão: $($response.version)" -ForegroundColor Cyan
} catch {
    Write-Host "Erro ao testar conectividade: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 4. Mostrar informações finais
Write-Host "" -ForegroundColor White
Write-Host "OPENVOICE REAL ATIVADO COM SUCESSO!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host "URL do OpenVoice: http://localhost:3005" -ForegroundColor Cyan
Write-Host "Health Check: http://localhost:3005/health" -ForegroundColor Cyan
Write-Host "API TTS: http://localhost:3005/api/tts/synthesize" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "Para usar no seu código:" -ForegroundColor Yellow
Write-Host "   api_url: 'http://localhost:3005'" -ForegroundColor White
Write-Host "   engine: 'openvoice'" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "Vozes disponíveis:" -ForegroundColor Yellow
Write-Host "   - pt-br-female-1" -ForegroundColor White
Write-Host "   - pt-br-male-1" -ForegroundColor White
Write-Host "   - pt-br-female-2" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "Container Info:" -ForegroundColor Yellow
Write-Host "   - Nome: openvoice-real-container" -ForegroundColor White
Write-Host "   - Porta: 3005:3000" -ForegroundColor White
Write-Host "   - Status: Rodando" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "O sistema agora usa OpenVoice REAL em vez de mock!" -ForegroundColor Green
Write-Host "Todos os áudios serão gerados pela engine real!" -ForegroundColor Green
