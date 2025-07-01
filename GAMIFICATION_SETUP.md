# 🎮 Setup do Sistema de Gamificação

## Visão Geral

Este documento explica como configurar o sistema de gamificação no Supabase e quais tabelas são necessárias.

## 📋 Tabelas Criadas

### 1. **users** (Atualizada)
Tabela principal de usuários com colunas adicionais para gamificação:
- `xp` - Pontos de experiência do usuário
- `tokens` - Tokens/moedas virtuais
- `level` - Nível atual do usuário
- `completed_mission_ids` - Array com IDs das missões completadas
- `earned_badge_ids` - Array com IDs dos badges conquistados
- `streak` - Sequência de dias ativos
- `last_activity` - Última atividade do usuário
- `total_interactions` - Total de interações

### 2. **missions**
Tabela de missões/desafios:
- Missões com diferentes tipos (use_vision, create_routine, etc.)
- Recompensas em XP e tokens
- Sistema de pré-requisitos
- Missões repetíveis com cooldown

### 3. **badges**
Tabela de conquistas/badges:
- Badges com diferentes raridades
- Sistema de badges secretos
- Categorização por tipo

### 4. **user_mission_progress**
Progresso individual de cada usuário nas missões:
- Acompanha progresso atual vs meta
- Data de início e conclusão
- Status de completude

### 5. **gamification_history**
Histórico completo de todas as ações de gamificação:
- Ganho de XP/tokens
- Subida de nível
- Conclusão de missões
- Conquista de badges

### 6. **rewards**
Loja de recompensas:
- Itens que podem ser comprados com tokens
- Diferentes tipos (cosméticos, boosts, acesso premium)
- Sistema de estoque limitado

### 7. **user_rewards**
Recompensas resgatadas pelos usuários:
- Histórico de compras
- Status ativo/inativo
- Data de expiração

### 8. **gamification_events**
Eventos de gamificação para processamento:
- Fila de eventos para processar
- Dados do evento em JSON
- Status de processamento

## 🚀 Como Configurar

### Passo 1: Executar o SQL
1. Acesse o Supabase Dashboard
2. Vá para "SQL Editor"
3. Cole o conteúdo do arquivo `gamification_tables.sql`
4. Execute o script

### Passo 2: Verificar Criação
Verifique se todas as tabelas foram criadas:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'missions', 'badges', 'user_mission_progress', 
  'gamification_history', 'rewards', 'user_rewards', 
  'gamification_events'
);
```

### Passo 3: Verificar Dados Padrão
Verifique se as missões e badges padrão foram inseridos:
```sql
SELECT COUNT(*) as total_missions FROM missions;
SELECT COUNT(*) as total_badges FROM badges;
SELECT COUNT(*) as total_rewards FROM rewards;
```

## 🔒 Segurança (RLS)

O sistema implementa Row Level Security (RLS) para:
- Usuários só veem seus próprios dados
- Missões e badges públicos são visíveis para todos
- Badges secretos só são visíveis para usuários autenticados
- Recompensas ativas são públicas

## 📊 Views Úteis

### Ranking de Usuários
```sql
SELECT * FROM user_ranking LIMIT 10;
```

### Estatísticas Globais
```sql
SELECT * FROM global_gamification_stats;
```

## 🎯 Sistema de Níveis

O sistema usa os seguintes níveis:
1. **Nível 1** - Iniciante (0 XP) - 10 tokens
2. **Nível 2** - Explorer (100 XP) - 25 tokens
3. **Nível 3** - Pioneiro (300 XP) - 50 tokens
4. **Nível 4** - Especialista (600 XP) - 75 tokens
5. **Nível 5** - Mestre (1000 XP) - 100 tokens
6. **Nível 6** - Lenda (1500 XP) - 150 tokens
7. **Nível 7** - Vision Master (2200 XP) - 200 tokens
8. **Nível 8** - Supremo (3000 XP) - 300 tokens
9. **Nível 9** - Transcendente (4000 XP) - 500 tokens
10. **Nível 10** - Divino (5500 XP) - 1000 tokens

## 🏆 Missões Padrão

1. **Primeira Conversa** - 50 XP, 5 tokens
2. **Criador de Rotinas** - 100 XP, 10 tokens
3. **Mestre dos Agentes** - 150 XP, 15 tokens
4. **Perfil Completo** - 75 XP, 8 tokens
5. **Conversador Ativo** - 200 XP, 20 tokens
6. **Sequência de 7 Dias** - 300 XP, 30 tokens
7. **Integrador** - 250 XP, 25 tokens

## 🎁 Recompensas Padrão

1. **Tema Premium** - 100 tokens
2. **Boost de XP** - 150 tokens
3. **Acesso Premium** - 500 tokens
4. **Avatar Personalizado** - 200 tokens
5. **Prioridade no Suporte** - 300 tokens

## 🔧 Manutenção

### Limpeza de Dados Antigos
```sql
-- Limpar eventos processados antigos (mais de 30 dias)
DELETE FROM gamification_events 
WHERE processed = true 
AND created_at < NOW() - INTERVAL '30 days';

-- Limpar histórico muito antigo (mais de 1 ano)
DELETE FROM gamification_history 
WHERE created_at < NOW() - INTERVAL '1 year';
```

### Monitoramento
```sql
-- Verificar usuários mais ativos
SELECT email, xp, level, tokens 
FROM users 
ORDER BY xp DESC 
LIMIT 10;

-- Verificar missões mais completadas
SELECT m.title, COUNT(ump.id) as completions
FROM missions m
LEFT JOIN user_mission_progress ump ON m.id = ump.mission_id
WHERE ump.is_completed = true
GROUP BY m.id, m.title
ORDER BY completions DESC;
```

## ⚠️ Notas Importantes

1. **Backup**: Sempre faça backup antes de executar o script
2. **Teste**: Teste em ambiente de desenvolvimento primeiro
3. **Performance**: Monitore a performance com os índices criados
4. **Políticas**: Ajuste as políticas RLS conforme necessário
5. **Dados**: Customize missões e recompensas para seu caso de uso

## 🐛 Troubleshooting

### Erro de Permissão
Se houver erro de permissão, verifique se você tem privilégios de admin no Supabase.

### Tabela Já Existe
Se alguma tabela já existir, o script usará `IF NOT EXISTS` para evitar erros.

### RLS Bloqueando Acesso
Se os dados não aparecerem, verifique as políticas RLS e se o usuário está autenticado.

### Performance Lenta
Se as consultas estiverem lentas, verifique se os índices foram criados corretamente:
```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('users', 'missions', 'badges', 'user_mission_progress');
```