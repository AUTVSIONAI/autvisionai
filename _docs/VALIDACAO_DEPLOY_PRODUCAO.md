# Validação do Deploy em Produção

Este documento contém instruções para validar o funcionamento correto do sistema em produção.

## Endpoints do Backend a Testar

1. **Health Check**
   - URL: `https://autvisionai-backend-five.vercel.app/config/health`
   - Método: GET
   - Resposta esperada: Status 200 com JSON `{"status": "ok", ...}`

2. **Verificação de Favicon**
   - URL: `https://autvisionai-backend-five.vercel.app/favicon.ico`
   - Método: GET
   - Resposta esperada: Status 204 (No Content)

3. **Endpoint de Visions**
   - URL: `https://autvisionai-backend-five.vercel.app/visions`
   - Método: GET
   - Header: `x-api-key: autvision-secure-2024`
   - Resposta esperada: Lista de visions disponíveis

4. **Endpoint de Admin**
   - URL: `https://autvisionai-backend-five.vercel.app/admin/dashboard`
   - Método: GET
   - Header: `x-api-key: autvision-secure-2024`
   - Resposta esperada: Dados do dashboard de administração

## Integração Frontend-Backend

1. **Login no Frontend**
   - Acesse: `https://autvisionai.vercel.app`
   - Faça login com credenciais válidas
   - Verifique se o token é armazenado corretamente

2. **Visions no Frontend**
   - Após login, verifique se a lista de visions é carregada
   - Teste se é possível criar e interagir com uma vision

3. **Chat com Agentes**
   - Teste a interação com um agente
   - Verifique se as respostas são recebidas normalmente

## Validação CORS

1. **Console de Desenvolvedor**
   - Abra o console de desenvolvedor do navegador (F12)
   - Verifique se não há erros de CORS nas requisições

2. **Network Tab**
   - Na aba Network, filtre por XHR/Fetch
   - Verifique se todas as requisições para o backend têm status 2xx

## Comandos para Testar via Terminal

```bash
# Testar health check
curl -I https://autvisionai-backend-five.vercel.app/config/health

# Testar endpoint com autenticação
curl -H "x-api-key: autvision-secure-2024" https://autvisionai-backend-five.vercel.app/visions

# Verificar cabeçalhos CORS
curl -I -X OPTIONS https://autvisionai-backend-five.vercel.app/visions
```

## Resolução de Problemas Comuns

1. **Erro 500 no Backend**
   - Verificar logs da Vercel
   - Garantir que todas as variáveis de ambiente estão configuradas
   - Verificar se o build foi completado com sucesso

2. **Erros de CORS**
   - Verificar se os headers CORS estão sendo enviados corretamente
   - Garantir que o domínio do frontend está na lista de domínios permitidos

3. **Frontend não acessa o Backend**
   - Confirmar que VITE_API_BASE_URL está configurado corretamente
   - Verificar se as requisições estão sendo feitas com o token correto
