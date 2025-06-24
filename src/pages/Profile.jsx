
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/api/entities';
import { Mission } from '@/api/entities';
import { Badge as BadgeEntity } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award, Target, Check, HelpCircle, Zap, UserCheck, Swords } from 'lucide-react';

const iconComponents = {
  Zap,
  UserCheck,
  Swords,
  HelpCircle,
};

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [missions, setMissions] = useState([]);
  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [user, missionsList, badgesList] = await Promise.all([
          User.me(),
          Mission.list(),
          BadgeEntity.list()
        ]);
        setCurrentUser(user);
        setMissions(missionsList);
        setBadges(badgesList);
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const userLevel = Math.floor((currentUser?.xp || 0) / 500) + 1;
  const xpForNextLevel = (userLevel) * 500;
  const currentLevelXp = (currentUser?.xp || 0) % 500;
  const levelProgress = (currentLevelXp / 500) * 100;
  
  const earnedBadges = badges.filter(badge => currentUser?.earned_badge_ids?.includes(badge.id));

  const Icon = ({ name, ...props }) => {
    const LucideIcon = iconComponents[name];
    return LucideIcon ? <LucideIcon {...props} /> : <HelpCircle {...props} />;
  };

  return (
    <div className="space-y-8">
      {/* User Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-lg">
          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white">
              {currentUser?.full_name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">{currentUser?.full_name}</h1>
              <p className="text-gray-500">{currentUser?.email}</p>
              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <p className="font-semibold text-blue-600">Nível {userLevel}</p>
                  <p className="text-sm text-gray-500">{currentUser?.xp || 0} / {xpForNextLevel} XP</p>
                </div>
                <Progress value={levelProgress} className="[&>*]:bg-gradient-to-r [&>*]:from-blue-500 [&>*]:to-cyan-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Badges Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Award className="w-5 h-5 text-yellow-500" />Conquistas</CardTitle>
          </CardHeader>
          <CardContent>
            {earnedBadges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {earnedBadges.map(badge => (
                  <div key={badge.id} className="flex flex-col items-center text-center p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                    <Icon name={badge.icon} className={`w-10 h-10 mb-2 text-${badge.color}-500`} />
                    <p className="font-semibold text-sm">{badge.name}</p>
                    <p className="text-xs text-gray-500">{badge.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Complete missões para ganhar conquistas!</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Missions Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-green-500" />Missões</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {missions.map(mission => {
              const isCompleted = currentUser?.completed_mission_ids?.includes(mission.id);
              return (
                <div key={mission.id} className={`p-4 rounded-lg flex items-center gap-4 ${isCompleted ? 'bg-green-100 dark:bg-green-900/50' : 'bg-gray-100 dark:bg-gray-800/50'}`}>
                  <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}>
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${isCompleted ? 'line-through' : ''}`}>{mission.title}</p>
                    <p className="text-sm text-gray-500">{mission.description}</p>
                  </div>
                  <Badge variant={isCompleted ? 'default' : 'secondary'} className={isCompleted ? 'bg-green-600' : ''}>
                    {isCompleted ? 'Completo' : `${mission.xp_reward} XP`}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
