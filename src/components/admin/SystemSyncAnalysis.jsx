// ANÁLISE DE SINCRONIZAÇÃO: PAINEL ADMIN VS. PAINEL USUÁRIO
export const systemSyncAnalysis = {
  title: "Análise de Sincronização e Próximos Passos",
  summary: "Este documento detalha como cada módulo do Painel Admin impacta a experiência do usuário e quais melhorias são necessárias para uma integração perfeita com o backend.",
  modules: [
    {
      moduleName: "Gerenciamento de Usuários",
      adminComponent: "UserManagementView",
      userFacingImpact: [
        "Página de Perfil do Usuário", 
        "Layout (exibição de nome, tokens, etc.)", 
        "Acesso a recursos baseado no plano"
      ],
      syncStatus: "✅ SINCRONIZADO (COM DADOS MOCKADOS)",
      description: "O admin pode ver e editar dados dos usuários. As alterações (como nome, plano ou tokens) devem refletir imediatamente para o usuário.",
      improvements: [
        {
          title: "Implementar RLS (Row Level Security) no Supabase",
          description: "Criar políticas para que um usuário só possa ver/editar seus próprios dados, enquanto um admin pode ver/editar todos.",
          priority: "CRÍTICA"
        },
        {
          title: "Ações em Massa",
          description: "Permitir que o admin possa banir, mudar o plano ou enviar notificações para múltiplos usuários de uma vez.",
          priority: "ALTA"
        }
      ]
    },
    {
      moduleName: "Gerenciamento de Planos",
      adminComponent: "PlansManagement",
      userFacingImpact: [
        "Modal de Compra de Planos", 
        "Página de Configurações (Aba 'Meu Plano')"
      ],
      syncStatus: "✅ SINCRONIZADO (COM DADOS MOCKADOS)",
      description: "O admin cria e edita os planos (preço, recursos, etc.). Essas opções aparecem dinamicamente para o usuário na hora da compra ou upgrade.",
      improvements: [
        {
          title: "Webhooks de Pagamento",
          description: "Integrar com webhooks do gateway de pagamento (Stripe, etc.) para atualizar o plano do usuário automaticamente após a confirmação do pagamento.",
          priority: "CRÍTICA"
        },
        {
          title: "Planos com Teste Gratuito (Trial)",
          description: "Adicionar lógica para gerenciar períodos de teste, incluindo o bloqueio de recursos após o fim do trial.",
          priority: "MÉDIA"
        }
      ]
    },
    {
      moduleName: "Visão Financeira",
      adminComponent: "FinancialView",
      userFacingImpact: ["Histórico de transações do usuário (futuro)"],
      syncStatus: "✅ SINCRONIZADO (COM DADOS MOCKADOS)",
      description: "O admin monitora todas as transações da plataforma. A criação de uma transação no sistema (ex: assinatura) deve estar ligada ao usuário e seu plano.",
      improvements: [
        {
          title: "Dashboard Financeiro em Tempo Real",
          description: "Conectar os gráficos e métricas a uma view materializada no banco de dados para performance em tempo real.",
          priority: "ALTA"
        },
        {
          title: "Sistema de Reembolso",
          description: "Criar uma função que, ao ser acionada pelo admin, se comunique com a API do gateway de pagamento para processar um reembolso e atualizar o status da transação.",
          priority: "ALTA"
        }
      ]
    },
    {
      moduleName: "Agentes, Rotinas e Integrações",
      adminComponent: "AgentsManagement, etc.",
      userFacingImpact: [
        "Página de Agentes", 
        "Página de Rotinas", 
        "Página de Integrações"
      ],
      syncStatus: "⚠️ PARCIALMENTE SINCRONIZADO",
      description: "Atualmente, os agentes e rotinas são 'globais'. O ideal é que o admin possa criar 'Templates' que os usuários podem então instanciar e personalizar.",
      improvements: [
        {
          title: "Sistema de Templates",
          description: "Refatorar as entidades Agente e Rotina para ter uma versão 'Template' (criada pelo admin) e uma 'Instância' (criada pelo usuário a partir do template).",
          priority: "CRÍTICA"
        },
        {
          title: "Controle de Acesso por Plano",
          description: "Garantir que um agente/integração que exige um plano 'Premium' não possa ser ativado por um usuário do plano 'Gratuito'.",
          priority: "ALTA"
        }
      ]
    }
  ]
};