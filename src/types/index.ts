export interface User {
  id: string;
  email: string;
  name: string;
  active_time_seconds?: number;
  avatar?: string;
  created_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  owner_email: string;
  collaborators: string[];
  created_at: string;
  updated_at?: string;
  is_public?: boolean;
  language?: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  created_at: string;
  updated_at?: string;
}

export interface Collaboration {
  id: string;
  project_id: string;
  user_id: string;
  user_email: string;
  permission: 'read' | 'write' | 'admin';
  joined_at: string;
}

export interface DashboardProps {
  user: User;
  accessToken?: string;
  onLogout: () => void;
  onOpenProject: (project: Project) => void;
}

export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
}