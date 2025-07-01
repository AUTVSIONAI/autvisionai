import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, CreditCard, Users } from "lucide-react";

export default function RevenueAnalytics() {
  // Mock data para demonstração
  const revenueData = {
    totalRevenue: 125430.50,
    monthlyRevenue: 23890.75,
    monthlyGrowth: 18.5,
    averageTicket: 89.90,
    totalTransactions: 1247,
    conversionRate: 12.3,
    churnRate: 3.2,
    ltv: 450.00
  };

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Receita Total</p>
                <p className="text-2xl font-bold text-green-400">
                  R$ {revenueData.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <Badge className="bg-green-500/20 text-green-400 mt-2">
                  +{revenueData.monthlyGrowth}% este mês
                </Badge>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Receita Mensal</p>
                <p className="text-2xl font-bold text-blue-400">
                  R$ {revenueData.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <Badge className="bg-blue-500/20 text-blue-400 mt-2">
                  Meta: R$ 25.000
                </Badge>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ticket Médio</p>
                <p className="text-2xl font-bold text-purple-400">
                  R$ {revenueData.averageTicket.toFixed(2)}
                </p>
                <Badge className="bg-purple-500/20 text-purple-400 mt-2">
                  +8.3% vs mês anterior
                </Badge>
              </div>
              <CreditCard className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">LTV Médio</p>
                <p className="text-2xl font-bold text-cyan-400">
                  R$ {revenueData.ltv.toFixed(2)}
                </p>
                <Badge className="bg-cyan-500/20 text-cyan-400 mt-2">
                  Lifetime Value
                </Badge>
              </div>
              <Users className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Evolução da Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Gráfico de evolução da receita</p>
                <p className="text-sm">Será implementado com recharts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Distribuição por Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Plano Gratuito</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '40%'}}></div>
                  </div>
                  <span className="text-sm text-gray-400">40%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Plano Premium</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '45%'}}></div>
                  </div>
                  <span className="text-sm text-gray-400">45%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Plano Enterprise</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '15%'}}></div>
                  </div>
                  <span className="text-sm text-gray-400">15%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Métricas Chave</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{revenueData.totalTransactions}</p>
              <p className="text-gray-400">Total Transações</p>
              <Badge className="bg-blue-500/20 text-blue-400 mt-2">+24.1%</Badge>
            </div>
            
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{revenueData.conversionRate}%</p>
              <p className="text-gray-400">Taxa Conversão</p>
              <Badge className="bg-green-500/20 text-green-400 mt-2">+2.3%</Badge>
            </div>
            
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{revenueData.churnRate}%</p>
              <p className="text-gray-400">Taxa Cancelamento</p>
              <Badge className="bg-yellow-500/20 text-yellow-400 mt-2">-0.8%</Badge>
            </div>
            
            <div className="text-center">
              <p className="text-3xl font-bold text-white">96.2%</p>
              <p className="text-gray-400">Taxa Satisfação</p>
              <Badge className="bg-green-500/20 text-green-400 mt-2">+1.5%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}