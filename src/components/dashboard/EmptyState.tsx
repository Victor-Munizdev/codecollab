import { Button } from "@/components/ui/button";
import { Plus, Folder } from "lucide-react";

interface EmptyStateProps {
  onOpenCreateDialog: () => void;
}

export function EmptyState({ onOpenCreateDialog }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6">
      <div className="max-w-md mx-auto">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gradient-glow rounded-full flex items-center justify-center mx-auto animate-pulse">
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center shadow-primary">
              <Folder className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-3xl font-bold text-foreground mb-4">
          Nenhum projeto ainda
        </h3>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Parece que você ainda não tem projetos criados. <br />
          Que tal começar criando seu primeiro projeto colaborativo?
        </p>

        {/* CTA Button */}
        <Button 
          onClick={onOpenCreateDialog} 
          variant="hero" 
          size="xl"
          className="shadow-primary hover:shadow-accent"
        >
          <Plus className="w-6 h-6 mr-3" />
          Criar Primeiro Projeto
        </Button>

        {/* Helper Text */}
        <p className="text-sm text-muted-foreground mt-6">
          Convide colaboradores e trabalhe em conjunto em tempo real
        </p>
      </div>
    </div>
  );
}