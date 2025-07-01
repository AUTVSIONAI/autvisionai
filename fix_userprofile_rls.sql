-- =====================================================
-- CORRIGIR POLÍTICAS RLS PARA TABELA USERPROFILE
-- =====================================================

-- Habilitar RLS na tabela userprofile
ALTER TABLE public.userprofile ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas seu próprio perfil
CREATE POLICY "Usuários veem apenas seu próprio perfil" ON public.userprofile
    FOR SELECT USING (auth.uid() = id);

-- Política para permitir que usuários atualizem apenas seu próprio perfil
CREATE POLICY "Usuários atualizam apenas seu próprio perfil" ON public.userprofile
    FOR UPDATE USING (auth.uid() = id);

-- Política para permitir inserção de novos perfis (para novos usuários)
CREATE POLICY "Permitir inserção de novos perfis" ON public.userprofile
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para administradores (se necessário)
-- Descomente as linhas abaixo se houver necessidade de acesso admin
-- CREATE POLICY "Admins podem ver todos os perfis" ON public.userprofile
--     FOR ALL USING (auth.jwt() ->> 'email' = 'digitalinfluenceradm@gmail.com');

-- Verificar se as políticas foram criadas corretamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'userprofile';

-- Verificar se RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'userprofile';