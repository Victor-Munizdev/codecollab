import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { TopHeader } from './TopHeader';

interface MainLayoutProps {
  children: React.ReactNode;
  user: {
    id: string;
    email: string;
    name: string;
  };
  onLogout: () => void;
}

export function MainLayout({ children, user, onLogout }: MainLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar user={user} />
        <div className="flex-1 flex flex-col">
          <TopHeader user={user} onLogout={onLogout} />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}