# 🧹 SCRIPT DE LIMPEZA PARA DEPLOY SEGURO - AUTVISION

## ⚠️ CRÍTICO: DADOS SENSÍVEIS ENCONTRADOS

**ANTES DE SUBIR PARA O GITHUB, EXECUTE ESTA LIMPEZA!**

### 🔥 ARQUIVOS COM CHAVES REAIS QUE DEVEM SER REMOVIDOS/ALTERADOS:

1. **Backend (.env)**
   - ❌ `backend-repo/.env` - **DELETAR ANTES DO COMMIT**
   - ✅ Manter apenas `backend-repo/.env.example`

2. **Frontend (.env.production)**
   - ❌ `autvisionai-front/.env.production` - **DELETAR ANTES DO COMMIT** 
   - ✅ Manter apenas `.env.example`

3. **Scripts com chaves hardcoded:**
   - ❌ `_scripts/test_voice_dispatcher.js`
   - ❌ `_scripts/test_complete_voice_dispatcher.js`
   - ❌ `_scripts/apply-vision-learning.js`
   - ❌ `_scripts/SETUP_VISION_LEARNING*.ps1`
   - ❌ `_scripts/clean-and-start.ps1`

4. **Arquivos de arquivo:**
   - ❌ `_archive/backend.env`
   - ❌ Todo conteúdo da pasta `_archive/`

### 🛡️ CHAVES ENCONTRADAS QUE DEVEM SER REMOVIDAS:

```
🔐 SUPABASE KEYS:
- eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...

🔐 OPENROUTER API KEYS:
- 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
- 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
- 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

🔐 TOGETHER AI KEY:
- c1c38df528497918be9fc1654ea6fbce5ec131480a7cb89cdb8f9263eba58fb0

🔐 API KEYS INTERNAS:
- autvision_backend_secure_key_2025
```

### 📋 AÇÕES NECESSÁRIAS ANTES DO DEPLOY:

#### **1. Backend Repository (autvisionai-backend)**
```bash
# Remover arquivo .env
rm backend-repo/.env

# Criar .gitignore se não existir
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore  
echo ".env.development" >> .gitignore
echo ".env.production" >> .gitignore
echo "node_modules/" >> .gitignore

# Verificar se .env.example está limpo
```

#### **2. Frontend Repository (autvisionai)**
```bash
# Remover arquivos sensíveis
rm autvisionai-front/.env.production

# Limpar _archive (dados sensíveis)
rm -rf _archive/

# Limpar scripts com chaves
# Substituir chaves por placeholders nos scripts
```

#### **3. Criar .env.example limpos**

**Backend (.env.example):**
```bash
# AUTVISION Backend Configuration
PORT=3001
NODE_ENV=development
API_KEY=your_secure_api_key_here

# Supabase
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenRouter LLMs
OPENROUTER_API_KEY=sk-or-v1-your_openrouter_key_here
LLM_DEEPSEEK_R1_KEY=sk-or-v1-your_openrouter_key_here
LLM_MISTRAL_SMALL_KEY=sk-or-v1-your_openrouter_key_here
LLM_KIMI_DEV_KEY=sk-or-v1-your_openrouter_key_here

# Together AI
TOGETHER_API_KEY=your_together_ai_key_here
```

**Frontend (.env.example):**
```bash
# Frontend Configuration
VITE_API_BASE_URL=http://localhost:3001

# Supabase
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Environment
VITE_ENVIRONMENT=development
```

### 🚀 COMANDOS DE LIMPEZA AUTOMÁTICA:

```powershell
# Execute antes do commit:
cd c:\autvisionai-front

# Remover arquivos sensíveis
Remove-Item -Path "backend-repo\.env" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "autvisionai-front\.env.production" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "_archive" -Recurse -Force -ErrorAction SilentlyContinue

# Criar .gitignore se necessário
".env" | Out-File -FilePath "backend-repo\.gitignore" -Append
".env.*" | Out-File -FilePath "backend-repo\.gitignore" -Append
"node_modules/" | Out-File -FilePath "backend-repo\.gitignore" -Append

".env" | Out-File -FilePath "autvisionai-front\.gitignore" -Append  
".env.*" | Out-File -FilePath "autvisionai-front\.gitignore" -Append
"node_modules/" | Out-File -FilePath "autvisionai-front\.gitignore" -Append
```

### ✅ CHECKLIST PRÉ-DEPLOY:

- [ ] `.env` removido do backend
- [ ] `.env.production` removido do frontend  
- [ ] `_archive/` removido completamente
- [ ] Scripts com chaves hardcoded limpos
- [ ] `.gitignore` configurado corretamente
- [ ] `.env.example` criados com placeholders
- [ ] Testar se aplicação ainda funciona após limpeza

### 🎯 REPOSITÓRIOS LIMPOS PRONTOS:

**Frontend:** `https://github.com/AUTVSIONAI/autvisionai`
**Backend:** `https://github.com/AUTVSIONAI/autvisionai-backend`

**⚠️ NUNCA COMMIT CHAVES REAIS NO GITHUB PÚBLICO!**
