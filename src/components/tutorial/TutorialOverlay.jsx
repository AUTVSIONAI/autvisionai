import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowRight } from 'lucide-react';
import { visionExpressions } from '../vision/VisionExpressions';

const tutorialSteps = [
  {
    title: "Bem-vindo à AutVision!",
    description: "Olá! Eu sou seu Vision e vou te guiar pelos primeiros passos. Prepare-se para automatizar sua vida!",
    expression: visionExpressions.vision_01, // Sorriso amigável
    targetId: "vision-core"
  },
  {
    title: "Seu Assistente Pessoal",
    description: "Este sou eu! Posso conversar por voz, executar comandos e aprender com você. Vamos ser grandes parceiros!",
    expression: visionExpressions.vision_03, // Confiante
    targetId: "vision-core"
  },
  {
    title: "Crie Automações Inteligentes",
    description: "Na página de Rotinas você pode usar templates prontos para criar automações incríveis em segundos!",
    expression: visionExpressions.vision_02, // Surpreso/empolgado
    targetId: "routines-nav-link"
  },
  {
    title: "Agentes Especializados",
    description: "Posso me transformar em especialistas! Ative agentes de saúde, finanças, trabalho e muito mais.",
    expression: visionExpressions.vision_04, // Atento
    targetId: "agents-nav-link"
  },
  {
    title: "Pronto para Começar!",
    description: "Agora você sabe o básico! Explore, crie automações e vamos revolucionar sua produtividade juntos!",
    expression: visionExpressions.vision_07, // Carinhoso
    targetId: "profile-nav-link"
  }
];

export default function TutorialOverlay({ step, onNext, onSkip }) {
  const currentStep = tutorialSteps[step];

  if (!currentStep) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
        className="relative max-w-md w-full"
      >
        <Card className="bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-800 shadow-2xl shadow-blue-500/20 overflow-hidden">
          <CardContent className="p-0">
            {/* Vision Image Header */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 p-6 text-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/5 rounded-full translate-y-12 -translate-x-12"></div>
              
              {/* Vision Avatar */}
              <motion.div
                className="relative z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <img
                  src={currentStep.expression.image}
                  alt={currentStep.expression.name}
                  className="w-24 h-24 mx-auto object-contain filter drop-shadow-lg"
                />
                <motion.div
                  className="mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1 border border-blue-200 dark:border-blue-700">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Vision Online</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {currentStep.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {currentStep.description}
                </p>
                
                {/* Progress indicator */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === step
                          ? 'bg-blue-500 scale-125'
                          : index < step
                          ? 'bg-blue-300'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={onNext}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6"
                  >
                    {step === tutorialSteps.length - 1 ? "Finalizar" : "Próximo"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
        
        {/* Skip button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onSkip}
          className="absolute top-2 right-2 text-white hover:text-gray-200 hover:bg-white/10 backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
}