# 🚀 SCRIPT TESTE INTEGRAÇÃO VERCEL
Write-Host "🚀 TESTE INTEGRAÇÃO FRONTEND → BACKEND VERCEL" -ForegroundColor Green

$backendUrl = "https://autvisionai-backend-five.vercel.app"

Write-Host "📡 Testando status do backend..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$backendUrl/health" -Method Get -TimeoutSec 10
    Write-Host "✅ Backend online!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json)
} catch {
    Write-Host "❌ Backend offline: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🧠 Testando integração LLM..." -ForegroundColor Cyan
try {
    $headers = @{
        "Content-Type" = "application/json"
        "x-api-key" = "autvision_backend_secure_key_2025"
    }
    
    $body = @{
        prompt = "Teste de integração Vercel"
        systemPrompt = "Responda: OK"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$backendUrl/api/llm/invoke" -Method Post -Headers $headers -Body $body -TimeoutSec 15
    Write-Host "✅ LLM integração OK!" -ForegroundColor Green
} catch {
    Write-Host "❌ LLM erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 TESTE CONCLUÍDO!" -ForegroundColor Green
Write-Host "🌐 Frontend: https://autvisionai.vercel.app" -ForegroundColor Cyan
Write-Host "📡 Backend: $backendUrl" -ForegroundColor Cyan
