import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Save, Play, Settings, Users, Puzzle } from 'lucide-react';
import { ShareProjectDialog } from './ShareProjectDialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface EditorHeaderProps {
  project: Project;
  user: User;
  onBackToDashboard: () => void;
  onLogout: () => void;
  onCollaboratorAdded: (collaborator: User) => void;
}

export function EditorHeader({ project, user, onBackToDashboard, onLogout, monaco, editorInstance, onCollaboratorAdded }: EditorHeaderProps & { monaco?: any, editorInstance?: any }) {
  const [showExtensions, setShowExtensions] = React.useState(false);
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  const { toast } = useToast();

  const handleShareProject = async (email: string) => {
    // 1. Find the user by email in auth.users
    const { data: userData, error: userError } = await supabase
      .from('users') // Querying the public.users table
      .select('id, email, name')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      toast({
        title: "Erro ao convidar",
        description: "Usuário não encontrado ou erro ao buscar usuário.",
        variant: "destructive",
      });
      console.error("Error finding user:", userError);
      return;
    }

    const newCollaborator: User = {
      id: userData.id,
      email: userData.email,
      name: userData.name || userData.email.split('@')[0],
    };

    // Check if already a collaborator
    const currentCollaborators = Array.isArray(project.collaborators) ? project.collaborators : [];
    if (currentCollaborators.some(col => col.id === newCollaborator.id)) {
      toast({
        title: "Erro ao convidar",
        description: "Este usuário já é um colaborador neste projeto.",
        variant: "warning",
      });
      return;
    }

    // 2. Update the project's collaborators array
    const updatedCollaborators = [...currentCollaborators, newCollaborator];

    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .update({ collaborators: updatedCollaborators })
      .eq('id', project.id);

    if (projectError) {
      toast({
        title: "Erro ao convidar",
        description: "Erro ao adicionar colaborador ao projeto.",
        variant: "destructive",
      });
      console.error("Error updating project collaborators:", projectError);
      return;
    }

    toast({
      title: "Colaborador adicionado!",
      description: `${newCollaborator.name} foi adicionado ao projeto.`, 
      variant: "success",
    });
    onCollaboratorAdded(newCollaborator);
    setShowShareDialog(false);
  };

  return (
    <header className="h-14 bg-card border-b border-card-border flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToDashboard}
          className="text-muted hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="h-6 w-px bg-card-border" />

        <div>
          <h1 className="text-lg font-semibold text-foreground">{project.name}</h1>
          <p className="text-xs text-muted">
            {(Array.isArray(project.collaborators) ? project.collaborators.length : 0) + 1} colaborador(es) • Última edição: agora
          </p>
        </div>
      </div>

  <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted hover:text-foreground"
          onClick={() => setShowExtensions(true)}
        >
          <Puzzle className="w-4 h-4 mr-2" />
          Extensões
        </Button>
        <Button variant="ghost" size="sm" className="text-muted hover:text-foreground">
          <Save className="w-4 h-4 mr-2" />
          Salvar
        </Button>

        <Button variant="ghost" size="sm" className="text-muted hover:text-foreground">
          <Play className="w-4 h-4 mr-2" />
          Executar
        </Button>

        <Button variant="outline" size="sm" onClick={() => setShowShareDialog(true)}>
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>

        <div className="h-6 w-px bg-card-border" />

        <Button variant="ghost" size="sm" className="text-muted hover:text-foreground">
          <Settings className="w-4 h-4" />
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onLogout}
          className="text-muted hover:text-foreground"
        >
          Sair
        </Button>
      </div>
      {showExtensions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-xl" onClick={() => setShowExtensions(false)}>&times;</button>
            <h2 className="text-lg font-bold mb-4 flex items-center"><Puzzle className="w-5 h-5 mr-2" /> Extensões Reais</h2>
            <RealExtensionsList monaco={monaco} editorInstance={editorInstance} userId={user.id} />
          </div>
        </div>
      )}
      <ShareProjectDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        onShare={handleShareProject}
      />
    </header>
  );
}


