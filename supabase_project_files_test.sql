-- Teste: inserir, atualizar e ler arquivos na tabela project_files

-- Substitua pelos seus próprios IDs válidos:
-- project_id: um id de projeto existente
-- user_id: o id do usuário logado (deve ser owner_id ou estar em collaborators)

insert into project_files (project_id, filename, content)
values ('d5e5f08e-82fb-4d04-a172-061e7beaa29c', 'teste.txt', 'Arquivo de teste');

update project_files set content = 'Arquivo atualizado!' where filename = 'teste.txt' and project_id = 'SEU_PROJECT_ID_AQUI';

select * from project_files where project_id = 'SEU_PROJECT_ID_AQUI';

delete from project_files where filename = 'teste.txt' and project_id = 'SEU_PROJECT_ID_AQUI';
