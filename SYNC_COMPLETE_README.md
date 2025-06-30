# 🚀 AUTVISION AI - SISTEMA SINCRONIZADO

Sistema completo com **Frontend (porta 3002)** e **Backend (porta 3001)** 100% sincronizados através do **SyncContext**.

## ⚡ INÍCIO RÁPIDO

### 1. Inicialização Automática (Recomendado)
```bash
# Windows PowerShell
.\start-autvision.ps1
```

### 2. Inicialização Manual
```bash
# Terminal 1 - Backend (porta 3001)
cd autvisionai-backend
npm install
npm run dev

# Terminal 2 - Frontend (porta 3002)  
cd autvisionai-front
npm install
npm run dev
```

### 3. Teste de Sincronização
```bash
# Verificar se tudo está funcionando
.\test-sync.ps1

# Ou teste detalhado
node validate-sync.js
```

## 🔄 SISTEMA DE SINCRONIZAÇÃO

### SyncContext (Núcleo da Sincronização)
- **Localização**: `src/contexts/SyncContext.jsx`
- **Função**: Sincronização bidirecional Admin ↔ Client
- **Frequência**: Automática a cada 30s + manual
- **Eventos**: Sistema de eventos em tempo real

### Endpoints Sincronizados
```
✅ /config/health     - Health Check
✅ /config/system     - Configurações do Sistema
✅ /agents           - Gestão de Agentes
✅ /users            - Gestão de Usuários  
✅ /plans            - Planos e Assinaturas
✅ /config/llms      - Configuração LLM
✅ /command          - Comandos Vision
✅ /integrations     - Integrações Externas
✅ /affiliates       - Sistema de Afiliados
```

## 🎯 ARQUITETURA

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   FRONTEND      │ ◄─────────────► │    BACKEND      │
│   Porta 3002    │                 │   Porta 3001    │
│                 │                 │                 │
│ ┌─────────────┐ │                 │ ┌─────────────┐ │
│ │ SyncContext │ │ ◄─────────────► │ │ API Routes  │ │
│ │ (Manager)   │ │                 │ │ (Entities)  │ │
│ └─────────────┘ │                 │ └─────────────┘ │
│                 │                 │                 │
│ Admin Panel     │                 │ Supabase DB    │
│ Client Dashboard│                 │ OpenRouter LLM  │
└─────────────────┘                 └─────────────────┘
```

## 📊 COMPONENTES PRINCIPAIS

### Frontend (React + Vite)
- **Admin Panel**: `/admin` - Gestão completa do sistema
- **Client Dashboard**: `/dashboard` - Interface do usuário
- **SyncContext**: Sincronização automática de dados
- **API Client**: Cliente HTTP com interceptors

### Backend (Node.js + Express)
- **API REST**: Endpoints para todas as entidades
- **Supabase**: Banco de dados PostgreSQL
- **OpenRouter**: Integração com LLMs
- **Middlewares**: Autenticação e validação

## 🔧 CONFIGURAÇÃO

### Variáveis de Ambiente (.env.local)
```bash
# Backend URL
VITE_API_BASE_URL=http://localhost:3001

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# OpenRouter  
VITE_OPENROUTER_API_KEY=sk-or-v1-your-key
VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Portas
VITE_FRONTEND_PORT=3002
VITE_BACKEND_PORT=3001
```

## 🚀 FUNCIONALIDADES

### 1. Sincronização Automática
- Dados sempre atualizados entre admin e client
- Fallback para modo offline
- Sistema de retry automático

### 2. Painel Admin Completo
- Gestão de usuários e agentes
- Configuração de planos
- Monitoramento em tempo real
- Analytics avançados

### 3. Dashboard Cliente
- Interface futurista e responsiva
- Vision Avatar interativo
- Modo imersivo épico
- Gamificação e conquistas

### 4. Sistema de Agentes
- Agentes IA especializados
- Rotinas automatizadas
- Integrações personalizadas
- Comandos inteligentes

## 🔥 RECURSOS AVANÇADOS

### Vision Supremo
- IA superinteligente
- Aprendizado contínuo
- Personalização total
- Modo conversacional

### Modo Imersivo
- Interface 3D futurista
- Agentes orbitais
- Efeitos visuais épicos
- Experiência cinematográfica

### Sistema de Gamificação
- Níveis e XP
- Conquistas desbloqueáveis
- Streak de atividade
- Ranking de usuários

## 🛠️ DESENVOLVIMENTO

### Scripts Disponíveis
```bash
# Frontend
npm run dev          # Iniciar desenvolvimento (porta 3002)
npm run build        # Build para produção
npm run sync-test    # Testar sincronização

# Backend
npm run dev          # Iniciar desenvolvimento (porta 3001)
npm run build        # Build TypeScript
npm run start        # Produção
```

### Debugging
```bash
# Logs do sistema
console.log('[SYNC]', 'Mensagem de sincronização')

# Teste manual de endpoints
curl http://localhost:3001/config/health

# Verificar SyncContext no browser
// DevTools Console
window.syncContext = useSync()
```

## 📈 MONITORAMENTO

### Health Checks
- Backend: `http://localhost:3001/config/health`
- Frontend: `http://localhost:3002`
- Sync: Execute `.\test-sync.ps1`

### Métricas de Sincronização
- Latência de API < 500ms
- Taxa de sucesso > 99%
- Tempo de sincronização < 5s
- Eventos em tempo real

## 🎉 STATUS ATUAL

```
🟢 Backend API      - FUNCIONANDO
🟢 Frontend App     - FUNCIONANDO  
🟢 SyncContext      - ATIVO
🟢 Admin Panel      - OPERACIONAL
🟢 Client Dashboard - OPERACIONAL
🟢 Banco de Dados   - CONECTADO
🟢 LLM Integration  - ATIVA
```

## 🚀 PRÓXIMOS PASSOS

1. **Testes Automatizados**: Implementar testes E2E
2. **Deploy Automático**: CI/CD com Vercel/Railway
3. **Monitoramento**: Logs e métricas avançadas
4. **Otimização**: Cache e performance
5. **Expansão**: Novos agentes e funcionalidades

---

**🤖 AUTVISION AI - O Futuro da IA Personalizada**

*Sistema 100% sincronizado e pronto para revolucionar a produtividade!*
