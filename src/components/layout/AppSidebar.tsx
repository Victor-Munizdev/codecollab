import { useState } from "react";
import { Home, Settings, Code, Users, Star, Folder, User as UserIcon } from "lucide-react";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Meus Projetos", url: "/projects", icon: Folder },
  { title: "Colaborações", url: "/collaborations", icon: Users },
  { title: "Favoritos", url: "/favorites", icon: Star },
];

const settingsItems = [
  { title: "Configurações", url: "/settings", icon: Settings },
];

export function AppSidebar({ user }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-primary">
            <Code className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-sidebar-foreground">CodeCollab</h1>
              <p className="text-xs text-muted">Desenvolvimento colaborativo</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive(item.url)}
                    className={`
                      mb-1 transition-all duration-300 group
                      ${isActive(item.url) 
                        ? 'bg-gradient-primary text-primary-foreground shadow-primary' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }
                    `}
                  >
                    <a href={item.url} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg">
                      <item.icon className={`w-5 h-5 ${isActive(item.url) ? 'text-primary-foreground' : 'text-muted group-hover:text-sidebar-accent-foreground'}`} />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2 mt-6">
            Configurações
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive(item.url)}
                    className={`
                      mb-1 transition-all duration-300 group
                      ${isActive(item.url) 
                        ? 'bg-gradient-primary text-primary-foreground shadow-primary' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }
                    `}
                  >
                    <a href={item.url} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg">
                      <item.icon className={`w-5 h-5 ${isActive(item.url) ? 'text-primary-foreground' : 'text-muted group-hover:text-sidebar-accent-foreground'}`} />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-sidebar-accent/50">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-primary">
            <UserIcon className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground truncate">
                {user.name}
              </span>
              <span className="text-xs text-muted truncate">
                {user.email}
              </span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}