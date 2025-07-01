import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Clock, Bot, Plus, Edit, Trash2, Activity, CheckCircle } from "lucide-react";

export default function AdvancedRoutinesManagement({ routines = [], onToggle = () => {} }) {
  const [filter, setFilter] = useState('all');

  const getStatusBadge = (routine) => {
    if (routine.is_active) {
      return <Badge className="bg-green-500 text-white">Ativa</Badge>;
    }
    return <Badge className="bg-gray-500 text-white">Inativa</Badge>;
  };

  const filteredRoutines = routines.filter(routine => {
    if (filter === 'active') return routine.is_active;
    if (filter === 'inactive') return !routine.is_active;
    return true;
  });

  const stats = {
    total: routines.length,
    active: routines.filter(r => r.is_active).length,
    totalExecutions: routines.reduce((sum, r) => sum + (r.execution_count || 0), 0),
    avgExecution: routines.length > 0 ? (routines.reduce((sum, r) => sum + (r.execution_count || 0), 0) / routines.length).toFixed(1) : 0
  };

  return (
    <div className="admin-full-width space-y-6 w-full max-w-none overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-100">Gerenciamento de Rotinas</h1>
            <p className="text-gray-400 text-sm lg:text-base">Configure e monitore automações da plataforma</p>
          </div>
        </div>
        <div className="lg:ml-auto">
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
            <Plus className="w-5 h-5 mr-2" />
            Nova Rotina
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-400">Total de Rotinas</p>
                <p className="text-xl lg:text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Clock className="w-6 lg:w-8 h-6 lg:h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-400">Rotinas Ativas</p>
                <p className="text-xl lg:text-2xl font-bold text-white">{stats.active}</p>
              </div>
              <Activity className="w-6 lg:w-8 h-6 lg:h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-400">Total Execuções</p>
                <p className="text-xl lg:text-2xl font-bold text-white">{stats.totalExecutions}</p>
              </div>
              <CheckCircle className="w-6 lg:w-8 h-6 lg:h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-400">Média de Execuções</p>
                <p className="text-xl lg:text-2xl font-bold text-white">{stats.avgExecution}</p>
              </div>
              <Bot className="w-6 lg:w-8 h-6 lg:h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-blue-600' : 'border-gray-600 text-white hover:bg-gray-700'}
        >
          Todas ({stats.total})
        </Button>
        <Button 
          variant={filter === 'active' ? 'default' : 'outline'} 
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'bg-green-600' : 'border-gray-600 text-white hover:bg-gray-700'}
        >
          Ativas ({stats.active})
        </Button>
        <Button 
          variant={filter === 'inactive' ? 'default' : 'outline'} 
          onClick={() => setFilter('inactive')}
          className={filter === 'inactive' ? 'bg-gray-600' : 'border-gray-600 text-white hover:bg-gray-700'}
        >
          Inativas ({stats.total - stats.active})
        </Button>
      </div>

      {/* Routines Table */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 w-full">
        <CardHeader>
          <CardTitle className="text-white">Lista de Rotinas</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Nome</TableHead>
                <TableHead className="text-gray-300">Criador</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Execuções</TableHead>
                <TableHead className="text-gray-300">Última Execução</TableHead>
                <TableHead className="text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoutines.map((routine) => (
                <TableRow key={routine.id} className="border-gray-700 hover:bg-gray-800/50">
                  <TableCell className="text-white font-medium">{routine.name}</TableCell>
                  <TableCell className="text-gray-300">{routine.created_by}</TableCell>
                  <TableCell>{getStatusBadge(routine)}</TableCell>
                  <TableCell className="text-gray-300">{routine.execution_count || 0}</TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {routine.last_execution ? new Date(routine.last_execution).toLocaleString('pt-BR') : 'Nunca'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={routine.is_active}
                        onCheckedChange={() => onToggle(routine.id, routine.is_active)}
                        size="sm"
                      />
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-700">
                        <Edit className="w-3 h-3 text-yellow-400" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-700">
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredRoutines.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">Nenhuma rotina encontrada</h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' ? 'Crie sua primeira rotina para começar.' : `Nenhuma rotina ${filter === 'active' ? 'ativa' : 'inativa'} encontrada.`}
          </p>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500">
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeira Rotina
          </Button>
        </div>
      )}
    </div>
  );
}

AdvancedRoutinesManagement.propTypes = {
  routines: PropTypes.array,
  onToggle: PropTypes.func
};
