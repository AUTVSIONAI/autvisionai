// SISTEMA DE VALIDAÇÃO ROBUSTO
import { useState, useMemo } from 'react';

// Esquemas de validação
const validationSchemas = {
  user: {
    full_name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-ZÀ-ÿ\s]+$/
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  },
  vision: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    personality_type: {
      required: true,
      enum: ['professional', 'friendly', 'casual', 'formal', 'creative']
    }
  },
  agent: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 30
    },
    type: {
      required: true,
      enum: ['communication', 'security', 'creative', 'social', 'automotive', 'home', 'emotional', 'marketing']
    }
  }
};

export function useValidation(schema) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = useMemo(() => {
    return (data) => {
      const newErrors = {};
      const schemaRules = validationSchemas[schema] || {};

      Object.keys(schemaRules).forEach(field => {
        const value = data[field];
        const rules = schemaRules[field];

        // Required
        if (rules.required && (!value || value.toString().trim() === '')) {
          newErrors[field] = 'Este campo é obrigatório';
          return;
        }

        if (value) {
          // MinLength
          if (rules.minLength && value.length < rules.minLength) {
            newErrors[field] = `Mínimo de ${rules.minLength} caracteres`;
            return;
          }

          // MaxLength
          if (rules.maxLength && value.length > rules.maxLength) {
            newErrors[field] = `Máximo de ${rules.maxLength} caracteres`;
            return;
          }

          // Pattern
          if (rules.pattern && !rules.pattern.test(value)) {
            newErrors[field] = 'Formato inválido';
            return;
          }

          // Enum
          if (rules.enum && !rules.enum.includes(value)) {
            newErrors[field] = 'Valor não permitido';
            return;
          }
        }
      });

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  }, [schema]);

  const validateField = (field, value) => {
    const schemaRules = validationSchemas[schema] || {};
    const rules = schemaRules[field];

    if (!rules) return true;

    const newErrors = { ...errors };

    // Required
    if (rules.required && (!value || value.toString().trim() === '')) {
      newErrors[field] = 'Este campo é obrigatório';
    }
    // Pattern validation, etc.
    else if (value && rules.pattern && !rules.pattern.test(value)) {
      newErrors[field] = 'Formato inválido';
    }
    else {
      delete newErrors[field];
    }

    setErrors(newErrors);
    return !newErrors[field];
  };

  const touch = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const reset = () => {
    setErrors({});
    setTouched({});
  };

  return {
    errors,
    touched,
    validate,
    validateField,
    touch,
    reset,
    isValid: Object.keys(errors).length === 0
  };
}

// Sanitização de dados
export function sanitizeInput(input, type = 'text') {
  if (typeof input !== 'string') return input;

  switch (type) {
    case 'html':
      return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    
    case 'sql':
      return input.replace(/['"\\;]/g, '');
    
    case 'email':
      return input.toLowerCase().trim();
    
    default:
      return input.trim();
  }
}