import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, CreditCard } from "lucide-react";

const mockStats = {
  totalRevenue: 125430.50,
  monthlyGrowth: 12.5,
  activeSubscriptions: 1248,
  averageTicket: 89.75
};

export default function RevenueOverview() {
  return (
    <div className="admin-full-width w-full max-w-none">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Receita Total</p>
              <p className="text-2xl font-bold text-white">
                R$ {mockStats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-green-400 mt-1">
                +{mockStats.monthlyGrowth}% este mês
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Crescimento Mensal</p>
              <p className="text-2xl font-bold text-white">+{mockStats.monthlyGrowth}%</p>
              <p className="text-xs text-blue-400 mt-1">vs mês anterior</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Assinaturas Ativas</p>
              <p className="text-2xl font-bold text-white">{mockStats.activeSubscriptions}</p>
              <p className="text-xs text-purple-400 mt-1">clientes recorrentes</p>
            </div>
            <Users className="w-8 h-8 text-purple-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Ticket Médio</p>
              <p className="text-2xl font-bold text-white">
                R$ {mockStats.averageTicket.toFixed(2)}
              </p>
              <p className="text-xs text-cyan-400 mt-1">por transação</p>
            </div>
            <CreditCard className="w-8 h-8 text-cyan-400" />
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}