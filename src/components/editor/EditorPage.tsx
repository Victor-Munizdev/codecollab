import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FileExplorer } from './FileExplorer';
import { CollaboratorsList } from './CollaboratorsList';
import { ChatPanel } from './ChatPanel';
import { EditorHeader } from './EditorHeader';
import { MultiCodeEditor } from './CodeEditor';
import { ExtensionsSidebar } from './ExtensionsSidebar';
import type { Project, User } from '@/types';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

type EditorPageProps = {
  project: Project;
  user: User;
  onBackToDashboard: () => void;
  onLogout: () => void;
};


const EditorPage = ({ project, user, onBackToDashboard, onLogout }: EditorPageProps) => {
  // Guardar instâncias do Monaco e Editor para passar para ExtensionsSidebar
  const [monacoInstance, setMonacoInstance] = useState<any>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  // Suporte a múltiplos arquivos abertos
  const [openFiles, setOpenFiles] = useState<{ filename: string; content: string; id: string }[]>([]);
  const [activeFile, setActiveFile] = useState<string>('');
  const [files, setFiles] = useState<{ filename: string; content: string; id: string }[]>([]);
  const [collaborators, setCollaborators] = useState<User[]>(Array.isArray(project.collaborators) ? project.collaborators : []);

  // Garante que project.collaborators nunca será null ao usar
  const safeCollaborators = Array.isArray(project.collaborators) ? project.collaborators : [];
  const [loadingFiles, setLoadingFiles] = useState(true);

  // Rastreia o tempo ativo no editor e salva no banco de dados
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const { error } = await supabase.rpc('increment_active_time', { seconds_to_add: 5 });
      if (error) {
        console.error('Error incrementing active time:', error);
      }
    }, 5000); // Atualiza a cada 5 segundos

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Buscar arquivos do projeto ao abrir
  useEffect(() => {
    const fetchFiles = async () => {
      setLoadingFiles(true);
      const { data, error } = await supabase
        .from('project_files')
        .select('id, filename, content, "order"')
        .eq('project_id', project.id)
        .order('order', { ascending: true });
      console.log('[EditorPage] fetchFiles result:', { data, error });
      if (error) {
        setFiles([]);
        setLoadingFiles(false);
        setErrorMsg('Erro ao buscar arquivos: ' + error.message);
        return;
      }
      const safeData = Array.isArray(data) ? data : [];
      setFiles(safeData);
      setLoadingFiles(false);
      setErrorMsg(undefined);
    };
    fetchFiles();
  }, [project.id]);

  // Atualiza arquivos abertos ao carregar arquivos do projeto, preservando abas abertas e ativa
  useEffect(() => {
    if (files.length === 0) {
      setOpenFiles([]);
      setActiveFile('');
      return;
    }
    setOpenFiles(prevOpenFiles => {
      // Atualiza o conteúdo dos arquivos abertos, mantendo apenas os que ainda existem
      const updated = prevOpenFiles
        .map(open => {
          const file = files.find(f => f.filename === open.filename);
          return file ? { ...file } : null;
        })
        .filter(Boolean) as typeof prevOpenFiles;
      // Se não houver nenhum aberto, abre o primeiro
      if (updated.length === 0) {
        setActiveFile(files[0].filename);
        return [files[0]];
      }
      // Se a aba ativa não existir mais, ativa a primeira
      if (!updated.some(f => f.filename === activeFile)) {
        setActiveFile(updated[0].filename);
      }
      return updated;
    });
  }, [files]);

  // CRUD de arquivos
  const handleFileSelect = (filename: string) => {
    setActiveFile(filename);
    // Se o arquivo não estiver aberto, abre ele
    if (!openFiles.some(f => f.filename === filename)) {
      const file = files.find(f => f.filename === filename);
      if (file) setOpenFiles(prev => [...prev, file]);
    }
  };

  const handleCodeChange = async (filename: string, newCode: string) => {
    setOpenFiles(prev => prev.map(f => f.filename === filename ? { ...f, content: newCode } : f));
    setFiles(prev => prev.map(f => f.filename === filename ? { ...f, content: newCode } : f));
    const file = files.find(f => f.filename === filename);
    if (!file) return;
    await supabase
      .from('project_files')
      .update({ content: newCode, updated_at: new Date().toISOString() })
      .eq('id', file.id);
  };

  const handleCreateFile = async (filename: string) => {
    if (!filename.trim()) return;
    if ((files ?? []).some(f => f.filename === filename)) return;
    const { data, error } = await supabase
      .from('project_files')
      .insert([{ project_id: project.id, filename, content: '' }])
      .select();
    if (!error && data && data[0]) {
      setFiles(prev => ([...(prev ?? []), data[0]]));
      setOpenFiles(prev => ([...prev, data[0]]));
      setActiveFile(filename);
    }
  };

  const handleDeleteFile = async (filename: string) => {
    const file = (files ?? []).find(f => f.filename === filename);
    if (!file) return;
    await supabase
      .from('project_files')
      .delete()
      .eq('id', file.id);
    const newFiles = (files ?? []).filter(f => f.filename !== filename);
    setFiles(newFiles);
    setOpenFiles(prev => prev.filter(f => f.filename !== filename));
    if (activeFile === filename) {
      if (newFiles.length > 0) {
        setActiveFile(newFiles[0].filename);
      } else {
        setActiveFile('');
      }
    }
  };

  // Colaboradores (mantém igual)
  useEffect(() => {
    const fetchCollaborators = async () => {
      const { data } = await supabase
        .from('projects')
        .select('collaborators')
  .eq('id', project.id)
        .single();
      if (data && Array.isArray(data.collaborators)) {
        setCollaborators(data.collaborators);
      } else {
        setCollaborators([]);
      }
    };
    fetchCollaborators();
    const channel = supabase.channel('public:projects-collaborators-' + project.id)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects', filter: `id=eq.${project.id}` }, (payload) => {
        fetchCollaborators();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [project.id]);

  console.log('DEBUG files', files);

  const [errorMsg, setErrorMsg] = useState<string|undefined>(undefined);
  if (loadingFiles) {
    return <div className="flex items-center justify-center h-full">Carregando arquivos...</div>;
  }
  if (errorMsg) {
    return <div className="flex items-center justify-center h-full text-red-500">{errorMsg}</div>;
  }

  const handleCollaboratorAdded = (newCollaborator: User) => {
    setCollaborators(prev => [...prev, newCollaborator]);
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <EditorHeader 
        project={project}
        user={user}
        onBackToDashboard={onBackToDashboard}
        onLogout={onLogout}
        monaco={monacoInstance}
        editorInstance={editorInstance}
        onCollaboratorAdded={handleCollaboratorAdded}
      />
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* File Explorer */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <FileExplorer
              files={files.map(f => f.filename)}
              selectedFile={activeFile}
              onFileSelect={handleFileSelect}
              onCreateFile={handleCreateFile}
              onDeleteFile={handleDeleteFile}
              onReorderFiles={async newOrder => {
                // Atualiza a ordem dos arquivos no estado
                setFiles(prev => newOrder.map(name => prev.find(f => f.filename === name)!).filter(Boolean));
                // Salva a ordem no banco
                const updates = newOrder.map((name, idx) => {
                  const file = files.find(f => f.filename === name);
                  return file ? { id: file.id, order: idx + 1 } : null;
                }).filter(Boolean);
                for (const upd of updates) {
                  await supabase.from('project_files').update({ order: upd.order }).eq('id', upd.id);
                }
              }}
              onRenameFile={async (oldName, newName) => {
                const file = files.find(f => f.filename === oldName);
                if (!file) return;
                await supabase
                  .from('project_files')
                  .update({ filename: newName })
                  .eq('id', file.id);
                setFiles(prev => prev.map(f => f.filename === oldName ? { ...f, filename: newName } : f));
                setOpenFiles(prev => prev.map(f => f.filename === oldName ? { ...f, filename: newName } : f));
                if (activeFile === oldName) setActiveFile(newName);
              }}
            />
          </ResizablePanel>
          <ResizableHandle />
          {/* Main Editor Area */}
          <ResizablePanel defaultSize={60}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={80}>
                <MultiCodeEditor
                  openFiles={openFiles.map(f => ({ filename: f.filename, code: f.content }))}
                  activeFile={activeFile}
                  onChangeFile={handleCodeChange}
                  onTabChange={setActiveFile}
                  onCloseTab={(filename) => {
                    setOpenFiles(prev => {
                      const filtered = prev.filter(f => f.filename !== filename);
                      if (activeFile === filename) {
                        if (filtered.length > 0) {
                          setActiveFile(filtered[filtered.length - 1].filename);
                        } else {
                          setActiveFile('');
                        }
                      }
                      return filtered;
                    });
                  }}
                  collaborators={collaborators}
                  onReorderTabs={newOrder => {
                    setOpenFiles(prev => {
                      // Garante que sempre retorna o objeto completo { filename, content, id }
                      return newOrder.map(tab => {
                        const found = prev.find(f => f.filename === tab.filename);
                        return found ? found : { filename: tab.filename, content: tab.code, id: '' };
                      });
                    });
                  }}
                  // Captura instâncias do Monaco e Editor para extensões
                  onEditorMount={(editor, monaco) => {
                    setEditorInstance(editor);
                    setMonacoInstance(monaco);
                  }}
                />
              </ResizablePanel>
              <ResizableHandle />
              {/* Chat Panel */}
              <ResizablePanel defaultSize={20} minSize={15}>
                <ChatPanel user={user} projectId={project.id} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle />
          {/* Collaborators Panel */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
            <CollaboratorsList
              collaborators={Array.isArray(collaborators) ? collaborators : []}
              currentUser={user}
              projectOwner={project.owner_email}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
export { EditorPage };