# 🔐 CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE NA VERCEL

## ⚠️ IMPORTANTE - SEGURANÇA CRÍTICA
**NUNCA** adicione chaves sensíveis diretamente no código ou arquivos de configuração. Sempre use o Dashboard da Vercel.

## 📋 ETAPAS DE CONFIGURAÇÃO

### 1. Acesse o Dashboard da Vercel
- Vá para: https://vercel.com/dashboard
- Selecione o projeto: `autvision-backend` ou `autvision-frontend`

### 2. Configure as Variáveis de Ambiente

#### Para o BACKEND (autvision-backend):

**Navegue para:** Settings → Environment Variables

```bash
# 🗄️ SUPABASE CONFIGURATION
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 🤖 LLM API KEYS
OPENROUTER_API_KEY=sk-or-v1-...
TOGETHER_API_KEY=...
GEMINI_API_KEY=...
GROQ_API_KEY=...

# 🎵 VOICE ENGINES
ELEVENLABS_API_KEY=...
OPENAI_API_KEY=sk-...

# 🛡️ SECURITY
JWT_SECRET=sua-chave-super-secreta-aqui-com-pelo-menos-32-caracteres

# 🌐 ENVIRONMENT
NODE_ENV=production
PORT=3001
```

#### Para o FRONTEND (autvision-frontend):

```bash
# 🔗 API ENDPOINTS
NEXT_PUBLIC_BACKEND_URL=https://autvision-backend.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 🌐 ENVIRONMENT
NODE_ENV=production
```

### 3. Regenerar Chaves Comprometidas

#### ⚠️ AÇÃO OBRIGATÓRIA - REGENERAR TODAS AS CHAVES
Como houve vazamento anterior, você DEVE regenerar todas as chaves:

**Supabase:**
1. Acesse: https://supabase.com/dashboard/projects
2. Vá em Settings → API
3. Clique em "Regenerate" para `anon` e `service_role` keys
4. Atualize na Vercel

**OpenRouter:**
1. Acesse: https://openrouter.ai/keys
2. Delete a chave atual
3. Crie uma nova chave
4. Atualize na Vercel

**Together AI:**
1. Acesse: https://api.together.xyz/settings/api-keys
2. Revogue a chave atual
3. Crie uma nova chave
4. Atualize na Vercel

**ElevenLabs:**
1. Acesse: https://elevenlabs.io/api
2. Regenere a chave API
3. Atualize na Vercel

### 4. Configurar Domínios Permitidos

**No Supabase:**
- Vá em Authentication → Settings
- Adicione os domínios da Vercel em "Site URL" e "Redirect URLs":
  ```
  https://autvision-frontend.vercel.app
  https://autvision-backend.vercel.app
  ```

### 5. Forçar Novo Deploy

Após configurar todas as variáveis:

```bash
# Ir para Deployments e clicar em "Redeploy"
# OU fazer um commit vazio para forçar rebuild:
git commit --allow-empty -m "🚀 PROD: forçar deploy após configuração de variáveis"
git push
```

## 📊 VALIDAÇÃO DO DEPLOY

### 1. Testar Endpoints do Backend

```bash
# Health Check
curl https://autvision-backend.vercel.app/health

# Config Health (com fallback)
curl https://autvision-backend.vercel.app/config/health

# Visions
curl https://autvision-backend.vercel.app/visions

# Chat Test
curl -X POST https://autvision-backend.vercel.app/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Olá!", "visionId": 1}'
```

### 2. Testar Frontend

```bash
# Acessar a aplicação
https://autvision-frontend.vercel.app

# Verificar se não há erros de CORS no console
# Testar login/cadastro
# Testar chat com agentes
```

### 3. Monitorar Logs

**Vercel Dashboard:**
- Functions → View Function Logs
- Verificar erros de autenticação
- Monitorar chamadas de API

## 🔒 CHECKLIST DE SEGURANÇA

- [ ] Todas as chaves regeneradas
- [ ] Variáveis configuradas apenas na Vercel
- [ ] Nenhuma chave sensível no código
- [ ] Domínios configurados no Supabase
- [ ] Logs monitorados
- [ ] Endpoints funcionando
- [ ] CORS configurado corretamente
- [ ] Fallback mock funcionando

## 🚨 EM CASO DE PROBLEMAS

### Erro 500 - Variáveis não configuradas
```bash
# Verificar se todas as variáveis foram adicionadas
# Especialmente: SUPABASE_URL, SUPABASE_ANON_KEY
```

### Erro de CORS
```bash
# Verificar se o domínio está permitido no backend
# Verificar configuração do vercel.json
```

### Erro de Autenticação
```bash
# Verificar se as chaves foram regeneradas
# Verificar se as variáveis estão corretas na Vercel
```

## 🎯 PRÓXIMOS PASSOS

1. **Configurar todas as variáveis na Vercel**
2. **Regenerar todas as chaves comprometidas**
3. **Forçar novo deploy**
4. **Testar funcionalidade completa**
5. **Monitorar logs por 24h**

---

**⚡ STATUS:** Aguardando configuração de variáveis para ativar funcionalidade completa
**🔐 SEGURANÇA:** Chaves removidas do código - configuração manual necessária
**🚀 DEPLOY:** Pronto para produção após configuração das variáveis
