import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Sparkles, Zap, Heart } from 'lucide-react';

const VISION_EXPRESSIONS = {
  neutro: '/assets/images/vision/vision-neutro.png',
  sorriso: '/assets/images/vision/vision-sorriso.png',
  atento: '/assets/images/vision/vision-atento.png',
  pensativo: '/assets/images/vision/vision-pensativo.png',
  confiante: '/assets/images/vision/vision-confiante.png',
  celebrando: '/assets/images/vision/vision-celebrando.png',
  brincalhao: '/assets/images/vision/vision-brincalhao.png',
  carinhoso: '/assets/images/vision/vision-carinhoso.png',
  surpreso: '/assets/images/vision/vision-surpreso.png'
};

const MOOD_CYCLES = [
  { expression: 'neutro', duration: 3000, particles: false },
  { expression: 'sorriso', duration: 2000, particles: true },
  { expression: 'atento', duration: 4000, particles: false },
  { expression: 'pensativo', duration: 3000, particles: false },
  { expression: 'confiante', duration: 2500, particles: true },
];

export default function FloatingVision({ onInteraction, isListening = false }) {
  const [currentExpression, setCurrentExpression] = useState('neutro');
  const [showParticles, setShowParticles] = useState(false);
  const [moodIndex, setMoodIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [eyeAnimation, setEyeAnimation] = useState(false);

  // Ciclo automático de expressões
  useEffect(() => {
    const timer = setInterval(() => {
      const currentMood = MOOD_CYCLES[moodIndex];
      setCurrentExpression(currentMood.expression);
      setShowParticles(currentMood.particles);
      setMoodIndex((prev) => (prev + 1) % MOOD_CYCLES.length);
    }, MOOD_CYCLES[moodIndex]?.duration || 3000);

    return () => clearInterval(timer);
  }, [moodIndex]);

  // Animação dos olhos
  useEffect(() => {
    const eyeTimer = setInterval(() => {
      setEyeAnimation(true);
      setTimeout(() => setEyeAnimation(false), 200);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(eyeTimer);
  }, []);

  // Expressões especiais baseadas em interações
  const handleUserInteraction = (type) => {
    switch (type) {
      case 'greeting':
        setCurrentExpression('sorriso');
        setShowParticles(true);
        break;
      case 'command':
        setCurrentExpression('atento');
        break;
      case 'success':
        setCurrentExpression('celebrando');
        setShowParticles(true);
        break;
      case 'thinking':
        setCurrentExpression('pensativo');
        break;
      default:
        setCurrentExpression('neutro');
    }
    
    if (onInteraction) onInteraction(type);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Partículas mágicas */}
      <AnimatePresence>
        {(showParticles || isListening) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                initial={{
                  x: 120,
                  y: 120,
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  x: 120 + Math.cos(i * 45 * Math.PI / 180) * (60 + Math.random() * 40),
                  y: 120 + Math.sin(i * 45 * Math.PI / 180) * (60 + Math.random() * 40),
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Anel de energia pulsante */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-blue-500 to-purple-600"
        animate={{
          scale: isListening ? [1, 1.1, 1] : [1, 1.02, 1],
          opacity: isListening ? [0.5, 0.8, 0.5] : [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: isListening ? 1 : 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: `conic-gradient(from 0deg, 
            rgba(59, 130, 246, 0.1), 
            rgba(139, 92, 246, 0.1), 
            rgba(59, 130, 246, 0.1))`,
          filter: 'blur(1px)'
        }}
      />

      {/* Avatar principal do Vision */}
      <motion.div
        className="relative w-48 h-48 cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => handleUserInteraction('greeting')}
        animate={{
          y: [0, -8, 0],
          scale: isHovered ? 1.05 : 1
        }}
        transition={{
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          },
          scale: {
            duration: 0.3
          }
        }}
      >
        {/* Halo de fundo */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Imagem do Vision */}
        <motion.img
          src={VISION_EXPRESSIONS[currentExpression]}
          alt="Vision AI"
          className="w-full h-full object-contain drop-shadow-2xl"
          animate={{
            filter: isListening ? 'brightness(1.2) saturate(1.3)' : 'brightness(1) saturate(1)'
          }}
          transition={{ duration: 0.3 }}
          onError={(e) => {
            console.error('Erro ao carregar imagem:', e.target.src);
            // Fallback para SVG inline se as imagens não carregarem
            e.target.style.display = 'none';
            // Criar um div com SVG como fallback
            const fallback = e.target.parentNode.querySelector('.vision-fallback') || document.createElement('div');
            fallback.className = 'vision-fallback w-full h-full flex items-center justify-center';
            fallback.innerHTML = `
              <div class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div class="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                  <div class="text-4xl">🤖</div>
                </div>
              </div>
            `;
            if (!e.target.parentNode.querySelector('.vision-fallback')) {
              e.target.parentNode.appendChild(fallback);
            }
          }}
        />

        {/* Indicador de escuta */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Volume2 className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Efeito de piscar dos olhos */}
        <AnimatePresence>
          {eyeAnimation && (
            <motion.div
              initial={{ scaleY: 1, opacity: 0 }}
              animate={{ scaleY: 0.1, opacity: 1 }}
              exit={{ scaleY: 1, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute top-16 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-gray-900/30 rounded-full"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Status e informações */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-6 text-center space-y-2"
      >
        <motion.h3
          className="text-xl font-bold text-white"
          animate={{
            color: isListening ? '#3B82F6' : '#FFFFFF'
          }}
        >
          Vision AI
        </motion.h3>
        
        <motion.p
          className="text-sm text-gray-400"
          animate={{
            color: isListening ? '#60A5FA' : '#9CA3AF'
          }}
        >
          {isListening ? 'Te escutando...' : 'Pronto para ajudar'}
        </motion.p>

        {/* Botões de interação */}
        <div className="flex gap-2 justify-center mt-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleUserInteraction('command')}
            className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-full border border-blue-500/30 text-blue-400 transition-colors"
          >
            <Zap className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleUserInteraction('success')}
            className="p-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-full border border-purple-500/30 text-purple-400 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleUserInteraction('greeting')}
            className="p-2 bg-pink-600/20 hover:bg-pink-600/30 rounded-full border border-pink-500/30 text-pink-400 transition-colors"
          >
            <Heart className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

FloatingVision.propTypes = {
  onInteraction: PropTypes.func,
  isListening: PropTypes.bool
};
