-- Adiciona a coluna active_time_seconds na tabela de usuários
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS active_time_seconds INTEGER DEFAULT 0;

-- Cria a função RPC para incrementar o tempo de forma segura
CREATE OR REPLACE FUNCTION increment_active_time(seconds_to_add integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.users
  SET active_time_seconds = active_time_seconds + seconds_to_add
  WHERE id = auth.uid()::text;
END;
$$;

-- Concede permissão para usuários autenticados executarem a função
GRANT EXECUTE ON FUNCTION increment_active_time(integer) TO authenticated;
