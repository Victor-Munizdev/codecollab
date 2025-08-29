import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, Search, Bell, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TopHeaderProps {
  user: {
    id: string;
    email: string;
    name: string;
  };
  onLogout: () => void;
}

export function TopHeader({ user, onLogout }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-card-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="text-muted hover:text-foreground transition-colors" />
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
              <Input 
                placeholder="Buscar projetos..." 
                className="w-64 pl-10 bg-card border-card-border focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="hero" size="sm" className="hidden sm:flex">
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full text-xs"></span>
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}