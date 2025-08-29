-- Adiciona o campo 'order' na tabela project_files para persistir a ordem dos arquivos
ALTER TABLE project_files ADD COLUMN "order" integer;

-- Atualiza todos os arquivos existentes para ter um valor de ordem sequencial
DO $$
DECLARE
  r RECORD;
  i INTEGER := 1;
BEGIN
  FOR r IN SELECT id FROM project_files ORDER BY created_at ASC LOOP
    UPDATE project_files SET "order" = i WHERE id = r.id;
    i := i + 1;
  END LOOP;
END $$;

-- Garante que a busca dos arquivos use o campo 'order'
-- (No código, basta usar .order('order', { ascending: true }))
