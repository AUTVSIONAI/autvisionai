
import { useState, useEffect, useCallback } from "react";
import { Routine } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Play,
  Sunrise,
  Moon,
  Coffee,
  Home as HomeIcon,
  Zap,
  Plus, // Changed from PlusCircle
  Edit,
  Trash2,
  Settings,
  GitBranch // For event trigger
} from "lucide-react";
import RoutineTemplates from "../components/routines/RoutineTemplates";

const routineIcons = {
  'Bom dia': Sunrise,
  'Boa noite': Moon,
  'Café da manhã': Coffee,
  'Chegada em casa': HomeIcon
};

export default function RoutinesPage() {
  const [routines, setRoutines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoutine, setNewRoutine] = useState({
    name: '',
    description: '',
    trigger_type: 'manual',
    trigger_value: '',
    actions: []
  });

  const loadRoutines = useCallback(async () => {
    setIsLoading(true);
    try {
      const routineList = await Routine.list();
      // Garantir que sempre seja um array
      if (Array.isArray(routineList)) {
        setRoutines(routineList);
      } else {
        console.warn('Routine.list não retornou array:', routineList);
        setRoutines([]);
      }
    } catch (error) {
      console.error("Erro ao carregar rotinas:", error);
      setRoutines([]); // Garantir que seja array mesmo em erro
    }
    setIsLoading(false);
  }, []); // Dependencies are stable setters, so empty array is fine.

  useEffect(() => {
    loadRoutines();
  }, [loadRoutines]);

  const handleToggleRoutine = async (routine) => {
    await Routine.update(routine.id, { is_active: !routine.is_active });
    await loadRoutines();
  };

  const handleExecuteRoutine = async (routine) => {
    await Routine.update(routine.id, {
      execution_count: (routine.execution_count || 0) + 1,
      last_executed: new Date().toISOString()
    });
    await loadRoutines();
  };

  const handleCreateRoutine = async () => {
    try {
      await Routine.create({
        ...newRoutine,
        is_active: true,
        execution_count: 0,
        created_at: new Date().toISOString()
      });
      setShowCreateForm(false);
      setNewRoutine({
        name: '',
        description: '',
        trigger_type: 'manual',
        trigger_value: '',
        actions: []
      });
      await loadRoutines();
    } catch (error) {
      console.error("Erro ao criar rotina:", error);
    }
  };

  const getTriggerIcon = (type) => {
    switch (type) {
      case 'time': return Clock;
      case 'voice': return Zap;
      case 'event': return GitBranch;
      case 'manual': return Settings; // For manual trigger
      default: return Settings;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">OPERAÇÃO RESTAURAR E AVANÇAR</h1>
                <p className="text-gray-300">Tutorial e Templates de Rotina</p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Nova Rotina
            </Button>
          </div>

          {/* Create Routine Form */}
          <AnimatePresence>
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-gray-800 border-gray-700 shadow-lg">
                  <CardHeader>
                    <CardTitle>Criar Nova Rotina</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="routine-name">Nome da Rotina</Label>
                      <Input
                        id="routine-name"
                        value={newRoutine.name}
                        onChange={(e) => setNewRoutine({...newRoutine, name: e.target.value})}
                        placeholder="Ex: Bom dia"
                      />
                    </div>
                    <div>
                      <Label htmlFor="routine-description">Descrição</Label>
                      <Input
                        id="routine-description"
                        value={newRoutine.description}
                        onChange={(e) => setNewRoutine({...newRoutine, description: e.target.value})}
                        placeholder="Descreva o que esta rotina faz"
                      />
                    </div>
                    <div>
                      <Label htmlFor="trigger-type">Tipo de Ativação</Label>
                      <Select
                        value={newRoutine.trigger_type}
                        onValueChange={(value) => setNewRoutine({...newRoutine, trigger_type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de ativação" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="time">Horário</SelectItem>
                          <SelectItem value="voice">Comando de Voz</SelectItem>
                          <SelectItem value="event">Evento</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {newRoutine.trigger_type !== 'manual' && (
                      <div>
                        <Label htmlFor="trigger-value">Valor do Trigger</Label>
                        <Input
                          id="trigger-value"
                          value={newRoutine.trigger_value}
                          onChange={(e) => setNewRoutine({...newRoutine, trigger_value: e.target.value})}
                          placeholder={
                            newRoutine.trigger_type === 'time' ? 'Ex: 07:00' :
                            newRoutine.trigger_type === 'voice' ? 'Ex: Bom dia Vision' :
                            'Ex: Chegada em casa'
                          }
                        />
                      </div>
                    )}
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleCreateRoutine} className="bg-orange-600 hover:bg-orange-700">
                        Criar Rotina
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateForm(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <RoutineTemplates onTemplateUsed={loadRoutines} />

          {/* Routines Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white">Suas Rotinas Criadas</h2>
            {isLoading ? (
              <p className="p-8 text-gray-400">Carregando rotinas...</p>
            ) : Array.isArray(routines) && routines.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Você ainda não tem nenhuma rotina. Use um template para começar!</p>
            ) : Array.isArray(routines) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {routines.map((routine, index) => {
                    const IconComponent = routineIcons[routine.name] || Zap;
                    const TriggerIconComponent = getTriggerIcon(routine.trigger_type);
                    return (
                      <motion.div
                        key={routine.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className={`overflow-hidden transition-all duration-300 h-full flex flex-col ${
                          routine.is_active
                            ? 'bg-gray-800 border-orange-500 shadow-lg'
                            : 'bg-gray-900 border-gray-700'
                        }`}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  routine.is_active
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                                    : 'bg-gray-700 text-gray-400'
                                }`}>
                                  <IconComponent className="w-5 h-5" />
                                </div>
                                <CardTitle className="text-lg font-bold text-white">
                                  {routine.name}
                                </CardTitle>
                              </div>
                              <Switch
                                checked={routine.is_active}
                                onCheckedChange={() => handleToggleRoutine(routine)}
                                className="data-[state=checked]:bg-orange-500"
                              />
                            </div>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <p className="text-gray-300 text-sm mb-4">
                              {routine.description}
                            </p>
                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                              <TriggerIconComponent className="w-3 h-3" />
                              {routine.trigger_type}: {routine.trigger_value}
                            </Badge>
                          </CardContent>
                          <CardFooter className="flex justify-between items-center bg-gray-800/50 border-t border-gray-600 pt-4">
                            <span className="text-xs text-gray-400">
                              {routine.actions?.length || 0} ações
                            </span>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                // onClick={() => handleEditRoutine(routine)} // Placeholder for edit functionality
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                // onClick={() => handleDeleteRoutine(routine.id)} // Placeholder for delete functionality
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExecuteRoutine(routine)}
                                disabled={!routine.is_active}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Executar
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Erro ao carregar rotinas.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
