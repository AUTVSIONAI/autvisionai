// PROGRESSO E GAMIFICAÇÃO DO VISION - SISTEMA EVOLUÍDO
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Sparkles, 
  Target, 
  HelpCircle, 
  Crown,
  Zap,
  Award,
  Star
} from "lucide-react";

export default function VisionLevelProgress({ visionData, onReplayTutorial }) {
  const currentLevel = visionData?.learning_level || 1;
  const interactions = visionData?.total_interactions || 0;
  
  // SISTEMA DE NÍVEIS MELHORADO
  const getXPForLevel = (level) => {
    return Math.pow(level, 2) * 100; // Progressão exponencial
  };
  
  const xpForCurrentLevel = getXPForLevel(currentLevel);
  const xpForNextLevel = getXPForLevel(currentLevel + 1);
  const currentXP = interactions * 10; // 10 XP por interação
  
  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = Math.min((xpInCurrentLevel / xpNeededForNext) * 100, 100);

  // CALCULAR RANK BASEADO NO NÍVEL
  const getRank = (level) => {
    if (level >= 50) return { name: "Mestre Vision", color: "from-purple-500 to-pink-500", icon: Crown };
    if (level >= 25) return { name: "Vision Avançado", color: "from-yellow-500 to-orange-500", icon: Award };
    if (level >= 10) return { name: "Vision Experiente", color: "from-blue-500 to-cyan-500", icon: Star };
    if (level >= 5) return { name: "Vision Iniciante", color: "from-green-500 to-emerald-500", icon: Zap };
    return { name: "Vision Novato", color: "from-gray-500 to-gray-600", icon: Sparkles };
  };

  const currentRank = getRank(currentLevel);
  const nextRank = getRank(currentLevel + 1);
  const RankIcon = currentRank.icon;

  // CALCULAR CONQUISTAS
  const achievements = [
    { 
      id: 'first_chat', 
      name: 'Primeira Conversa', 
      achieved: interactions >= 1,
      icon: '💬',
      description: 'Teve sua primeira conversa com o Vision'
    },
    { 
      id: 'chatty', 
      name: 'Conversador', 
      achieved: interactions >= 50,
      icon: '🗣️',
      description: 'Teve 50 conversas com o Vision'
    },
    { 
      id: 'expert', 
      name: 'Expert', 
      achieved: interactions >= 200,
      icon: '🎓',
      description: 'Teve 200 conversas com o Vision'
    },
    { 
      id: 'level_up', 
      name: 'Evoluído', 
      achieved: currentLevel >= 5,
      icon: '⬆️',
      description: 'Alcançou o nível 5'
    },
    { 
      id: 'master', 
      name: 'Mestre', 
      achieved: currentLevel >= 10,
      icon: '👑',
      description: 'Alcançou o nível 10'
    }
  ];

  const achievedCount = achievements.filter(a => a.achieved).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="autvision-glass shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <RankIcon className="w-6 h-6 text-purple-500" />
            Evolução do Vision
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nível e Rank */}
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${currentRank.color} text-white rounded-full mb-4`}>
              <RankIcon className="w-5 h-5" />
              <span className="font-bold">{currentRank.name}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              Nível {currentLevel}
            </div>
            <div className="text-sm text-gray-600">
              {currentXP.toLocaleString()} XP Total
            </div>
          </div>

          {/* Barra de Progresso */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <p className="text-sm font-medium text-gray-700">
                Próximo Nível ({currentLevel + 1})
              </p>
              <p className="text-sm font-semibold text-blue-600">
                {Math.floor(progressPercentage)}%
              </p>
            </div>
            <Progress 
              value={progressPercentage} 
              className="w-full h-3 [&>*]:bg-gradient-to-r [&>*]:from-blue-500 [&>*]:to-cyan-500" 
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              {xpInCurrentLevel.toLocaleString()} / {xpNeededForNext.toLocaleString()} XP para o próximo nível
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <TrendingUp className="w-5 h-5 mx-auto text-green-500 mb-1" />
              <p className="text-lg font-bold">{interactions}</p>
              <p className="text-xs text-gray-600">Interações</p>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <Target className="w-5 h-5 mx-auto text-orange-500 mb-1" />
              <p className="text-lg font-bold">{currentLevel + 1}</p>
              <p className="text-xs text-gray-600">Próximo Nível</p>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <Award className="w-5 h-5 mx-auto text-purple-500 mb-1" />
              <p className="text-lg font-bold">{achievedCount}</p>
              <p className="text-xs text-gray-600">Conquistas</p>
            </div>
          </div>

          {/* Próximo Rank */}
          {currentRank.name !== nextRank.name && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-2">Próximo Rank:</p>
                <div className="flex items-center justify-center gap-2">
                  <nextRank.icon className="w-5 h-5 text-purple-500" />
                  <span className="font-bold text-purple-700">{nextRank.name}</span>
                </div>
              </div>
            </div>
          )}

          {/* Conquistas Recentes */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Conquistas ({achievedCount}/{achievements.length})
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`relative text-center p-2 rounded-lg transition-all ${
                    achievement.achieved 
                      ? 'bg-green-100 border-2 border-green-300' 
                      : 'bg-gray-100 border-2 border-gray-200'
                  }`}
                  title={achievement.description}
                >
                  <div className={`text-2xl mb-1 ${achievement.achieved ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <p className={`text-xs font-medium ${
                    achievement.achieved ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {achievement.name}
                  </p>
                  {achievement.achieved && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-center text-xs text-gray-500 pt-2 border-t">
            Quanto mais você usa, mais inteligente seu Vision se torna.
          </p>
        </CardContent>
        <CardFooter className="pt-0">
          <Button 
            variant="outline" 
            className="w-full hover:bg-blue-50/80" 
            onClick={onReplayTutorial}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Rever Tutorial
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}