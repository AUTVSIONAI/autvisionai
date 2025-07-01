import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Zap, 
  Clock, 
  TrendingUp, 
  Target, 
  Trophy,
  Star,
  Calendar,
  BarChart3
} from 'lucide-react';

export default function GameStats({ user, compact = false }) {
  // CALCULAR PROGRESS PARA PRÓXIMO NÍVEL
  const currentXP = user?.currentXP || 0;
  const nextLevelXP = user?.nextLevelXP || 100;
  const progressPercent = (currentXP / nextLevelXP) * 100;

  // ESTATÍSTICAS MOCK (serão integradas com dados reais)
  const stats = {
    totalActions: user?.totalActions || 142,
    timeSaved: user?.timeSaved || '8h 30min',
    streak: user?.streak || 5,
    completedMissions: user?.completedMissions || 7,
    totalMissions: user?.totalMissions || 12,
    weeklyGoal: user?.weeklyGoal || 50,
    weeklyProgress: user?.weeklyProgress || 32
  };

  // CONQUISTAS BASEADAS NO NÍVEL
  const achievements = [
    { id: 1, name: 'Primeiro Contato', icon: '🎯', unlocked: user?.level >= 1 },
    { id: 2, name: 'Conversador', icon: '💬', unlocked: user?.level >= 2 },
    { id: 3, name: 'Automador', icon: '⚡', unlocked: user?.level >= 3 },
    { id: 4, name: 'Mestre IA', icon: '🧠', unlocked: user?.level >= 4 },
    { id: 5, name: 'Visionário', icon: '👑', unlocked: user?.level >= 5 }
  ];

  if (compact) {
    return (
      <div className="space-y-4">
        {/* XP PROGRESS */}
        <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-yellow-400 text-lg">
              <Crown className="w-5 h-5" />
              Progressão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white font-bold text-lg">Nível {user?.level || 1}</span>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                {currentXP} / {nextLevelXP} XP
              </Badge>
            </div>
            <Progress value={progressPercent} className="h-3 bg-gray-700" />
            <p className="text-yellow-300 text-sm text-center">
              {nextLevelXP - currentXP} XP para próximo nível!
            </p>
          </CardContent>
        </Card>

        {/* QUICK STATS */}
        <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm">Ações</span>
                </div>
                <p className="text-white font-bold text-lg">{stats.totalActions}</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">Tempo Economizado</span>
                </div>
                <p className="text-white font-bold text-lg">{stats.timeSaved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* STREAK */}
        <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-medium">Sequência</span>
            </div>
            <p className="text-white font-bold text-2xl">{stats.streak}</p>
            <p className="text-purple-300 text-sm">dias consecutivos</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">Estatísticas do Jogador</h2>
      </div>

      {/* LEVEL PROGRESS */}
      <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-400">
            <Crown className="w-5 h-5" />
            Progressão de Nível
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-bold text-2xl">Nível {user?.level || 1}</h3>
              <p className="text-yellow-300">
                {progressPercent >= 100 ? 'Pronto para evoluir!' : `${Math.floor(progressPercent)}% para próximo nível`}
              </p>
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-lg px-4 py-2">
              {currentXP} / {nextLevelXP} XP
            </Badge>
          </div>
          
          <Progress value={progressPercent} className="h-4 bg-gray-700" />
          
          {progressPercent < 100 && (
            <p className="text-yellow-200 text-center">
              <strong>{nextLevelXP - currentXP} XP</strong> restantes para o próximo nível!
            </p>
          )}
        </CardContent>
      </Card>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* TOTAL ACTIONS */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-6 border border-blue-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-blue-400 font-medium">Total de Ações</h3>
          </div>
          <p className="text-white font-bold text-3xl">{stats.totalActions}</p>
          <p className="text-blue-300 text-sm mt-1">comandos executados</p>
        </motion.div>

        {/* TIME SAVED */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-green-900/50 to-green-800/50 rounded-xl p-6 border border-green-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-green-400 font-medium">Tempo Economizado</h3>
          </div>
          <p className="text-white font-bold text-3xl">{stats.timeSaved}</p>
          <p className="text-green-300 text-sm mt-1">automação total</p>
        </motion.div>

        {/* STREAK */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-purple-400 font-medium">Sequência</h3>
          </div>
          <p className="text-white font-bold text-3xl">{stats.streak}</p>
          <p className="text-purple-300 text-sm mt-1">dias consecutivos</p>
        </motion.div>
      </div>

      {/* MISSIONS PROGRESS */}
      <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-400">
            <Target className="w-5 h-5" />
            Progresso de Missões
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Missões Completadas</span>
            <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
              {stats.completedMissions} / {stats.totalMissions}
            </Badge>
          </div>
          <Progress 
            value={(stats.completedMissions / stats.totalMissions) * 100} 
            className="h-3 bg-gray-700" 
          />
          
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Meta Semanal</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {stats.weeklyProgress} / {stats.weeklyGoal}
            </Badge>
          </div>
          <Progress 
            value={(stats.weeklyProgress / stats.weeklyGoal) * 100} 
            className="h-3 bg-gray-700" 
          />
        </CardContent>
      </Card>

      {/* ACHIEVEMENTS */}
      <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-400">
            <Trophy className="w-5 h-5" />
            Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.1 }}
                className={`text-center p-4 rounded-lg border transition-all ${
                  achievement.unlocked
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    : 'bg-gray-800/50 border-gray-600/50 text-gray-500'
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className="text-sm font-medium">{achievement.name}</p>
                {achievement.unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-2"
                  >
                    <Star className="w-4 h-4 mx-auto text-amber-400" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PERFORMANCE CHART */}
      <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <TrendingUp className="w-5 h-5" />
            Performance da Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* MOCK WEEKLY DATA */}
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => {
              const activity = Math.floor(Math.random() * 20) + 5; // Mock data
              return (
                <div key={day} className="flex items-center gap-4">
                  <span className="text-cyan-300 w-8 text-sm">{day}</span>
                  <div className="flex-1 bg-gray-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(activity / 25) * 100}%` }}
                      transition={{ delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    />
                  </div>
                  <span className="text-white text-sm w-12">{activity}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

GameStats.propTypes = {
  user: PropTypes.shape({
    level: PropTypes.number,
    currentXP: PropTypes.number,
    nextLevelXP: PropTypes.number,
    totalActions: PropTypes.number,
    timeSaved: PropTypes.string,
    streak: PropTypes.number,
    completedMissions: PropTypes.number,
    totalMissions: PropTypes.number,
    weeklyGoal: PropTypes.number,
    weeklyProgress: PropTypes.number
  }),
  compact: PropTypes.bool
};
