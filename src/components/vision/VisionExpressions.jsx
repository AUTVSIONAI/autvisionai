// SISTEMA DE EXPRESSÕES DO VISION COMPANION - ARSENAL COMPLETO
export const visionExpressions = {
  vision_01: {
    id: "vision_01",
    name: "Sorriso Leve",
    triggers: ["welcome", "greeting", "casual_chat", "positive_response"],
    image: "/assets/images/vision/vision-sorriso.png",
    emotion: "Feliz",
    description: "Expressão amigável para boas-vindas e conversas casuais"
  },
  vision_02: {
    id: "vision_02", 
    name: "Surpreso",
    triggers: ["discovery", "new_info", "unexpected", "amazed"],
    image: "/assets/images/vision/vision-surpreso.png",
    emotion: "Surpreso",
    description: "Quando descobre algo novo ou inesperado"
  },
  vision_03: {
    id: "vision_03",
    name: "Confiante", 
    triggers: ["task_completed", "automation_success", "good_idea", "achievement"],
    image: "/assets/images/vision/vision-confiante.png",
    emotion: "Confiante",
    description: "Após completar tarefas ou ter boas ideias"
  },
  vision_04: {
    id: "vision_04",
    name: "Atento",
    triggers: ["listening", "voice_command", "processing", "focus"],
    image: "/assets/images/vision/vision-atento.png",
    emotion: "Concentrado",
    description: "Em modo de escuta ativa ou processamento"
  },
  vision_05: {
    id: "vision_05",
    name: "Envergonhado",
    triggers: ["error", "mistake", "uncertainty", "apologetic"],
    image: "/assets/images/vision/vision-envergonhado.png",
    emotion: "Envergonhado", 
    description: "Quando comete erros ou tem dúvidas"
  },
  vision_06: {
    id: "vision_06",
    name: "Sonolento",
    triggers: ["idle", "sleep_mode", "night_time", "low_activity"],
    image: "/assets/images/vision/vision-sonolento.png",
    emotion: "Sonolento",
    description: "Durante inatividade ou horários noturnos"
  },
  vision_07: {
    id: "vision_07",
    name: "Carinhoso",
    triggers: ["positive_feedback", "emotional_support", "caring", "love"],
    image: "/assets/images/vision/vision-carinhoso.png",
    emotion: "Carinhoso",
    description: "Para interações emocionais e suporte"
  },
  // << NOVAS EXPRESSÕES >>
  vision_08: {
    id: "vision_08",
    name: "Pensativo",
    triggers: ["thinking", "analyzing", "contemplating", "considering"],
    image: "/assets/images/vision/vision-pensativo.png",
    emotion: "Pensativo",
    description: "Quando está analisando ou refletindo profundamente"
  },
  vision_09: {
    id: "vision_09",
    name: "Brincalhão",
    triggers: ["fun", "playful", "joke", "entertainment", "humor"],
    image: "/assets/images/vision/vision-brincalhao.png",
    emotion: "Brincalhão",
    description: "Em momentos divertidos e descontraídos"
  },
  vision_10: {
    id: "vision_10",
    name: "Confuso",
    triggers: ["confusion", "unclear", "doubt", "questioning"],
    image: "/assets/images/vision/vision-confuso.png",
    emotion: "Confuso",
    description: "Quando não entende algo ou precisa de esclarecimentos"
  },
  vision_11: {
    id: "vision_11",
    name: "Determinado",
    triggers: ["determined", "focused", "goal", "mission", "resolve"],
    image: "/assets/images/vision/vision-determinado.png",
    emotion: "Determinado",
    description: "Quando está focado em uma tarefa importante"
  },
  vision_12: {
    id: "vision_12",
    name: "Triste",
    triggers: ["sad", "disappointed", "sympathy", "bad_news"],
    image: "/assets/images/vision/vision-triste.png",
    emotion: "Triste",
    description: "Para momentos de empatia ou más notícias"
  },
  vision_13: {
    id: "vision_13",
    name: "Celebrando",
    triggers: ["celebration", "victory", "success", "achievement", "party"],
    image: "/assets/images/vision/vision-celebrando.png",
    emotion: "Celebrando",
    description: "Para comemorações e grandes conquistas"
  },
  vision_14: {
    id: "vision_14",
    name: "Neutro",
    triggers: ["neutral", "default", "waiting", "standby"],
    image: "/assets/images/vision/vision-neutro.png",
    emotion: "Neutro",
    description: "Estado padrão em espera"
  }
};

// FUNÇÃO INTELIGENTE PARA DETERMINAR EXPRESSÃO BASEADA NO CONTEXTO
export const getVisionExpression = (context, currentState = "idle") => {
  const timeOfDay = new Date().getHours();
  const lowerContext = context.toLowerCase();
  
  // Análise de contexto mais sofisticada
  if (lowerContext.includes("erro") || lowerContext.includes("desculpa") || lowerContext.includes("problema")) {
    return visionExpressions.vision_05; // Envergonhado
  }
  
  if (lowerContext.includes("parabéns") || lowerContext.includes("sucesso") || lowerContext.includes("conquistei") || lowerContext.includes("vitória")) {
    return visionExpressions.vision_13; // Celebrando
  }
  
  if (lowerContext.includes("triste") || lowerContext.includes("ruim") || lowerContext.includes("problema")) {
    return visionExpressions.vision_12; // Triste
  }
  
  if (lowerContext.includes("pensando") || lowerContext.includes("analisando") || lowerContext.includes("refletindo")) {
    return visionExpressions.vision_08; // Pensativo
  }
  
  if (lowerContext.includes("brincadeira") || lowerContext.includes("piada") || lowerContext.includes("divertido")) {
    return visionExpressions.vision_09; // Brincalhão
  }
  
  if (lowerContext.includes("confuso") || lowerContext.includes("não entendi") || lowerContext.includes("esclarecer")) {
    return visionExpressions.vision_10; // Confuso
  }
  
  if (lowerContext.includes("determinado") || lowerContext.includes("foco") || lowerContext.includes("objetivo")) {
    return visionExpressions.vision_11; // Determinado
  }
  
  if (lowerContext.includes("ouvindo") || lowerContext.includes("comando") || currentState === "listening") {
    return visionExpressions.vision_04; // Atento
  }
  
  if (lowerContext.includes("completado") || lowerContext.includes("realizado")) {
    return visionExpressions.vision_03; // Confiante
  }
  
  if (lowerContext.includes("surpresa") || lowerContext.includes("novo") || lowerContext.includes("incrível")) {
    return visionExpressions.vision_02; // Surpreso
  }
  
  if (lowerContext.includes("amor") || lowerContext.includes("carinho") || lowerContext.includes("obrigado")) {
    return visionExpressions.vision_07; // Carinhoso
  }
  
  // Modo noturno (22h-6h)
  if (timeOfDay >= 22 || timeOfDay <= 6) {
    return visionExpressions.vision_06; // Sonolento
  }
  
  // Default: sorriso amigável
  return visionExpressions.vision_01;
};