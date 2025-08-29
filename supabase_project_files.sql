-- Tabela para arquivos de projetos
create table if not exists project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  filename text not null,
  content text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(project_id, filename)
);

-- Index para busca rápida
create index if not exists idx_project_files_project_id on project_files(project_id);

-- RLS: só donos e colaboradores podem acessar
alter table project_files enable row level security;

-- Permitir leitura para donos e colaboradores

create policy "Read project files" on project_files
  for select using (
    exists (
      select 1 from projects p
      where p.id = project_id
      and (p.owner_id = auth.uid() or auth.email() = any(p.collaborators))
    )
  );

-- Permitir insert/update/delete para donos e colaboradores

create policy "Modify project files" on project_files
  for all using (
    exists (
      select 1 from projects p
      where p.id = project_id
      and (p.owner_id = auth.uid() or auth.email() = any(p.collaborators))
    )
  );
