/**
 * 🏗️ TIPOS E INTERFACES - USERPROFILE
 * Definições TypeScript baseadas na estrutura oficial da tabela userprofile
 * 
 * Baseado em: ESTRUTURA_USERPROFILE_REFERENCIA.md
 * Última atualização: July 1, 2025
 */

// 🎯 Interface principal do UserProfile
export interface UserProfile {
  id: string                        // UUID - Referência para auth.users
  email: string                     // VARCHAR(255) - Único, obrigatório
  display_name?: string             // VARCHAR(100) - Default: 'Usuário Vision'
  full_name?: string               // VARCHAR(100) - Default: 'Usuário Vision'
  role?: UserRole                   // VARCHAR(20) - Default: 'user'
  plan_id?: string                 // UUID - Referência para planos
  tokens?: number                   // INTEGER - Default: 100
  xp?: number                      // INTEGER - Default: 0
  level?: number                   // INTEGER - Default: 1
  completed_mission_ids?: string[]  // TEXT[] - Default: '{}'
  earned_badge_ids?: string[]      // TEXT[] - Default: '{}'
  streak?: number                  // INTEGER - Default: 0
  daily_login_streak?: number      // INTEGER - Default: 0
  total_interactions?: number      // INTEGER - Default: 0
  last_login?: string              // TIMESTAMP WITH TIME ZONE
  created_date?: string            // TIMESTAMP WITH TIME ZONE
  created_at?: string              // TIMESTAMP WITH TIME ZONE
  updated_at?: string              // TIMESTAMP WITH TIME ZONE
}

// 🔐 Enum para roles
export type UserRole = 'user' | 'admin' | 'moderator' | 'premium'

// 📝 Interface para criação de novo perfil
export interface CreateUserProfileData {
  id: string                       // Obrigatório
  email: string                    // Obrigatório
  display_name?: string           // Opcional
  full_name?: string              // Opcional
  role?: UserRole                 // Opcional
}

// ✏️ Interface para atualização de perfil
export interface UpdateUserProfileData {
  display_name?: string
  full_name?: string
  role?: UserRole
  plan_id?: string
  tokens?: number
  xp?: number
  level?: number
  completed_mission_ids?: string[]
  earned_badge_ids?: string[]
  streak?: number
  daily_login_streak?: number
  total_interactions?: number
  last_login?: string
}

// 📊 Interface para estatísticas de gamificação
export interface UserGamificationStats {
  xp: number
  level: number
  tokens: number
  streak: number
  daily_login_streak: number
  total_interactions: number
  completed_missions_count: number
  earned_badges_count: number
}

// 🎮 Interface para progresso do usuário
export interface UserProgress {
  profile: UserProfile
  stats: UserGamificationStats
  last_activity: string
  is_active: boolean
}

// 🔍 Interface para filtros de busca
export interface UserProfileFilters {
  role?: UserRole
  min_level?: number
  max_level?: number
  min_xp?: number
  active_since?: string
  has_completed_missions?: boolean
  has_earned_badges?: boolean
}

// 📈 Interface para ranking/leaderboard
export interface UserRanking {
  position: number
  profile: Pick<UserProfile, 'id' | 'display_name' | 'xp' | 'level' | 'streak'>
  change_from_previous?: number
}

// 🏆 Interface para achievements/conquistas
export interface UserAchievement {
  badge_id: string
  earned_at: string
  mission_id?: string
  xp_earned: number
}

// 📱 Interface para dados do usuário no contexto
export interface AuthUser {
  profile: UserProfile
  session_info: {
    last_login: string
    is_authenticated: boolean
    token_expires_at?: string
  }
  permissions: {
    can_view_admin: boolean
    can_edit_users: boolean
    can_manage_system: boolean
  }
}

// 🔧 Interface para funções RPC
export interface CreateUserProfileParams {
  p_user_id: string
  p_email?: string
  p_display_name?: string
}

// 📋 Interface para resposta de lista paginada
export interface UserProfileListResponse {
  data: UserProfile[]
  total_count: number
  page: number
  page_size: number
  has_next_page: boolean
  has_previous_page: boolean
}

// ⚡ Interface para operações em batch
export interface BatchUpdateUserProfilesParams {
  user_ids: string[]
  updates: Partial<UpdateUserProfileData>
}

// 🎯 Default values para criação de perfil
export const DEFAULT_USER_PROFILE: Partial<UserProfile> = {
  display_name: 'Usuário Vision',
  full_name: 'Usuário Vision',
  role: 'user',
  tokens: 100,
  xp: 0,
  level: 1,
  completed_mission_ids: [],
  earned_badge_ids: [],
  streak: 0,
  daily_login_streak: 0,
  total_interactions: 0
}

// 📚 Type guards para validação
export const isValidUserRole = (role: string): role is UserRole => {
  return ['user', 'admin', 'moderator', 'premium'].includes(role)
}

export const isCompleteUserProfile = (profile: Partial<UserProfile>): profile is UserProfile => {
  return !!(profile.id && profile.email)
}

// 🔄 Utility types
export type UserProfilePublicFields = Pick<UserProfile, 
  'id' | 'display_name' | 'level' | 'xp' | 'streak' | 'created_at'
>

export type UserProfilePrivateFields = Pick<UserProfile, 
  'email' | 'role' | 'plan_id' | 'tokens' | 'last_login'
>

export type UserProfileAdminFields = UserProfile

// 📊 Interface para métricas administrativas
export interface UserProfileMetrics {
  total_users: number
  active_users_last_7_days: number
  active_users_last_30_days: number
  users_by_role: Record<UserRole, number>
  average_level: number
  average_xp: number
  top_streaks: number[]
}

/**
 * 🎯 EXEMPLOS DE USO:
 * 
 * // Criação de perfil
 * const newProfile: CreateUserProfileData = {
 *   id: user.id,
 *   email: user.email,
 *   display_name: 'João Silva'
 * }
 * 
 * // Atualização
 * const updates: UpdateUserProfileData = {
 *   xp: currentXP + 50,
 *   level: newLevel
 * }
 * 
 * // Uso no contexto
 * const authUser: AuthUser = {
 *   profile: userProfile,
 *   session_info: { ... },
 *   permissions: { ... }
 * }
 */
