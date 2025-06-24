// DADOS MOCKADOS - SISTEMA COMPLETO PARA DESENVOLVIMENTO
export const mockUsers = [
  {
    id: "user_001",
    full_name: "Paulo Silva",
    email: "paulo@autvision.com",
    role: "admin",
    plan_id: "plan_premium",
    tokens: 1250,
    xp: 2840,
    created_date: new Date('2024-01-15').toISOString(),
    completed_mission_ids: ["mission_001", "mission_002"],
    earned_badge_ids: ["badge_001", "badge_002"]
  },
  {
    id: "user_002",
    full_name: "Ana Costa",
    email: "ana@exemplo.com",
    role: "user",
    plan_id: "plan_free",
    tokens: 380,
    xp: 1120,
    created_date: new Date('2024-02-10').toISOString(),
    completed_mission_ids: ["mission_001"],
    earned_badge_ids: ["badge_001"]
  }
];

export const mockPlans = [
  {
    id: "plan_free",
    name: "Gratuito",
    price: 0,
    features: ["1 Vision", "3 Agentes", "5 Rotinas", "Suporte Básico"],
    max_agents: 3,
    max_routines: 5,
    max_integrations: 2,
    support_level: "basic",
    is_popular: false,
    is_active: true
  },
  {
    id: "plan_premium",
    name: "Premium",
    price: 29.90,
    features: ["Vision Unlimited", "8 Agentes", "Rotinas Ilimitadas", "Integrações Premium", "Suporte Priority"],
    max_agents: 8,
    max_routines: null,
    max_integrations: 10,
    support_level: "priority",
    is_popular: true,
    is_active: true
  },
  {
    id: "plan_enterprise",
    name: "Enterprise",
    price: 99.90,
    features: ["Multi-Vision", "Agentes Unlimited", "White Label", "API Access", "Suporte Dedicado"],
    max_agents: null,
    max_routines: null,
    max_integrations: null,
    support_level: "dedicated",
    is_popular: false,
    is_active: true
  }
];

export const mockVisions = [
  {
    id: "vision_001",
    name: "Vision Principal",
    personality_type: "friendly",
    voice_enabled: true,
    learning_level: 5,
    status: "active",
    user_preferences: {
      wake_word: "Hey Vision",
      response_speed: "normal",
      interaction_mode: "mixed"
    },
    total_interactions: 347,
    last_interaction: new Date().toISOString(),
    created_by: "paulo@autvision.com",
    created_date: new Date('2024-01-15').toISOString()
  }
];

export const mockAgents = [
  {
    id: "agent_echo",
    name: "Echo",
    type: "communication",
    description: "Especialista em comunicação por voz e comandos de áudio",
    is_active: true,
    capabilities: ["voice_recognition", "speech_synthesis", "translation"],
    integrations: ["google_assistant", "alexa"],
    usage_count: 156,
    plan_required: "free",
    created_by: "paulo@autvision.com"
  },
  {
    id: "agent_guardian",
    name: "Guardian",
    type: "security",
    description: "Monitora segurança e protege dados do sistema",
    is_active: false,
    capabilities: ["threat_detection", "backup", "monitoring"],
    integrations: ["security_api"],
    usage_count: 78,
    plan_required: "premium",
    created_by: "paulo@autvision.com"
  }
];

export const mockRoutines = [
  {
    id: "routine_001",
    name: "Bom Dia Inteligente",
    description: "Rotina matinal com clima, agenda e notícias",
    trigger_type: "time",
    trigger_value: "08:00",
    actions: [
      { agent_type: "echo", action: "speak", parameters: { message: "Bom dia!" } },
      { agent_type: "nova", action: "weather", parameters: {} }
    ],
    is_active: true,
    execution_count: 45,
    last_executed: new Date('2024-12-29').toISOString(),
    created_by: "paulo@autvision.com"
  }
];

export const mockIntegrations = [
  {
    id: "integration_google",
    name: "Google Workspace",
    type: "google",
    status: "connected",
    description: "Integração com Gmail, Calendar e Drive",
    permissions: ["read_email", "write_calendar"],
    plan_required: "free",
    is_active: true,
    connected_at: new Date('2024-01-15').toISOString(),
    created_by: "paulo@autvision.com"
  }
];

export const mockTransactions = [
  {
    id: "transaction_001",
    user_email: "paulo@autvision.com",
    type: "subscription",
    amount: 29.90,
    currency: "BRL",
    status: "completed",
    payment_method: "credit_card",
    gateway: "stripe",
    description: "Assinatura Premium - Janeiro 2024",
    plan_id: "plan_premium",
    processed_at: new Date('2024-01-15').toISOString()
  }
];

export const mockAnalytics = [
  {
    id: "analytics_001",
    event_type: "user_login",
    user_email: "paulo@autvision.com",
    success: true,
    response_time: 234,
    ip_address: "192.168.1.1",
    created_date: new Date().toISOString()
  }
];