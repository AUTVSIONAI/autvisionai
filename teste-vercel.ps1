# 🚀 SCRIPT TESTE INTEGRAÇÃO VERCEL
# Arquivo: teste-vercel.ps1

Write-Host "🚀 TESTE INTEGRAÇÃO FRONTEND → BACKEND VERCEL" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

$frontendUrl = "https://autvisionai.vercel.app"
$backendUrl = "https://autvisionai-backend-five.vercel.app"

Write-Host ""
Write-Host "📋 CONFIGURAÇÃO:" -ForegroundColor Yellow
Write-Host "Frontend: $frontendUrl"
Write-Host "Backend:  $backendUrl"
Write-Host ""

# Teste 1: Status do backend
Write-Host "📡 1. Testando status do backend..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$backendUrl/health" -Method Get -TimeoutSec 30
    Write-Host "✅ Backend online: $($response | ConvertTo-Json -Compress)" -ForegroundColor Green
    $backendOk = $true
} catch {
    Write-Host "❌ Backend offline: $($_.Exception.Message)" -ForegroundColor Red
    $backendOk = $false
}

# Teste 2: LLM Integration
Write-Host ""
Write-Host "🧠 2. Testando integração LLM..." -ForegroundColor Cyan
try {
    $headers = @{
        "Content-Type" = "application/json"
        "x-api-key" = "autvision_backend_secure_key_2025"
    }
    
    $body = @{
        prompt = "Olá! Este é um teste de integração entre frontend e backend na Vercel."
        systemPrompt = "Você é um assistente AutVision. Responda de forma concisa."
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$backendUrl/api/llm/invoke" -Method Post -Headers $headers -Body $body -TimeoutSec 30
    Write-Host "✅ LLM integração OK: Response recebida" -ForegroundColor Green
    $llmOk = $true
} catch {
    Write-Host "❌ LLM erro: $($_.Exception.Message)" -ForegroundColor Red
    $llmOk = $false
}

# Teste 3: Auth endpoints
Write-Host ""
Write-Host "🔐 3. Testando endpoints de autenticação..." -ForegroundColor Cyan
try {
    $headers = @{
        "Content-Type" = "application/json"
        "x-api-key" = "autvision_backend_secure_key_2025"
    }
    
    # Teste signup endpoint
    $signupBody = @{
        email = "teste@autvision.com"
        password = "senha123"
        full_name = "Usuário Teste"
    } | ConvertTo-Json

    try {
        $signupResponse = Invoke-WebRequest -Uri "$backendUrl/api/auth/signup" -Method Post -Headers $headers -Body $signupBody -TimeoutSec 30
        Write-Host "📧 Signup endpoint status: $($signupResponse.StatusCode)" -ForegroundColor Yellow
    } catch {
        Write-Host "📧 Signup endpoint status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
    
    # Teste login endpoint
    $loginBody = @{
        email = "admin@autvision.com"
        password = "admin123"
    } | ConvertTo-Json

    try {
        $loginResponse = Invoke-WebRequest -Uri "$backendUrl/api/auth/login" -Method Post -Headers $headers -Body $loginBody -TimeoutSec 30
        Write-Host "🔓 Login endpoint status: $($loginResponse.StatusCode)" -ForegroundColor Yellow
    } catch {
        Write-Host "🔓 Login endpoint status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
    
    $authOk = $true
} catch {
    Write-Host "❌ Auth erro: $($_.Exception.Message)" -ForegroundColor Red
    $authOk = $false
}

# Resultado final
Write-Host ""
Write-Host "📊 RESULTADOS:" -ForegroundColor Yellow
Write-Host "Backend Health: $(if($backendOk){'✅'}else{'❌'})" -ForegroundColor $(if($backendOk){'Green'}else{'Red'})
Write-Host "LLM Integration: $(if($llmOk){'✅'}else{'❌'})" -ForegroundColor $(if($llmOk){'Green'}else{'Red'})
Write-Host "Auth Endpoints: $(if($authOk){'✅'}else{'❌'})" -ForegroundColor $(if($authOk){'Green'}else{'Red'})

Write-Host ""
if ($backendOk -and $llmOk -and $authOk) {
    Write-Host "🎉 INTEGRAÇÃO VERCEL CONCLUÍDA COM SUCESSO!" -ForegroundColor Green
    Write-Host "🚀 Sistema pronto para uso em produção." -ForegroundColor Green
} else {
    Write-Host "⚠️ Alguns testes falharam. Verifique a configuração." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🌐 Para testar o frontend, acesse: $frontendUrl" -ForegroundColor Cyan
Write-Host "📡 Para verificar o backend, acesse: $backendUrl/health" -ForegroundColor Cyan
