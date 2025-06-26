# 🚀 SCRIPT PARA CORRIGIR DEPLOY NA VERCEL
# Este script força um novo deploy na Vercel

Write-Host "🧹 LIMPANDO AMBIENTE PARA NOVO DEPLOY..." -ForegroundColor Yellow

# 1. Limpar cache de build
Write-Host "🗑️ Removendo arquivos de cache..." -ForegroundColor Cyan
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
if (Test-Path "node_modules/.vite") { Remove-Item -Recurse -Force "node_modules/.vite" }

# 2. Fazer um novo build limpo
Write-Host "🔨 Fazendo build limpo..." -ForegroundColor Cyan
npm run build

# 3. Verificar se build foi bem-sucedido
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build realizado com sucesso!" -ForegroundColor Green
    
    # 4. Criar um commit vazio para forçar novo deploy
    Write-Host "📝 Criando commit para forçar deploy..." -ForegroundColor Cyan
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git add .
    git commit -m "🚀 Force redeploy - $timestamp" --allow-empty
    
    # 5. Push para o GitHub
    Write-Host "📤 Fazendo push para GitHub..." -ForegroundColor Cyan
    git push origin master
    
    Write-Host "🎉 DEPLOY FORÇADO COM SUCESSO!" -ForegroundColor Green
    Write-Host "⏰ A Vercel deve detectar as mudanças em alguns minutos." -ForegroundColor Yellow
    Write-Host "🔗 Verifique o deploy em: https://vercel.com/dashboard" -ForegroundColor Blue
} else {
    Write-Host "❌ ERRO NO BUILD! Verifique os erros acima." -ForegroundColor Red
    exit 1
}
