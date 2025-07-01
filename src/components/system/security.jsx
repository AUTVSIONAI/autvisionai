// SISTEMA DE SEGURANÇA ROBUSTO
class SecurityService {
  static encryptSensitiveData(data) {
    // Em produção, usar crypto-js ou similar
    if (typeof data !== 'string') {
      data = JSON.stringify(data);
    }
    
    // Simulação de criptografia (usar biblioteca real em produção)
    return btoa(data).split('').reverse().join('');
  }

  static decryptSensitiveData(encryptedData) {
    try {
      const decoded = encryptedData.split('').reverse().join('');
      return JSON.parse(atob(decoded));
    } catch {
      return null;
    }
  }

  static sanitizeApiKeys(obj) {
    const sensitiveKeys = ['api_key', 'secret', 'password', 'token', 'client_secret'];
    const cleaned = { ...obj };
    
    sensitiveKeys.forEach(key => {
      if (cleaned[key]) {
        cleaned[key] = '***';
      }
    });
    
    return cleaned;
  }

  static validateCSRF() {
    // Implementar validação CSRF em produção
    const token = document.querySelector('meta[name="csrf-token"]')?.content;
    return token || 'development-token';
  }

  static rateLimit(key, maxRequests = 100, timeWindow = 60000) {
    const now = Date.now();
    const requests = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
    
    // Limpar requests antigos
    const validRequests = requests.filter(time => now - time < timeWindow);
    
    if (validRequests.length >= maxRequests) {
      throw new Error('Rate limit exceeded. Tente novamente em alguns momentos.');
    }
    
    validRequests.push(now);
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify(validRequests));
    
    return true;
  }

  static validateFileUpload(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo não permitido');
    }
    
    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande (máximo 5MB)');
    }
    
    return true;
  }

  static generateSecureToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  }

  static checkPermission(user, action, resource) {
    // Sistema de permissões granulares
    const permissions = {
      admin: ['*'],
      user: ['read:own', 'update:own', 'create:own']
    };
    
    const userPerms = permissions[user.role] || [];
    
    if (userPerms.includes('*')) {
      return true;
    }
    
    const requiredPerm = `${action}:${resource}`;
    return userPerms.includes(requiredPerm) || userPerms.includes(`${action}:own`);
  }
}

export default SecurityService;