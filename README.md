# AutVision AI

🤖 **Sistema de Inteligência Artificial Avançado com Interface Futurista**

## 📋 Descrição

AutVision AI é uma plataforma completa de inteligência artificial que combina um dashboard futurista com capacidades avançadas de processamento de linguagem natural. O sistema oferece uma experiência de usuário imersiva com componentes visuais interativos e integração com modelos de IA.

## ✨ Características Principais

- 🎨 **Interface Futurista**: Dashboard com design moderno e animações fluidas
- 🤖 **Vision Core**: Assistente AI interativo com avatar animado
- 💬 **Chat Inteligente**: Integração com modelos LLM avançados
- 📊 **Dashboard Analítico**: Visualização de dados em tempo real
- 🔐 **Autenticação Segura**: Sistema de login com Supabase
- 📱 **Responsivo**: Interface adaptável para diferentes dispositivos

## 🏗️ Arquitetura

### Frontend (React + Vite)
- **Framework**: React 18 com Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Componentes**: Shadcn/ui
- **Estado**: Context API + Hooks customizados
- **Autenticação**: Supabase Auth

### Backend (Node.js + TypeScript)
- **Runtime**: Node.js com TypeScript
- **Framework**: Express.js
- **Banco de Dados**: Supabase (PostgreSQL)
- **Deploy**: Vercel
- **API**: RESTful com integração LLM

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Supabase
- Chaves de API para LLM

### Frontend
```bash
cd autvisionai-front
npm install
cp .env.example .env
# Configure as variáveis de ambiente
npm run dev
```

### Backend
```bash
cd autvisionai-backend
npm install
cp .env.server.example .env
# Configure as variáveis de ambiente
npm run dev
```

## 🔧 Configuração de Ambiente

### Frontend (.env)
```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
VITE_API_BASE_URL=https://seu-backend.vercel.app
VITE_LLM_MOCK_MODE=false
VITE_ENVIRONMENT=production
```

### Backend (.env)
```env
SUPABASE_URL=sua_url_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
LLM_API_KEY=sua_chave_llm
PORT=3001
```

## 📁 Estrutura do Projeto

```
autvisionai-front/
├── src/
│   ├── components/          # Componentes React
│   │   ├── client/         # Dashboard do cliente
│   │   ├── auth/           # Autenticação
│   │   └── ui/             # Componentes UI
│   ├── contexts/           # Context providers
│   ├── hooks/              # Hooks customizados
│   ├── utils/              # Utilitários
│   └── api/                # Integrações API
├── public/                 # Arquivos estáticos
└── docs/                   # Documentação

autvisionai-backend/
├── src/
│   ├── routes/             # Rotas da API
│   ├── modules/            # Módulos de negócio
│   ├── utils/              # Utilitários
│   └── plugins/            # Plugins e integrações
└── dist/                   # Build de produção
```

## 🌐 Deploy

### Frontend (Vercel)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Backend (Vercel)
1. Configure o `vercel.json`
2. Defina as variáveis de ambiente
3. Deploy da API serverless

## 🔗 URLs de Produção

- **Frontend**: [https://autvisionai-front.vercel.app](https://autvisionai-front.vercel.app)
- **Backend**: [https://autvisionai-backend-five.vercel.app](https://autvisionai-backend-five.vercel.app)

## 🛠️ Tecnologias Utilizadas

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Shadcn/ui
- Supabase Client
- Lucide React

### Backend
- Node.js
- TypeScript
- Express.js
- Supabase
- Cors
- Helmet

## 📊 Funcionalidades

### Dashboard Principal
- Visualização de métricas em tempo real
- Gráficos interativos
- Cards informativos animados
- Sistema de notificações

### Vision Core
- Avatar AI interativo
- Chat com processamento de linguagem natural
- Respostas contextuais
- Interface de voz (planejado)

### Sistema de Agentes
- Criação e gerenciamento de agentes AI
- Upload de imagens
- Configuração personalizada
- Histórico de interações

## 🔐 Segurança

- Autenticação JWT via Supabase
- Validação de entrada em todas as APIs
- Sanitização de dados
- CORS configurado
- Headers de segurança (Helmet)

## 📈 Performance

- Lazy loading de componentes
- Otimização de imagens
- Cache de API
- Bundle splitting
- Compressão de assets

## 🧪 Testes

```bash
# Frontend
npm run test

# Backend
npm run test

# E2E
npm run test:e2e
```

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvimento**: Equipe AutVision AI
- **Design**: Interface futurista com foco em UX
- **Backend**: Arquitetura serverless escalável

## 📞 Suporte

Para suporte técnico ou dúvidas:
- 📧 Email: suporte@autvision.ai
- 💬 Discord: [AutVision Community](https://discord.gg/autvision)
- 📖 Documentação: [docs.autvision.ai](https://docs.autvision.ai)

---

**AutVision AI** - Transformando o futuro da inteligência artificial 🚀