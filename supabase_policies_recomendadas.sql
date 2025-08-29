-- Policies recomendadas para colaboração segura

-- Tabela projects
alter table projects enable row level security;

-- Dono ou colaborador pode ler
create policy "Read projects" on projects
  for select using (
    owner_id = auth.uid() or auth.email() = any(collaborators)
  );

-- Dono pode atualizar
create policy "Owner can update" on projects
  for update using (
    owner_id = auth.uid()
  );

-- Dono pode deletar
create policy "Owner can delete" on projects
  for delete using (
    owner_id = auth.uid()
  );

-- Qualquer usuário autenticado pode criar projeto
create policy "Authenticated users can insert projects" on projects
  for insert with check (
    auth.uid() is not null
  );

-- Tabela project_files (já está no seu arquivo, mas para referência)
-- alter table project_files enable row level security;
-- create policy "Read project files" ...
-- create policy "Modify project files" ...

-- Adapte para outras tabelas conforme necessário (ex: project_chat, etc)
-- Exemplo para project_chat:
-- alter table project_chat enable row level security;
-- create policy "Read chat" on project_chat for select using (...);
-- create policy "Insert chat" on project_chat for insert with check (...);
-- create policy "Update chat" on project_chat for update using (...);
-- create policy "Delete chat" on project_chat for delete using (...);
