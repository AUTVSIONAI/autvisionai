-- 🔍 VERIFICAÇÃO DE POLÍTICAS RLS NO SUPABASE
-- Execute estes comandos no SQL Editor do Supabase para diagnosticar problemas

-- 1. Verificar se RLS está habilitado nas tabelas
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'users');

-- 2. Verificar políticas existentes
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
AND tablename IN ('profiles', 'users');

-- 3. Verificar estrutura da tabela profiles
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 4. Verificar se a tabela users existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'users'
) as users_table_exists;

-- 5. Testar consulta simples em profiles (como usuário autenticado)
-- Esta consulta deve funcionar se as políticas RLS estiverem corretas
SELECT COUNT(*) as total_profiles FROM profiles;

-- 6. Verificar permissões da role 'anon'
SELECT 
  grantee,
  table_name,
  privilege_type
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'users')
AND grantee IN ('anon', 'authenticated', 'service_role');

-- COMANDOS PARA CORRIGIR PROBLEMAS COMUNS:

-- Se RLS não estiver habilitado em profiles:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política básica para leitura de perfis (usuários autenticados podem ver seus próprios perfis):
-- CREATE POLICY "Users can view own profile" ON profiles
--   FOR SELECT USING (auth.uid() = id);

-- Política para inserção de perfis:
-- CREATE POLICY "Users can insert own profile" ON profiles
--   FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para atualização de perfis:
-- CREATE POLICY "Users can update own profile" ON profiles
--   FOR UPDATE USING (auth.uid() = id);

-- Se a tabela users não existir e estiver causando erro 404, você pode:
-- 1. Criar a tabela users
-- 2. Ou remover as referências à tabela users do código

-- Para verificar logs de erro em tempo real:
-- SELECT * FROM pg_stat_statements WHERE query LIKE '%profiles%' ORDER BY last_exec_time DESC LIMIT 10;