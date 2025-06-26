import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { Users, DollarSign } from 'lucide-react';

const monthlyRevenueData = [
  { name: 'Jan', Receita: 4000 }, { name: 'Fev', Receita: 3000 },
  { name: 'Mar', Receita: 5000 }, { name: 'Abr', Receita: 4500 },
  { name: 'Mai', Receita: 6000 }, { name: 'Jun', Receita: 5500 },
  { name: 'Jul', Receita: 7000 }, { name: 'Ago', Receita: 6500 },
  { name: 'Set', Receita: 7500 }, { name: 'Out', Receita: 8000 },
];

const newCustomersData = [
  { name: 'Sem 1', Clientes: 12 }, { name: 'Sem 2', Clientes: 19 },
  { name: 'Sem 3', Clientes: 15 }, { name: 'Sem 4', Clientes: 25 },
];

export default function FinancialCharts() {
  return (
    <div className="admin-full-width w-full max-w-none">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <DollarSign className="w-5 h-5 text-green-400" />
            Receita Mensal (Últimos 10 meses)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyRevenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" fontSize={12} stroke="#a0a0a0" />
              <YAxis fontSize={12} stroke="#a0a0a0" tickFormatter={(value) => `R$${value/1000}k`} />
              <Tooltip
                contentStyle={{ background: "rgba(30, 41, 59, 0.9)", border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '0.5rem' }}
                itemStyle={{ color: '#e5e7eb' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Area type="monotone" dataKey="Receita" stroke="#10b981" fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5 text-blue-400" />
            Aquisição de Novos Clientes (Mês Atual)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={newCustomersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" fontSize={12} stroke="#a0a0a0" />
              <YAxis fontSize={12} stroke="#a0a0a0" />
              <Tooltip
                contentStyle={{ background: "rgba(30, 41, 59, 0.9)", border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '0.5rem' }}
                itemStyle={{ color: '#e5e7eb' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Bar dataKey="Clientes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}