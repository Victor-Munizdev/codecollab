import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { LoadingSpinner } from '@/components/dashboard/LoadingSpinner';
import { Project, User } from '@/types';
import { Users } from 'lucide-react';

interface CollaborationsPageProps {
  user: User;
  onLogout: () => void;
}

export function CollaborationsPage({ user, onLogout }: CollaborationsPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollaborations = async () => {
      setLoading(true);
      let timeoutId: NodeJS.Timeout;

      try {
        // Set a timeout to display a message if the query takes too long
        timeoutId = setTimeout(() => {
          console.warn('Collaborations query taking longer than expected...');
          // You could set a state here to display a message to the user
          // e.g., setLongLoadMessage(true);
        }, 5000); // 5 seconds

        console.log('Fetching collaborations for user:', user.email);
        console.log('Supabase query initiated.');
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .contains('collaborators', [user.email]);
        console.log('Supabase query completed.');

        clearTimeout(timeoutId); // Clear the timeout if query completes

        if (error) {
          console.error('Error fetching collaborations:', error);
          alert('Erro ao buscar projetos em que você colabora: ' + error.message);
          setProjects([]);
        } else {
          console.log('Collaborations data fetched:', data);
          setProjects(data || []);
        }
      } catch (e: any) {
        clearTimeout(timeoutId); // Clear the timeout if an unexpected error occurs
        console.error('Unexpected error during collaborations fetch:', e);
        alert('Ocorreu um erro inesperado ao buscar colaborações: ' + e.message);
        setProjects([]);
      } finally {
        setLoading(false);
        // setLongLoadMessage(false); // Reset message state if used
      }
    };

    fetchCollaborations();
  }, [user.email]);

  const handleOpenProject = (project: Project) => {
    localStorage.setItem('currentProject', JSON.stringify(project));
    navigate('/');
  };

  if (loading) {
    return <LoadingSpinner text="Carregando seus projetos de colaboração..." />;
  }

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Users className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Colaborações</h1>
            <p className="text-muted-foreground">Projetos em que você é um colaborador.</p>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 bg-card border border-dashed rounded-lg">
            <h2 className="text-xl font-semibold text-foreground">Nenhuma colaboração encontrada</h2>
            <p className="text-muted-foreground mt-2">Você ainda não foi adicionado como colaborador em nenhum projeto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpenProject={handleOpenProject}
                currentUserId={user.id}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
