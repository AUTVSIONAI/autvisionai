// PAINEL ADMIN PARA GAMIFICAÇÃO - FALTAVA ESTE MÓDULO
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Target, 
  Users, 
  TrendingUp,
  Award,
  Plus,
  Crown,
  Zap,
  BarChart3
} from 'lucide-react';
import { useAdminData } from '../AdminDataContext';
import { Mission } from '@/api/entities';
import { Badge as BadgeEntity } from '@/api/entities';
import { XP_SYSTEM, DEFAULT_MISSIONS, DEFAULT_BADGES } from '../system/gamificationSystem';

export default function GamificationAdminPanel() {
  const { data, updateUsers } = useAdminData();
  const { users = [] } = data;
  
  const [missions, setMissions] = useState([]);
  const [badges, setBadges] = useState([]);
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [newMission, setNewMission] = useState({
    title: '',
    description: '',
    type: 'use_vision',
    goal: 1,
    xp_reward: 100,
    badge_reward_id: ''
  });

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    try {
      const [missionsList, badgesList] = await Promise.all([
        Mission.list(),
        BadgeEntity.list()
      ]);
      setMissions(missionsList);
      setBadges(badgesList);
    } catch (error) {
      console.error('Erro ao carregar dados de gamificação:', error);
    }
  };

  // ESTATÍSTICAS DE GAMIFICAÇÃO
  const gamificationStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => (u.xp || 0) > 0).length,
    averageXp: users.length > 0 ? (users.reduce((sum, u) => sum + (u.xp || 0), 0) / users.length).toFixed(0) : 0,
    topUser: users.reduce((max, user) => (user.xp || 0) > (max.xp || 0) ? user : max, {}),
    totalXpDistributed: users.reduce((sum, u) => sum + (u.xp || 0), 0),
    missionCompletions: users.reduce((sum, u) => sum + (u.completed_mission_ids?.length || 0), 0)
  };

  const createMission = async () => {
    try {
      await Mission.create(newMission);
      setNewMission({
        title: '',
        description: '',
        type: 'use_vision',
        goal: 1,
        xp_reward: 100,
        badge_reward_id: ''
      });
      setShowMissionForm(false);
      await loadGamificationData();
    } catch (error) {
      console.error('Erro ao criar missão:', error);
    }
  };

  const initializeDefaultMissions = async () => {
    try {
      for (const mission of DEFAULT_MISSIONS) {
        await Mission.create(mission);
      }
      for (const badge of DEFAULT_BADGES) {
        await BadgeEntity.create(badge);
      }
      await loadGamificationData();
    } catch (error) {
      console.error('Erro ao inicializar missões padrão:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Sistema de Gamificação</h1>
          <p className="text-gray-400">Gerencie XP, níveis, missões e conquistas dos usuários</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Usuários Ativos</p>
                <p className="text-2xl font-bold text-white">{gamificationStats.activeUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">XP Médio</p>
                <p className="text-2xl font-bold text-white">{gamificationStats.averageXp}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total XP</p>
                <p className="text-2xl font-bold text-white">{gamificationStats.totalXpDistributed}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Missões</p>
                <p className="text-2xl font-bold text-white">{missions.length}</p>
              </div>
              <Target className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Conquistas</p>
                <p className="text-2xl font-bold text-white">{badges.length}</p>
              </div>
              <Award className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Completadas</p>
                <p className="text-2xl font-bold text-white">{gamificationStats.missionCompletions}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
            <Users className="w-4 h-4 mr-2" />
            Progresso dos Usuários
          </TabsTrigger>
          <TabsTrigger value="missions" className="data-[state=active]:bg-purple-600">
            <Target className="w-4 h-4 mr-2" />
            Missões
          </TabsTrigger>
          <TabsTrigger value="badges" className="data-[state=active]:bg-yellow-600">
            <Award className="w-4 h-4 mr-2" />
            Conquistas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Progresso dos Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-white">Usuário</TableHead>
                    <TableHead className="text-white">Nível</TableHead>
                    <TableHead className="text-white">XP</TableHead>
                    <TableHead className="text-white">Progresso</TableHead>
                    <TableHead className="text-white">Missões</TableHead>
                    <TableHead className="text-white">Conquistas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => {
                    const level = XP_SYSTEM.calculateLevel(user.xp || 0);
                    const progress = XP_SYSTEM.getProgressToNext(user.xp || 0);
                    
                    return (
                      <TableRow key={user.id} className="border-gray-700">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {user.full_name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-medium">{user.full_name}</p>
                              <p className="text-gray-400 text-sm">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                            <Crown className="w-3 h-3 mr-1" />
                            Nível {level.level}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">{user.xp || 0} XP</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress value={progress.progress} className="h-2" />
                            <p className="text-xs text-gray-400">
                              {progress.nextLevel ? `${progress.needed} XP para nível ${progress.nextLevel.level}` : 'Nível máximo'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-white">{user.completed_mission_ids?.length || 0}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-white">{user.earned_badge_ids?.length || 0}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="missions">
          <div className="space-y-6">
            {/* Actions */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Gerenciar Missões</h3>
              <div className="flex gap-3">
                <Button onClick={initializeDefaultMissions} variant="outline" className="border-gray-600 text-white">
                  Carregar Padrões
                </Button>
                <Button onClick={() => setShowMissionForm(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Missão
                </Button>
              </div>
            </div>

            {/* Mission Form */}
            {showMissionForm && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Criar Nova Missão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Título da missão"
                      value={newMission.title}
                      onChange={(e) => setNewMission({...newMission, title: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <select
                      value={newMission.type}
                      onChange={(e) => setNewMission({...newMission, type: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
                    >
                      <option value="use_vision">Usar Vision</option>
                      <option value="create_routine">Criar Rotina</option>
                      <option value="create_agent">Criar Agente</option>
                      <option value="complete_profile">Completar Perfil</option>
                    </select>
                  </div>
                  <Input
                    placeholder="Descrição da missão"
                    value={newMission.description}
                    onChange={(e) => setNewMission({...newMission, description: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      placeholder="Meta (quantidade)"
                      value={newMission.goal}
                      onChange={(e) => setNewMission({...newMission, goal: parseInt(e.target.value)})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Input
                      type="number"
                      placeholder="Recompensa XP"
                      value={newMission.xp_reward}
                      onChange={(e) => setNewMission({...newMission, xp_reward: parseInt(e.target.value)})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={createMission} className="bg-green-600 hover:bg-green-700">
                      Criar Missão
                    </Button>
                    <Button onClick={() => setShowMissionForm(false)} variant="outline" className="border-gray-600 text-white">
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Missions List */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Missões Ativas ({missions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-white">Missão</TableHead>
                      <TableHead className="text-white">Tipo</TableHead>
                      <TableHead className="text-white">Meta</TableHead>
                      <TableHead className="text-white">XP</TableHead>
                      <TableHead className="text-white">Completadas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {missions.map(mission => (
                      <TableRow key={mission.id} className="border-gray-700">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{mission.title}</p>
                            <p className="text-gray-400 text-sm">{mission.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-gray-500 text-gray-300">
                            {mission.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">{mission.goal}</TableCell>
                        <TableCell>
                          <span className="text-yellow-400 font-medium">+{mission.xp_reward} XP</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-white">
                            {users.filter(u => u.completed_mission_ids?.includes(mission.id)).length}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="badges">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Sistema de Conquistas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map(badge => (
                  <div key={badge.id} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        badge.color === 'gold' ? 'bg-yellow-500' : 
                        badge.color === 'silver' ? 'bg-gray-400' : 'bg-amber-600'
                      }`}>
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{badge.name}</h4>
                        <p className="text-gray-400 text-sm">{badge.description}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {users.filter(u => u.earned_badge_ids?.includes(badge.id)).length} usuários conquistaram
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}