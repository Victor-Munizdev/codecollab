import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { User, Crown, Circle } from 'lucide-react';
import { User as UserType } from '@/types';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  isOnline: boolean;
  cursor?: { line: number; col: number };
}

interface CollaboratorsListProps {
  collaborators: Collaborator[];
  currentUser: UserType;
  projectOwner: string;
}

export function CollaboratorsList({ collaborators, currentUser, projectOwner }: CollaboratorsListProps) {
  const isOwner = (email: string) => email === projectOwner;

  const safeCollaborators = Array.isArray(collaborators) ? collaborators : [];
  console.log('DEBUG safeCollaborators', safeCollaborators);
  
  return (
    <div className="h-full bg-card border-l border-card-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-card-border">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <User className="w-4 h-4" />
          Colaboradores ({safeCollaborators.length + 1})
        </h3>
      </div>

      {/* Collaborators List */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {/* Current User */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <Circle className="absolute -bottom-1 -right-1 w-3 h-3 text-success fill-current" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground truncate">
                  {currentUser.name} (Você)
                </span>
                {isOwner(currentUser.email) && (
                  <Crown className="w-3 h-3 text-warning" />
                )}
              </div>
              <p className="text-xs text-muted truncate">{currentUser.email}</p>
            </div>
          </div>

          {/* Other Collaborators */}
          {safeCollaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-card-hover transition-colors">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
                <Circle 
                  className={`absolute -bottom-1 -right-1 w-3 h-3 ${
                    collaborator.isOnline ? 'text-success fill-current' : 'text-muted fill-current'
                  }`} 
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {collaborator.name}
                  </span>
                  {isOwner(collaborator.email) && (
                    <Crown className="w-3 h-3 text-warning" />
                  )}
                </div>
                <p className="text-xs text-muted truncate">{collaborator.email}</p>
                {collaborator.isOnline && collaborator.cursor && (
                  <p className="text-xs text-accent">
                    Linha {collaborator.cursor.line}
                  </p>
                )}
              </div>
              <Badge 
                variant={collaborator.isOnline ? "default" : "secondary"}
                className="text-xs"
              >
                {collaborator.isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>
          ))}

          {safeCollaborators.length === 0 && (
            <div className="text-center py-8 text-muted text-sm">
              <User className="w-8 h-8 mx-auto mb-2 text-muted" />
              Nenhum colaborador
              <br />
              <span className="text-xs">
                Compartilhe o projeto para colaborar
              </span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
