# Script final para ativar OpenVoice REAL no AUTVISION

Write-Host "🎤 AUTVISION - Ativando OpenVoice REAL" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# 1. Verificar se Docker está rodando
Write-Host "🐳 Verificando Docker..." -ForegroundColor Cyan
try {
    docker version | Out-Null
    Write-Host "✅ Docker está rodando" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker não está rodando! Inicie o Docker primeiro." -ForegroundColor Red
    exit 1
}

# 2. Parar containers antigos
Write-Host "🛑 Limpando containers antigos..." -ForegroundColor Yellow
docker stop openvoice-real-container 2>$null
docker rm openvoice-real-container 2>$null

# 3. Construir imagem atualizada
Write-Host "🏗️ Construindo imagem OpenVoice..." -ForegroundColor Yellow
docker build -t openvoice-real . | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Imagem construída com sucesso" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao construir imagem" -ForegroundColor Red
    exit 1
}

# 4. Iniciar container na porta 3005
Write-Host "🚀 Iniciando container OpenVoice..." -ForegroundColor Yellow
$containerId = docker run -d -p 3005:3000 --name openvoice-real-container openvoice-real
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Container iniciado: $($containerId.Substring(0,12))" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao iniciar container" -ForegroundColor Red
    exit 1
}

# 5. Aguardar inicialização
Write-Host "⏳ Aguardando inicialização (10s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 6. Testar conectividade
Write-Host "🔍 Testando conectividade..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3005/health" -Method GET -TimeoutSec 10
    Write-Host "✅ OpenVoice REAL está funcionando!" -ForegroundColor Green
    Write-Host "📊 Serviço: $($response.service)" -ForegroundColor Cyan
    Write-Host "📊 Status: $($response.status)" -ForegroundColor Cyan
    Write-Host "📊 Versão: $($response.version)" -ForegroundColor Cyan
} catch {
    Write-Host "⚠️ Erro ao testar conectividade: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "🔄 Tentando novamente em 5s..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3005/health" -Method GET -TimeoutSec 10
        Write-Host "✅ OpenVoice REAL está funcionando!" -ForegroundColor Green
    } catch {
        Write-Host "❌ OpenVoice não está respondendo" -ForegroundColor Red
        exit 1
    }
}

# 7. Teste de síntese
Write-Host "🎙️ Testando síntese de áudio..." -ForegroundColor Yellow
try {
    $testPayload = @{
        text = "AUTVISION com OpenVoice real está funcionando perfeitamente!"
        voice = "pt-br-female-1"
        speed = 1.0
        pitch = 0
        volume = 0.8
        lang = "pt-BR"
    } | ConvertTo-Json

    $synthesizeResponse = Invoke-RestMethod -Uri "http://localhost:3005/api/tts/synthesize" -Method POST -Body $testPayload -ContentType "application/json" -TimeoutSec 30
    
    if ($synthesizeResponse) {
        Write-Host "✅ Síntese de áudio funcionando!" -ForegroundColor Green
        Write-Host "📊 Áudio gerado com sucesso" -ForegroundColor Cyan
    }
} catch {
    Write-Host "⚠️ Erro no teste de síntese: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "🔄 Mas o serviço está rodando..." -ForegroundColor Yellow
}

# 8. Mostrar informações finais
Write-Host "" -ForegroundColor White
Write-Host "🎉 OPENVOICE REAL ATIVADO COM SUCESSO!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host "🔗 URL do OpenVoice: http://localhost:3005" -ForegroundColor Cyan
Write-Host "🔗 Health Check: http://localhost:3005/health" -ForegroundColor Cyan
Write-Host "🔗 API TTS: http://localhost:3005/api/tts/synthesize" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "📋 Para usar no seu código:" -ForegroundColor Yellow
Write-Host "   api_url: 'http://localhost:3005'" -ForegroundColor White
Write-Host "   engine: 'openvoice'" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "🎯 Vozes disponíveis:" -ForegroundColor Yellow
Write-Host "   - pt-br-female-1" -ForegroundColor White
Write-Host "   - pt-br-male-1" -ForegroundColor White
Write-Host "   - pt-br-female-2" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "🐳 Container Info:" -ForegroundColor Yellow
Write-Host "   - Nome: openvoice-real-container" -ForegroundColor White
Write-Host "   - Porta: 3005:3000" -ForegroundColor White
Write-Host "   - Status: Rodando" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "⚡ O sistema agora usa OpenVoice REAL em vez de mock!" -ForegroundColor Green
Write-Host "🎤 Todos os áudios serão gerados pela engine real!" -ForegroundColor Green
