// SISTEMA DE MONITORAMENTO E ANALYTICS
import React, { useState, useEffect } from 'react';

class MonitoringService {
  constructor() {
    this.metrics = new Map();
    this.events = [];
    this.startTime = performance.now();
  }

  // Métricas de performance
  trackPerformance(label, value) {
    const metric = {
      label,
      value,
      timestamp: Date.now(),
      sessionId: this.getSessionId()
    };
    
    this.metrics.set(label, metric);
    
    // Enviar para analytics em produção
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics('performance', metric);
    } else {
      console.log('📊 Métrica:', metric);
    }
  }

  // Eventos de usuário
  trackEvent(event, properties = {}) {
    const eventData = {
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        sessionId: this.getSessionId(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    };
    
    this.events.push(eventData);
    
    // Manter apenas os últimos 100 eventos na memória
    if (this.events.length > 100) {
      this.events = this.events.slice(-100);
    }
    
    this.sendToAnalytics('event', eventData);
  }

  // Erros de aplicação
  trackError(error, context = {}) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      url: window.location.href
    };
    
    this.sendToAnalytics('error', errorData);
    
    // Em produção, enviar para Sentry
    console.error('🚨 Erro monitorado:', errorData);
  }

  // Health check da aplicação
  healthCheck() {
    const health = {
      status: 'healthy',
      timestamp: Date.now(),
      uptime: performance.now() - this.startTime,
      memory: this.getMemoryUsage(),
      connectivity: navigator.onLine,
      sessionId: this.getSessionId()
    };
    
    // Verificar métricas críticas
    if (health.memory > 100 * 1024 * 1024) { // 100MB
      health.status = 'warning';
      health.issues = ['high_memory_usage'];
    }
    
    return health;
  }

  // Métricas de negócio
  trackBusinessMetric(metric, value) {
    const businessMetrics = {
      user_registrations: () => this.trackEvent('user_registration'),
      agent_activations: () => this.trackEvent('agent_activation', { agent: value }),
      routine_executions: () => this.trackEvent('routine_execution', { routine: value }),
      plan_upgrades: () => this.trackEvent('plan_upgrade', { plan: value })
    };
    
    if (businessMetrics[metric]) {
      businessMetrics[metric]();
    }
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  getMemoryUsage() {
    if ('memory' in performance) {
      return performance.memory.usedJSHeapSize;
    }
    return 0;
  }

  sendToAnalytics(type, data) {
    // Em produção, enviar para Google Analytics, Mixpanel, etc.
    if (process.env.NODE_ENV === 'development') {
      console.log(`📈 Analytics [${type}]:`, data);
    }
    
    // Simular envio para API
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ type, data })
    // });
  }

  // Relatório de métricas
  generateReport() {
    const metrics = Array.from(this.metrics.values());
    const events = this.events.slice(-50); // Últimos 50 eventos
    const health = this.healthCheck();
    
    return {
      summary: {
        totalMetrics: metrics.length,
        totalEvents: events.length,
        health: health.status,
        uptime: health.uptime
      },
      metrics,
      events,
      health
    };
  }
}

// Instância global
export const monitoring = new MonitoringService();

// Hook para monitoramento
export function useMonitoring() {
  const trackEvent = (event, properties) => {
    monitoring.trackEvent(event, properties);
  };
  
  const trackPerformance = (label, value) => {
    monitoring.trackPerformance(label, value);
  };
  
  const trackError = (error, context) => {
    monitoring.trackError(error, context);
  };
  
  return { trackEvent, trackPerformance, trackError };
}