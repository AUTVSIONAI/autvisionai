
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { VisionCompanion } from "@/api/entities";
import { Routine } from "@/api/entities";
import { Agent } from "@/api/entities";
import { Tutorial } from "@/api/entities";
import { motion } from "framer-motion";
import VisionCore from "../components/vision/VisionCore";
import VisionLevelProgress from "../components/vision/VisionLevelProgress";
import ImmersiveVoiceMode from "../components/voice/ImmersiveVoiceMode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Clock, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { Link as RouterLink } from "react-router-dom";
import PurchasePlanModal from "../components/plans/PurchasePlanModal";
import { useToast } from "@/components/ui/toast";

export default function ClientDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [visionData, setVisionData] = useState(null);
  const [stats, setStats] = useState({ agents: 0, routines: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);

      let vision = await VisionCompanion.filter({ created_by: user.email });
      if (vision.length > 0) {
        setVisionData(vision[0]);
      } else {
        const newVision = await VisionCompanion.create({ name: "Meu Vision", created_by: user.email });
        setVisionData(newVision);
      }

      const agentList = await Agent.filter({ created_by: user.email });
      const routineList = await Routine.filter({ created_by: user.email });
      setStats({ agents: agentList.length, routines: routineList.length });

    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    }
    setIsLoading(false);
  };

  const handleInteraction = async (message) => {
    if (!visionData) return;
    try {
      const updatedVision = await VisionCompanion.update(visionData.id, {
        total_interactions: (visionData.total_interactions || 0) + 1,
        last_interaction: new Date().toISOString(),
      });
      setVisionData(updatedVision);
    } catch (error) {
      console.error("Erro ao atualizar interações:", error);
    }
  };

  const handleVisionUpdated = (updatedVision) => {
    setVisionData(updatedVision);
  };

  const handlePlanPurchased = (plan) => {
    loadDashboardData();
    setShowPlanModal(false);
  };

  const handleReplayTutorial = async () => {
    if (!currentUser) {
      toast.error("Usuário não encontrado. Não foi possível reiniciar o tutorial.");
      return;
    }

    toast.info("Reiniciando o tutorial...");

    try {
      const tutorialState = await Tutorial.filter({ created_by: currentUser.email });
      if (tutorialState.length > 0) {
        await Tutorial.update(tutorialState[0].id, {
          step: 0,
          completed: false,
          skipped: false,
        });
      } else {
        await Tutorial.create({ step: 0, created_by: currentUser.email });
      }

      // Força o recarregamento da página para que o Layout possa reavaliar e mostrar o tutorial
      window.location.reload();

    } catch (error) {
      console.error("Erro ao reiniciar o tutorial:", error);
      toast.error("Ocorreu um erro ao reiniciar o tutorial.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sua Vision Central...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Vision Core Column */}
      <motion.div
        className="lg:col-span-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VisionCore
          visionData={visionData}
          onInteraction={handleInteraction}
          onVoiceModeOpen={() => setIsVoiceModeOpen(true)}
          onVisionUpdated={handleVisionUpdated}
        />
      </motion.div>

      {/* Sidebar with Stats and Info */}
      <div className="space-y-8">
        {visionData && (
          <VisionLevelProgress visionData={visionData} onReplayTutorial={handleReplayTutorial} />
        )}

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="autvision-glass shadow-lg">
            <CardHeader>
              <CardTitle>Seu Ecossistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* BOTÃO DE UPGRADE SINCRONIZADO */}
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">Plano Atual</span>
                </div>
                <Button
                  onClick={() => setShowPlanModal(true)}
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Upgrade
                </Button>
              </div>

              {/* Wrapped with RouterLink */}
              <RouterLink to={createPageUrl("Agents")} className="block">
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Agentes Ativos</span>
                  </div>
                  <span className="font-bold text-lg">{stats.agents}</span>
                </div>
              </RouterLink>

              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Rotinas Programadas</span>
                </div>
                <span className="font-bold text-lg">{stats.routines}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-6 h-6" />
                Desbloqueie Todo o Potencial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Leve seu Vision para o próximo nível com mais agentes, rotinas e integrações.</p>
              <Button onClick={() => setShowPlanModal(true)} variant="secondary" className="w-full bg-white/90 text-blue-700 hover:bg-white">
                Ver Planos Premium
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Voice Mode Modal */}
      {isVoiceModeOpen && visionData && (
        <ImmersiveVoiceMode
          isOpen={isVoiceModeOpen}
          onClose={() => setIsVoiceModeOpen(false)}
          visionData={visionData}
        />
      )}

      {/* Plan Purchase Modal - SINCRONIZADO */}
      <PurchasePlanModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onPlanPurchased={handlePlanPurchased}
      />
    </div>
  );
}
