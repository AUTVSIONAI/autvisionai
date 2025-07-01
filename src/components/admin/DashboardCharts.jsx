
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area, CartesianGrid } from 'recharts';
import { motion } from "framer-motion";
import { Zap, TrendingUp, Users, DollarSign, Brain } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#14b8a6', '#0ea5e9'];

// Mock data
const userGrowthData = [
  { name: 'Jan', users: 12 }, { name: 'Fev', users: 19 },
  { name: 'Mar', users: 32 }, { name: 'Abr', users: 45 },
  { name: 'Mai', users: 68 }, { name: 'Jun', users: 82 },
];

export default function DashboardCharts({ agents, routines, users, plans }) {

  const getAgentUsageData = () => {
    return agents
      .filter(agent => agent.usage_count > 0)
      .map(agent => ({ name: agent.name.replace('Agente ', ''), uso: agent.usage_count }))
      .sort((a, b) => b.uso - a.uso);
  };

  const getRoutineUsageData = () => {
    return routines
      .filter(routine => routine.execution_count > 0)
      .map(routine => ({ name: routine.name, value: routine.execution_count }));
  };

  const getPlanDistributionData = () => {
    if (!users || !plans) return [];
    const planCounts = plans.map(plan => ({
      name: plan.name,
      value: users.filter(user => user.plan_id === plan.id).length,
    }));
    return planCounts.filter(p => p.value > 0);
  };

  const getVisionInteractionData = () => {
      // Mock data for Vision interactions
      return [
        { day: 'D-6', interactions: 120 }, { day: 'D-5', interactions: 150 },
        { day: 'D-4', interactions: 130 }, { day: 'D-3', interactions: 180 },
        { day: 'D-2', interactions: 210 }, { day: 'D-1', interactions: 190 },
        { day: 'Hoje', interactions: 250 },
      ];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Growth Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5 text-sky-400" />
              Crescimento de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" fontSize={12} stroke="#a0a0a0" />
                <YAxis fontSize={12} stroke="#a0a0a0" />
                <Tooltip contentStyle={{ background: "rgba(30, 41, 59, 0.8)", border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', color: '#e5e7eb' }} />
                <Line type="monotone" dataKey="users" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Plan Distribution Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <DollarSign className="w-5 h-5 text-green-400" />
              Distribuição de Planos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={getPlanDistributionData()} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} fill="#8884d8">
                  {getPlanDistributionData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(30, 41, 59, 0.8)", border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', color: '#e5e7eb' }} />
                <Legend iconSize={10} wrapperStyle={{ color: '#a0a0a0' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Agent Usage Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="w-5 h-5 text-indigo-400" />
              Uso de Agentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getAgentUsageData()}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="#a0a0a0" />
                <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#a0a0a0" />
                <Tooltip contentStyle={{ background: "rgba(30, 41, 59, 0.8)", border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', color: '#e5e7eb' }} />
                <Bar dataKey="uso" fill="url(#agentGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="agentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Vision Interactions Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Brain className="w-5 h-5 text-cyan-400" />
              Interações com Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getVisionInteractionData()}>
                    <defs>
                        <linearGradient id="interactionGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} stroke="#a0a0a0" />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#a0a0a0" />
                    <Tooltip contentStyle={{ background: "rgba(30, 41, 59, 0.8)", border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', color: '#e5e7eb' }} />
                    <Area type="monotone" dataKey="interactions" stroke="#22d3ee" fill="url(#interactionGradient)" />
                </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
