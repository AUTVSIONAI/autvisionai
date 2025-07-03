# Guia de Integração de Vozes do Vision Command

Este guia explica como usar o sistema de vozes integrado do Vision Command, permitindo que administradores configurem vozes e desenvolvedores as utilizem em seus componentes.

## 📋 Visão Geral

O sistema de vozes do Vision Command permite:
- **Administradores**: Configurar qual voz será usada pelo sistema
- **Desenvolvedores**: Integrar facilmente síntese de voz em componentes
- **Usuários**: Receber respostas em voz do Vision Command

## 🎛️ Painel Administrativo

### Acessando as Configurações
1. Faça login como administrador
2. Acesse o painel de **Gerenciamento de Vozes**
3. Clique na aba **Vision Command**

### Configurando a Voz Padrão
1. Clique em **"Alterar Configuração"**
2. Selecione uma voz disponível na lista
3. Teste a voz clicando no botão de reprodução
4. Habilite/desabilite a funcionalidade com o switch
5. Clique em **"Salvar Configuração"**

### Testando Vozes
- Cada voz na lista tem um botão de teste
- O sistema usa o endpoint `/voice/synthesize` do backend
- As configurações são salvas no banco de dados e localStorage

## 🔧 Integração para Desenvolvedores

### Método 1: Usando o Hook `useVisionVoice`

```jsx
import { useVisionVoice } from '@/hooks/useVisionVoice';

const MeuComponente = () => {
  const { speak, isPlaying, isEnabled, visionVoiceConfig } = useVisionVoice();

  const handleResponse = async (texto) => {
    if (isEnabled && !isPlaying) {
      try {
        await speak(texto);
        console.log('Voz reproduzida com sucesso');
      } catch (error) {
        console.error('Erro ao reproduzir voz:', error);
      }
    }
  };

  return (
    <div>
      <p>Voz atual: {visionVoiceConfig.voice_name}</p>
      <button 
        onClick={() => handleResponse('Olá! Como posso ajudar?')}
        disabled={!isEnabled || isPlaying}
      >
        {isPlaying ? 'Reproduzindo...' : 'Falar'}
      </button>
    </div>
  );
};
```

### Método 2: Usando Funções Utilitárias

```jsx
import { 
  playVisionVoice, 
  getVisionVoiceConfig, 
  isVisionVoiceEnabled,
  onVisionVoiceConfigChange 
} from '@/utils/visionVoiceIntegration';

const MeuComponente = () => {
  useEffect(() => {
    // Escutar mudanças nas configurações
    const unsubscribe = onVisionVoiceConfigChange((newConfig) => {
      console.log('Configuração atualizada:', newConfig);
    });

    return unsubscribe;
  }, []);

  const handleVisionResponse = async (responseText) => {
    if (isVisionVoiceEnabled()) {
      try {
        await playVisionVoice(responseText);
      } catch (error) {
        console.error('Erro ao reproduzir:', error);
      }
    }
  };

  return (
    // Seu componente aqui
  );
};
```

## 📡 API do Hook `useVisionVoice`

### Retorno do Hook
```javascript
const {
  visionVoiceConfig,  // Configuração atual da voz
  isPlaying,          // Se está reproduzindo áudio
  speak,              // Função para sintetizar e reproduzir
  stop,               // Função para parar reprodução
  isEnabled           // Se a voz está habilitada
} = useVisionVoice();
```

### Função `speak(text, options)`
- **text**: Texto para sintetizar
- **options**: Opções adicionais
  - `speed`: Velocidade da fala (padrão: 1.0)
  - `pitch`: Tom da voz (padrão: 0)
  - `showToast`: Mostrar notificações de erro (padrão: true)

## 🛠️ Funções Utilitárias

### `playVisionVoice(text, options)`
Reproduz texto usando a voz configurada
```javascript
await playVisionVoice('Olá mundo!', { speed: 1.2 });
```

### `getVisionVoiceConfig()`
Retorna a configuração atual
```javascript
const config = getVisionVoiceConfig();
console.log(config.voice_name); // "Ana Clara"
```

### `isVisionVoiceEnabled()`
Verifica se a voz está habilitada
```javascript
if (isVisionVoiceEnabled()) {
  // Reproduzir voz
}
```

### `onVisionVoiceConfigChange(callback)`
Escuta mudanças nas configurações
```javascript
const unsubscribe = onVisionVoiceConfigChange((newConfig) => {
  console.log('Nova voz:', newConfig.voice_name);
});

// Limpar listener
unsubscribe();
```

## 🔄 Fluxo de Dados

1. **Admin configura voz** → Salvo no Supabase + localStorage
2. **Evento disparado** → `visionVoiceConfigUpdated`
3. **Componentes escutam** → Atualizam automaticamente
4. **Síntese de voz** → Backend `/voice/synthesize`
5. **Reprodução** → Audio API do navegador

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   ├── admin/
│   │   └── VoiceManagement.jsx     # Painel admin
│   └── examples/
│       └── VisionVoiceExample.jsx  # Exemplo de uso
├── hooks/
│   └── useVisionVoice.js           # Hook principal
├── utils/
│   └── visionVoiceIntegration.js   # Funções utilitárias
└── docs/
    └── VOICE_INTEGRATION_GUIDE.md  # Este guia
```

## 🚀 Exemplo Prático: Vision Command

```jsx
import { useVisionVoice } from '@/hooks/useVisionVoice';

const VisionCommand = () => {
  const { speak, isEnabled } = useVisionVoice();
  const [response, setResponse] = useState('');

  const processVisionRequest = async (imageData) => {
    try {
      // Processar imagem...
      const aiResponse = await analyzeImage(imageData);
      setResponse(aiResponse);
      
      // Reproduzir resposta em voz
      if (isEnabled) {
        await speak(aiResponse);
      }
    } catch (error) {
      console.error('Erro no Vision Command:', error);
    }
  };

  return (
    <div>
      <ImageUpload onUpload={processVisionRequest} />
      <div>{response}</div>
    </div>
  );
};
```

## ⚠️ Considerações Importantes

1. **Backend**: Certifique-se que o backend está rodando na porta 3001
2. **Permissões**: O navegador pode solicitar permissão para reproduzir áudio
3. **Performance**: Evite múltiplas reproduções simultâneas
4. **Fallback**: Sempre tenha um fallback para quando a voz estiver desabilitada
5. **Erro Handling**: Trate erros de rede e síntese adequadamente

## 🔧 Troubleshooting

### Voz não reproduz
- Verifique se o backend está rodando
- Confirme se a voz está habilitada no painel admin
- Verifique permissões de áudio do navegador

### Configuração não atualiza
- Limpe o localStorage: `localStorage.removeItem('vision_voice_config')`
- Recarregue a página
- Verifique se o evento `visionVoiceConfigUpdated` está sendo disparado

### Erro de síntese
- Verifique logs do backend
- Confirme se o endpoint `/voice/synthesize` está funcionando
- Teste com textos mais simples

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console
2. Teste o componente de exemplo em `/examples/VisionVoiceExample`
3. Consulte a documentação da API do backend