import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import {
  Home,
  Code2,
  Users,
  Settings,
  User,
  LogOut,
  FileText,
  FolderOpen,
  Bell,
  Star,
  GitBranch
} from 'lucide-react';
import { User as UserType, Project } from '@/types';

interface AppSidebarProps {
  user: UserType;
  currentProject?: Project;
  onNavigate: (route: string) => void;
  onLogout: () => void;
}

export default function AppSidebar({ 
  user, 
  currentProject, 
  onNavigate, 
  onLogout 
}: AppSidebarProps) {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      route: '/dashboard'
    },
    {
      id: 'projects',
      label: 'Projetos',
      icon: FolderOpen,
      route: '/projects'
    },
    {
      id: 'collaborations',
      label: 'Colaborações',
      icon: Users,
      route: '/collaborations',
      badge: '3'
    },
    {
      id: 'starred',
      label: 'Favoritos',
      icon: Star,
      route: '/starred'
    }
  ];

  const handleMenuClick = (item: any) => {
    setActiveItem(item.id);
    onNavigate(item.route);
  };

  return (
    <ShadcnSidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center space-x-2 px-4 py-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-primary">CodeCollab</span>
        </div>
        
        {currentProject && (
          <div className="px-4 py-2">
            <div className="text-xs text-muted-foreground">Projeto Atual</div>
            <div className="font-medium text-sm truncate">{currentProject.name}</div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {currentProject.language || 'Mixed'}
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <Users className="h-3 w-3 mr-1" />
                {currentProject.collaborators.length + 1}
              </div>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => handleMenuClick(item)}
                isActive={activeItem === item.id}
                className="w-full justify-start"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {item.badge}
                  </Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <Separator className="my-4" />

        <div className="px-4">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            FERRAMENTAS
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FileText className="h-4 w-4" />
                <span>Editor</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <GitBranch className="h-4 w-4" />
                <span>Versionamento</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Bell className="h-4 w-4" />
                <span>Notificações</span>
                <Badge variant="destructive" className="ml-auto text-xs">
                  2
                </Badge>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onNavigate('/settings')}>
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-4 py-2">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLogout}
              className="h-8 w-8 p-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}