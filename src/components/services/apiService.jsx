import { VisionCompanion } from "@/api/entities";
import { Agent } from "@/api/entities";
import { Routine } from "@/api/entities";
import { Integration } from "@/api/entities";
import { Tutorial } from "@/api/entities";
import { User } from "@/api/entities";

// ======================================================
//             CAMADA DE SERVIÇO DE API
// Este arquivo centraliza TODAS as chamadas de dados.
// Se o backend mudar, só precisamos alterar este local.
// ======================================================

// --- User Service ---
export const getCurrentUser = () => User.me().catch(() => ({ email: 'demo@autvision.com', full_name: 'Demo User', role: 'user' }));

// --- VisionCompanion Service ---
export const getVisions = () => VisionCompanion.list();
export const updateVision = (id, data) => VisionCompanion.update(id, data);

// --- Agent Service ---
export const getAgents = () => Agent.list();
export const updateAgent = (id, data) => Agent.update(id, data);

// --- Routine Service ---
export const getRoutines = () => Routine.list();

// --- Integration Service ---
export const getIntegrations = () => Integration.list();

// --- Tutorial Service ---
export const getTutorials = () => Tutorial.list();
export const createTutorial = (data) => Tutorial.create(data);
export const updateTutorial = (id, data) => Tutorial.update(id, data);

// Função agregadora para o Dashboard do Cliente
export const getClientDashboardData = () => {
  return Promise.all([
    getCurrentUser(),
    getVisions(),
    getAgents(),
    getRoutines(),
    getIntegrations(),
    getTutorials()
  ]);
};