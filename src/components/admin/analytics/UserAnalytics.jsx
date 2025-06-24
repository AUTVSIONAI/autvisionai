import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Activity, Clock, MapPin } from "lucide-react";

export default function UserAnalytics({ analyticsData, users }) {
  const getUserStats = () => {
    const loginEvents = analyticsData.filter(a => a.event_type === 'user_login');
    const uniqueUsers = [...new Set(loginEvents.map(a => a.user_email))];
    
    const userActivity = users.map(user => {
      const userLogins = loginEvents.filter(a => a.user_email === user.email);
      const lastLogin = userLogins.length > 0 ? 
        new Date(Math.max(...userLogins.map(l => new Date(l.created_date)))) : null;
      
      return {
        ...user,
        loginCount: userLogins.length,
        lastLogin,
        isActive: lastLogin && (Date.now() - lastLogin.getTime()) < 24 * 60 * 60 * 1000
      };
    });

    return userActivity.sort((a, b) => b.loginCount - a.loginCount);
  };

  const userStats = getUserStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Usuários Únicos</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Usuários Ativos</p>
                <p className="text-2xl font-bold text-white">
                  {userStats.filter(u => u.isActive).length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Sessões Hoje</p>
                <p className="text-2xl font-bold text-white">
                  {analyticsData.filter(a => 
                    a.event_type === 'user_login' && 
                    new Date(a.created_date).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Taxa Retenção</p>
                <p className="text-2xl font-bold text-white">78%</p>
              </div>
              <MapPin className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Activity Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Atividade dos Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-white">Usuário</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Logins</TableHead>
                  <TableHead className="text-white">Último Acesso</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userStats.slice(0, 10).map(user => (
                  <TableRow key={user.id} className="border-gray-700 hover:bg-gray-700/50">
                    <TableCell className="font-medium text-white">{user.full_name}</TableCell>
                    <TableCell className="text-gray-300">{user.email}</TableCell>
                    <TableCell className="text-gray-300">{user.loginCount}</TableCell>
                    <TableCell className="text-gray-300">
                      {user.lastLogin ? user.lastLogin.toLocaleDateString('pt-BR') : 'Nunca'}
                    </TableCell>
                    <TableCell>
                      <Badge className={user.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                        {user.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}