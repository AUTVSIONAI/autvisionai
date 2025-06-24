
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { 
  Clock, 
  Mic, 
  Calendar, 
  Hand, 
  Play, 
  Pause,
  TrendingUp,
  Zap,
  Sunrise,
  Moon,
  Coffee,
  Home as HomeIcon
} from "lucide-react";

const triggerIcons = {
  time: Clock,
  voice: Mic,
  event: Calendar,
  manual: Hand
};

const routineIcons = {
  'Bom dia': Sunrise,
  'Boa noite': Moon,
  'Café da manhã': Coffee,
  'Chegada em casa': HomeIcon
};

export default function RoutinesGrid({ routines, onToggleRoutine, onExecuteRoutine }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Suas Rotinas</h3>
        <p className="text-gray-600">Automatize seu dia a dia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routines?.map((routine, index) => {
          const TriggerIcon = triggerIcons[routine.trigger_type] || Zap;
          const RoutineIcon = routineIcons[routine.name] || Zap;
          
          return (
            <motion.div
              key={routine.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                routine.is_active 
                  ? 'bg-white border-orange-200 shadow-lg' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      routine.is_active 
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      <RoutineIcon className="w-6 h-6" />
                    </div>
                    <Switch
                      checked={routine.is_active}
                      onCheckedChange={() => onToggleRoutine?.(routine.id)}
                      className="data-[state=checked]:bg-orange-500"
                    />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 mt-3">
                    {routine.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {routine.description}
                  </p>

                  {/* Trigger info */}
                  <div className="flex items-center gap-2">
                    <TriggerIcon className="w-4 h-4 text-gray-500" />
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {routine.trigger_type}
                      </Badge>
                      {routine.trigger_value && (
                        <span className="text-xs text-gray-500">
                          {routine.trigger_value}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions count */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{routine.actions?.length || 0} ações</span>
                    {routine.execution_count > 0 && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span className="font-medium">{routine.execution_count}</span>
                      </div>
                    )}
                  </div>

                  {/* Manual execution button */}
                  {routine.is_active && (
                    <Button
                      onClick={() => onExecuteRoutine?.(routine.id)}
                      variant="outline"
                      size="sm"
                      className="w-full hover:bg-orange-50 hover:border-orange-300"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Executar Agora
                    </Button>
                  )}
                </CardContent>

                {/* Active glow effect */}
                {routine.is_active && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/5 to-amber-500/5 pointer-events-none"></div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
