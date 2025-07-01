
// VISION AGENT - IMAGENS LOCAIS AUTVISION
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

// IMAGENS LOCAIS - AUTVISION
const agentImages = {
  vision: "/assets/images/vision/vision.PNG", // Imagem sem fundo correta
  visionImmersive: "/assets/images/vision/modoimersivo.PNG",
  visionCommander: "/assets/images/vision/vision.PNG",
  // AGENTES AUTVISION
  echo: "/assets/images/agents/agent-Echo.jpeg",
  guardian: "/assets/images/agents/agent-Guardian.jpeg",
  nova: "/assets/images/agents/agent-Nova.jpeg",
  social: "/assets/images/agents/agent-Social.jpeg",
  auto: "/assets/images/agents/agent-Auto.jpeg",
  ada: "/assets/images/agents/agent-ADA.jpeg",
  friend: "/assets/images/agents/agent-Friend.jpeg",
  ads: "/assets/images/agents/agent-Ads.jpeg"
};

// SVG APENAS PARA VISION
const getVisorPosition = (type) => {
  if (type === "vision" || type === "visionCommander") {
    return {
      width: '42%',
      height: '32%',
      top: '41%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }
  return null; // AGENTES NÃO TÊM SVG
};

// EXPRESSÕES APENAS PARA VISION - OLHOS GRANDES E AZUIS
const faceExpressions = {
  neutro: (
    <g>
      <ellipse cx="32" cy="30" rx="8" ry="12" fill="#00FFFF" opacity="1">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="68" cy="30" rx="8" ry="12" fill="#00FFFF" opacity="1">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <path d="M 35 58 Q 50 68 65 58" stroke="#00FFFF" strokeWidth="5" fill="none" opacity="0.9" strokeLinecap="round" />
    </g>
  ),
  feliz: (
    <g>
      <path d="M 24 20 Q 32 16 40 20" stroke="#00FFFF" strokeWidth="2.5" fill="none" opacity="0.9" strokeLinecap="round" />
      <path d="M 60 20 Q 68 16 76 20" stroke="#00FFFF" strokeWidth="2.5" fill="none" opacity="0.9" strokeLinecap="round" />
      <ellipse cx="32" cy="30" rx="9" ry="14" fill="#00FFFF" opacity="1">
        <animate attributeName="ry" values="14;16;14" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="68" cy="30" rx="9" ry="14" fill="#00FFFF" opacity="1">
        <animate attributeName="ry" values="14;16;14" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <path d="M 30 55 Q 50 72 70 55" stroke="#00FFFF" strokeWidth="6" fill="none" opacity="0.95" strokeLinecap="round">
        <animate attributeName="stroke-width" values="5;7;5" dur="2s" repeatCount="indefinite" />
      </path>
    </g>
  ),
  surpreso: (
    <g>
      <ellipse cx="32" cy="28" rx="10" ry="16" fill="#00FFFF" opacity="1">
        <animate attributeName="rx" values="9;11;9" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="68" cy="28" rx="10" ry="16" fill="#00FFFF" opacity="1">
        <animate attributeName="rx" values="9;11;9" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="50" cy="65" rx="8" ry="12" fill="none" stroke="#00FFFF" strokeWidth="4" opacity="0.9">
        <animate attributeName="ry" values="10;14;10" dur="1.5s" repeatCount="indefinite" />
      </ellipse>
    </g>
  ),
  falando: (
    <g>
      <ellipse cx="32" cy="30" rx="8" ry="12" fill="#00FFFF" opacity="1" />
      <ellipse cx="68" cy="30" rx="8" ry="12" fill="#00FFFF" opacity="1" />
      <ellipse cx="50" cy="62" rx="6" ry="8" fill="none" stroke="#00FFFF" strokeWidth="4" opacity="0.9">
        <animate attributeName="ry" values="6;12;6" dur="0.5s" repeatCount="indefinite" />
        <animate attributeName="rx" values="6;8;6" dur="0.5s" repeatCount="indefinite" />
      </ellipse>
    </g>
  ),
  pensando: (
    <g>
      <ellipse cx="32" cy="32" rx="7" ry="10" fill="#00FFFF" opacity="0.9">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="68" cy="32" rx="7" ry="10" fill="#00FFFF" opacity="0.9">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <path d="M 40 60 Q 50 65 60 60" stroke="#00FFFF" strokeWidth="3" fill="none" opacity="0.8" strokeLinecap="round" />
    </g>
  )
};

export default function ReactiveVisionAgent({ 
  type = "vision",
  expression = "neutro",
  size = 200,
  className = "",
  isActive = true,
  onClick,
  variant = "dashboard",
  context = "idle"
}) {
  const [currentExpression, setCurrentExpression] = useState(expression);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // EXPRESSÕES DINÂMICAS APENAS PARA VISION
    if (type === "vision") {
      switch (context) {
        case "listening":
          setCurrentExpression("surpreso");
          break;
        case "speaking":
          setCurrentExpression("falando");
          break;
        case "processing":
          setCurrentExpression("pensando");
          break;
        case "happy":
          setCurrentExpression("feliz");
          break;
        default:
          setCurrentExpression("neutro");
      }
    }
  }, [expression, context, type]);

  const getAgentImage = () => {
    if (type === "vision") {
      return variant === "immersive" ? agentImages.visionImmersive : agentImages.vision;
    }
    return agentImages[type] || agentImages.vision;
  };
  
  const agentImage = getAgentImage();
  const visorStyle = getVisorPosition(type);

  const handleImageError = () => {
    console.error(`Falha ao carregar imagem para agente: ${type}`);
    setImageError(true);
  };

  return (
    <motion.div
      className={`relative cursor-pointer select-none ${className}`}
      style={{ 
        width: size, 
        height: size,
        background: 'transparent'
      }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        y: isActive ? [0, -8, 0] : 0
      }}
      transition={{
        y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <div 
        className="relative w-full h-full" 
        style={{ 
          background: 'transparent',
          backdropFilter: 'none',
          boxShadow: 'none'
        }}
      >
        {!imageError ? (
          <img
            src={agentImage}
            alt={`${type} agent`}
            className="w-full h-full object-contain"
            style={{
              background: 'transparent',
              mixBlendMode: 'normal',
              filter: 'brightness(1.1) contrast(1.1) saturate(1.2) drop-shadow(0 8px 25px rgba(0,255,255,0.3))',
              imageRendering: 'crisp-edges'
            }}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          // FALLBACK PARA IMAGENS QUEBRADAS
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
            <div className="text-4xl font-bold text-gray-600">
              {type.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        
        {/* SVG APENAS PARA VISION */}
        {visorStyle && !imageError && (
          <div className="absolute" style={visorStyle}>
            <svg viewBox="0 0 100 80" className="w-full h-full">
              <AnimatePresence mode="wait">
                <motion.g
                  key={currentExpression}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                >
                  {faceExpressions[currentExpression] || faceExpressions['neutro']}
                </motion.g>
              </AnimatePresence>
            </svg>
          </div>
        )}

        {/* STATUS INDICATOR */}
        {isActive && (
          <motion.div
            className="absolute top-2 right-2"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-3 h-3 rounded-full bg-blue-400" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

ReactiveVisionAgent.propTypes = {
  type: PropTypes.string,
  expression: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  variant: PropTypes.string,
  context: PropTypes.string
};
