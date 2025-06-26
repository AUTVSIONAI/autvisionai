// 🧪 TESTE DIRETO DA TABELA PROFILES
// Execute este código no console do navegador para testar diretamente

console.log('🔍 Testando tabela profiles...')

// Importar supabase
import { supabase } from './src/lib/supabase.js'

// Testar se a tabela existe
const testTable = async () => {
  try {
    console.log('📋 Verificando estrutura da tabela profiles...')
    
    // Tentar buscar todos os profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(5)
    
    if (error) {
      console.error('❌ Erro ao acessar tabela profiles:', error)
      return
    }
    
    console.log('✅ Tabela profiles acessível!')
    console.log('📊 Dados existentes:', data)
    console.log('📈 Total de registros:', data?.length || 0)
    
    // Testar inserção
    const testUserId = 'test-' + Date.now()
    console.log('🧪 Testando inserção com userId:', testUserId)
    
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: testUserId,
        email: 'teste@exemplo.com',
        full_name: 'Teste Usuario',
        role: 'user',
        plan_id: 'starter',
        tokens: 100,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ Erro ao inserir teste:', insertError)
      console.log('📋 Detalhes do erro:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      })
    } else {
      console.log('✅ Inserção de teste funcionou:', insertData)
      
      // Remover o teste
      await supabase.from('profiles').delete().eq('id', testUserId)
      console.log('🗑️ Registro de teste removido')
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

testTable()
