// GERENCIADOR DE ESTADO GLOBAL
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// TIPOS DE AÇÃO
const ActionTypes = {
  SET_USER: 'SET_USER',
  SET_VISION: 'SET_VISION',
  SET_AGENTS: 'SET_AGENTS',
  SET_ROUTINES: 'SET_ROUTINES',
  SET_INTEGRATIONS: 'SET_INTEGRATIONS',
  UPDATE_ENTITY: 'UPDATE_ENTITY',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SYNC_STATE: 'SYNC_STATE'
};

// ESTADO INICIAL
const initialState = {
  user: null,
  vision: null,
  agents: [],
  routines: [],
  integrations: [],
  loading: {},
  errors: {},
  lastSync: null
};

// REDUCER
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return { ...state, user: action.payload };
    
    case ActionTypes.SET_VISION:
      return { ...state, vision: action.payload };
    
    case ActionTypes.SET_AGENTS:
      return { ...state, agents: action.payload };
    
    case ActionTypes.SET_ROUTINES:
      return { ...state, routines: action.payload };
    
    case ActionTypes.SET_INTEGRATIONS:
      return { ...state, integrations: action.payload };
    
    case ActionTypes.UPDATE_ENTITY:
      const { entityType, entityId, updates } = action.payload;
      return {
        ...state,
        [entityType]: state[entityType].map(item =>
          item.id === entityId ? { ...item, ...updates } : item
        )
      };
    
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value }
      };
    
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        errors: { ...state.errors, [action.payload.key]: action.payload.value }
      };
    
    case ActionTypes.SYNC_STATE:
      return { ...state, lastSync: new Date().toISOString() };
    
    default:
      return state;
  }
}

// CONTEXTO
const AppStateContext = createContext();

// PROVIDER
export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // SINCRONIZAÇÃO AUTOMÁTICA
  useEffect(() => {
    const syncInterval = setInterval(() => {
      dispatch({ type: ActionTypes.SYNC_STATE });
    }, 30000); // 30 segundos

    return () => clearInterval(syncInterval);
  }, []);

  // AÇÕES
  const actions = {
    setUser: (user) => dispatch({ type: ActionTypes.SET_USER, payload: user }),
    setVision: (vision) => dispatch({ type: ActionTypes.SET_VISION, payload: vision }),
    setAgents: (agents) => dispatch({ type: ActionTypes.SET_AGENTS, payload: agents }),
    setRoutines: (routines) => dispatch({ type: ActionTypes.SET_ROUTINES, payload: routines }),
    setIntegrations: (integrations) => dispatch({ type: ActionTypes.SET_INTEGRATIONS, payload: integrations }),
    
    updateEntity: (entityType, entityId, updates) => 
      dispatch({ 
        type: ActionTypes.UPDATE_ENTITY, 
        payload: { entityType, entityId, updates } 
      }),
    
    setLoading: (key, value) => 
      dispatch({ 
        type: ActionTypes.SET_LOADING, 
        payload: { key, value } 
      }),
    
    setError: (key, value) => 
      dispatch({ 
        type: ActionTypes.SET_ERROR, 
        payload: { key, value } 
      })
  };

  return (
    <AppStateContext.Provider value={{ state, actions }}>
      {children}
    </AppStateContext.Provider>
  );
}

// HOOK
export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState deve ser usado dentro de AppStateProvider');
  }
  return context;
}