/**
 * 🔧 SUPABASE URL FIXER - CORREÇÃO DE URLS MALFORMADAS
 * Middleware para corrigir URLs do Supabase com :1 malformado
 */

// Interceptar fetch global para corrigir URLs malformadas do Supabase
const originalFetch = window.fetch;

window.fetch = function(url, options = {}) {
  // Se for uma URL do Supabase
  if (typeof url === 'string' && url.includes('supabase.co')) {
    // Corrigir URLs malformadas com :1 no final
    let fixedUrl = url;
    
    // Padrões malformados a corrigir:
    // 1. order=created_at.desc:1 -> order=created_at.desc
    // 2. is_active=eq.true:1 -> is_active=eq.true  
    // 3. qualquer_campo:1 no final de query params
    fixedUrl = fixedUrl
      .replace(/([&?]order=[^&]*\.desc):1/g, '$1')
      .replace(/([&?]order=[^&]*\.asc):1/g, '$1')
      .replace(/([&?][^=]+=eq\.[^&]*):1/g, '$1')
      .replace(/([&?][^=]+=gte\.[^&]*):1/g, '$1')
      .replace(/([&?][^=]+=lte\.[^&]*):1/g, '$1')
      .replace(/([&?][^=]+=like\.[^&]*):1/g, '$1')
      .replace(/([&?][^=]+=ilike\.[^&]*):1/g, '$1')
      .replace(/([&?]limit=[0-9]+):1/g, '$1')
      .replace(/:1(&|$)/g, '$1'); // Remove :1 no final de qualquer parâmetro
    
    if (url !== fixedUrl) {
      console.log('🔧 [SUPABASE-FIXER] URL corrigida:');
      console.log('❌ Antes:', url);
      console.log('✅ Depois:', fixedUrl);
      
      // Adicionar parâmetro de debug para rastrear que foi corrigido
      if (fixedUrl.includes('?')) {
        fixedUrl += '&_fixed=1';
      } else {
        fixedUrl += '?_fixed=1';
      }
    }
    
    url = fixedUrl;
  }
  
  // Chamar fetch original com URL corrigida
  return originalFetch.call(this, url, options);
};

console.log('🔧 [SUPABASE-FIXER] Middleware de correção de URL ativado');

export default window.fetch;
