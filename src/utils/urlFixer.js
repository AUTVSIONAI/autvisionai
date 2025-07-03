/**
 * 🔧 URL FIXER DIRETO PARA SUPABASE
 * Intercepta requests do Supabase para corrigir URLs malformadas
 */

// Interceptar fetch global para corrigir URLs malformadas do Supabase
const originalFetch = window.fetch;

window.fetch = function(url, options) {
  // Se for uma URL do Supabase, verificar se tem :1 malformado
  if (typeof url === 'string' && url.includes('supabase.co')) {
    // Corrigir URLs malformadas com :1 no final
    const fixedUrl = url
      .replace(/(:1)(?=\s|$|&)/g, '') // Remove :1 seguido de espaço, fim da string ou &
      .replace(/order=[^&]*:1/g, (match) => match.replace(':1', '')) // Remove :1 de order
      .replace(/eq\.[^&]*:1/g, (match) => match.replace(':1', '')) // Remove :1 de eq
      .replace(/&:1/g, '') // Remove &:1
      .replace(/:1$/g, ''); // Remove :1 no final
    
    if (fixedUrl !== url) {
      console.log('🔧 [URL-FIXER] URL corrigida:');
      console.log('❌ Original:', url);
      console.log('✅ Corrigida:', fixedUrl);
      url = fixedUrl;
    }
  }
  
  return originalFetch.call(this, url, options);
};

console.log('🔧 [URL-FIXER] Interceptor de URLs ativado - corrigindo queries malformadas do Supabase');

export default function initUrlFixer() {
  console.log('🔧 URL Fixer inicializado');
}
