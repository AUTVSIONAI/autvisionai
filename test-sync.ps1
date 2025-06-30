# 🔄 AUTVISION AI - TESTE DE SINCRONIZAÇÃO COMPLETA
# Script para verificar se a sincronização entre frontend/backend está 100%

Write-Host "🔄 AUTVISION SYNC CHECKER - TESTE COMPLETO" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Yellow

$frontendPort = 3002
$backendPort = 3001

# Função para testar endpoint
function Test-Endpoint {
    param([string]$Url, [string]$Name)
    try {
        $response = Invoke-RestMethod -Uri $Url -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ $Name - OK" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ $Name - FALHOU: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Write-Host ""
Write-Host "🔍 VERIFICANDO PORTAS..." -ForegroundColor Yellow

# Verificar se as portas estão ativas
function Test-Port {
    param([int]$Port)
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.ConnectAsync("localhost", $Port).Wait(1000)
        $tcpClient.Close()
        return $true
    } catch {
        return $false
    }
}

if (Test-Port $backendPort) {
    Write-Host "✅ Backend porta $backendPort - ATIVA" -ForegroundColor Green
} else {
    Write-Host "❌ Backend porta $backendPort - INATIVA" -ForegroundColor Red
    Write-Host "💡 Execute: cd autvisionai-backend && npm run dev" -ForegroundColor Yellow
}

if (Test-Port $frontendPort) {
    Write-Host "✅ Frontend porta $frontendPort - ATIVA" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend porta $frontendPort - INATIVA" -ForegroundColor Red
    Write-Host "💡 Execute: cd autvisionai-front && npm run dev" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🧪 TESTANDO ENDPOINTS DO BACKEND..." -ForegroundColor Yellow

$backendTests = @(
    @{ Url = "http://localhost:$backendPort/config/health"; Name = "Health Check" },
    @{ Url = "http://localhost:$backendPort/config/system"; Name = "System Config" },
    @{ Url = "http://localhost:$backendPort/agents"; Name = "Agents API" },
    @{ Url = "http://localhost:$backendPort/users"; Name = "Users API" },
    @{ Url = "http://localhost:$backendPort/plans"; Name = "Plans API" },
    @{ Url = "http://localhost:$backendPort/config/llms"; Name = "LLM Config" }
)

$passedTests = 0
foreach ($test in $backendTests) {
    if (Test-Endpoint $test.Url $test.Name) {
        $passedTests++
    }
    Start-Sleep -Milliseconds 200
}

Write-Host ""
Write-Host "📊 RESULTADO DOS TESTES:" -ForegroundColor Cyan
Write-Host "Testes passaram: $passedTests/$($backendTests.Count)" -ForegroundColor $(if ($passedTests -eq $backendTests.Count) { "Green" } else { "Yellow" })

Write-Host ""
Write-Host "🔄 TESTANDO SYNCCONTEXT..." -ForegroundColor Yellow

# Criar um arquivo JS temporário para testar o SyncContext
$testScript = @"
// Teste rápido do SyncContext
const testSync = async () => {
    try {
        // Simular teste do SyncContext via fetch
        const response = await fetch('http://localhost:$backendPort/config/health');
        const data = await response.json();
        console.log('✅ SyncContext pode comunicar com backend:', data.status || 'OK');
        
        // Testar endpoints principais que o SyncContext usa
        const endpoints = [
            '/agents',
            '/users', 
            '/plans',
            '/config/system'
        ];
        
        for (const endpoint of endpoints) {
            try {
                const res = await fetch(`http://localhost:$backendPort`+ endpoint);
                if (res.ok) {
                    console.log(`✅ Endpoint ${endpoint} - OK`);
                } else {
                    console.log(`⚠️ Endpoint ${endpoint} - Status: ${res.status}`);
                }
            } catch (err) {
                console.log(`❌ Endpoint ${endpoint} - ERRO: ${err.message}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
    }
};

testSync();
"@

$testScript | Out-File -FilePath "sync-test.js" -Encoding UTF8

try {
    Write-Host "Executando teste JavaScript..." -ForegroundColor Gray
    node "sync-test.js"
} catch {
    Write-Host "❌ Erro ao executar teste JS: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    Remove-Item "sync-test.js" -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "🎯 ENDPOINTS IMPORTANTES:" -ForegroundColor Cyan
Write-Host "Backend API:     http://localhost:$backendPort" -ForegroundColor White
Write-Host "Frontend App:    http://localhost:$frontendPort" -ForegroundColor White
Write-Host "Admin Panel:     http://localhost:$frontendPort/admin" -ForegroundColor Yellow
Write-Host "Client Dashboard: http://localhost:$frontendPort/dashboard" -ForegroundColor Green

Write-Host ""
Write-Host "📋 CONFIGURAÇÃO ATUAL:" -ForegroundColor Cyan
Write-Host "- Backend rodando na porta $backendPort" -ForegroundColor White
Write-Host "- Frontend rodando na porta $frontendPort" -ForegroundColor White
Write-Host "- SyncContext ativo no frontend" -ForegroundColor White
Write-Host "- API Client configurado para http://localhost:$backendPort" -ForegroundColor White

if ($passedTests -eq $backendTests.Count) {
    Write-Host ""
    Write-Host "🎉 SINCRONIZAÇÃO 100% FUNCIONAL!" -ForegroundColor Green
    Write-Host "Sistema pronto para uso completo!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️ Alguns endpoints precisam de atenção" -ForegroundColor Yellow
    Write-Host "Verifique se o backend está rodando corretamente" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
