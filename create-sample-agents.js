const axios = require('axios');

const sampleAgents = [
  {
    name: 'ADA - Assistente Digital Avançada',
    description: 'Assistente especializada em análise de dados e automação',
    type: 'work',
    capabilities: 'análise de dados, automação, relatórios',
    icon: '🤖',
    color: '#6366f1',
    prompt: 'Você é ADA, uma assistente digital especializada em análise de dados e automação.',
    plan_required: 'free',
    is_active: true,
    image_url: '/assets/images/agents/agent-ADA.jpeg'
  },
  {
    name: 'Echo - Assistente de Comunicação',
    description: 'Especialista em comunicação e redes sociais',
    type: 'social',
    capabilities: 'comunicação, redes sociais, marketing',
    icon: '📢',
    color: '#10b981',
    prompt: 'Você é Echo, um assistente especializado em comunicação e redes sociais.',
    plan_required: 'basic',
    is_active: true,
    image_url: '/assets/images/agents/agent-Echo.jpeg'
  },
  {
    name: 'Guardian - Assistente de Segurança',
    description: 'Especialista em segurança e proteção de dados',
    type: 'work',
    capabilities: 'segurança, proteção de dados, monitoramento',
    icon: '🛡️',
    color: '#ef4444',
    prompt: 'Você é Guardian, um assistente especializado em segurança e proteção.',
    plan_required: 'premium',
    is_active: true,
    image_url: '/assets/images/agents/agent-Guardian.jpeg'
  },
  {
    name: 'Nova - Assistente Criativa',
    description: 'Especialista em criatividade e inovação',
    type: 'entertainment',
    capabilities: 'criatividade, design, inovação',
    icon: '✨',
    color: '#8b5cf6',
    prompt: 'Você é Nova, uma assistente especializada em criatividade e inovação.',
    plan_required: 'basic',
    is_active: true,
    image_url: '/assets/images/agents/agent-Nova.jpeg'
  }
];

async function createSampleAgents() {
  try {
    console.log('🔄 Criando agentes de exemplo...');
    
    for (const agent of sampleAgents) {
      try {
        const response = await axios.post('http://localhost:3001/agents', agent, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'dev-key-123'
          }
        });
        
        console.log(`✅ Agente criado: ${agent.name}`);
      } catch (error) {
        console.error(`❌ Erro ao criar agente ${agent.name}:`, error.response?.data || error.message);
      }
    }
    
    console.log('🎉 Processo de criação concluído!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

createSampleAgents();