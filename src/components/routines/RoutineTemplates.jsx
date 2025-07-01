import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Routine } from '@/api/entities';
import { useToast } from "@/components/ui/toast";
import { Coffee, Briefcase, Zap, Plus } from 'lucide-react';

const templates = [
  {
    icon: Coffee,
    name: "Rotina Matinal",
    description: "Prepara seu dia com notícias, agenda e música.",
    config: {
      trigger_type: 'time',
      trigger_value: '07:00',
      actions: [{ agent_type: 'news', action: 'get_headlines' }, { agent_type: 'calendar', action: 'get_today_events' }]
    }
  },
  {
    icon: Briefcase,
    name: "Modo Foco",
    description: "Bloqueia distrações e toca uma playlist para concentrar.",
    config: {
      trigger_type: 'voice',
      trigger_value: 'Ativar modo foco',
      actions: [{ agent_type: 'notifications', action: 'set_dnd' }, { agent_type: 'music', action: 'play_focus_playlist' }]
    }
  },
  {
    icon: Zap,
    name: "Fim de Expediente",
    description: "Resume seu dia de trabalho e prepara para o descanso.",
    config: {
      trigger_type: 'time',
      trigger_value: '18:00',
      actions: [{ agent_type: 'email', action: 'summarize_unread' }, { agent_type: 'home', action: 'set_evening_scene' }]
    }
  }
];

export default function RoutineTemplates({ onTemplateUsed }) {
  const { toast } = useToast();

  const handleUseTemplate = async (template) => {
    try {
      await Routine.create({
        name: template.name,
        description: template.description,
        ...template.config
      });
      toast({ title: "Sucesso!", description: `Rotina "${template.name}" criada com sucesso!`});
      onTemplateUsed();
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao criar rotina a partir do template.", variant: "destructive" });
      console.error(error);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Comece com um Template</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="h-full flex flex-col">
              <CardContent className="p-6 flex-grow">
                <template.icon className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button className="w-full" onClick={() => handleUseTemplate(template)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Usar Template
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}