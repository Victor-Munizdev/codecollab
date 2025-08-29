import { DatabaseConfig } from '@/types';

// Configuração preparada para MySQL da Hostinger
// Os dados do hostinger.config.txt:
// Banco de Dados MySQL | u663037055_vscode
// Usuário MySQL | u663037055_vscode  
// Senha | @Robvic09

export const databaseConfig: DatabaseConfig = {
  host: 'localhost', // Substitua pelo host do Hostinger
  user: 'u663037055_vscode',
  password: '@Robvic09',
  database: 'u663037055_vscode',
  port: 3306
};

// Funções de API preparadas para integração com backend MySQL
export class DatabaseService {
  private static baseUrl = '/api'; // Substituir pela URL do seu backend

  // Usuários
  static async authenticateUser(email: string, password: string) {
    // Implementar chamada para API de autenticação
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }

  static async registerUser(name: string, email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return response.json();
  }

  // Projetos
  static async getProjects(userId: string) {
    const response = await fetch(`${this.baseUrl}/projects?userId=${userId}`);
    return response.json();
  }

  static async createProject(project: any) {
    const response = await fetch(`${this.baseUrl}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    return response.json();
  }

  static async updateProject(projectId: string, updates: any) {
    const response = await fetch(`${this.baseUrl}/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  }

  static async deleteProject(projectId: string) {
    const response = await fetch(`${this.baseUrl}/projects/${projectId}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  // Arquivos do projeto
  static async getProjectFiles(projectId: string) {
    const response = await fetch(`${this.baseUrl}/projects/${projectId}/files`);
    return response.json();
  }

  static async saveFile(projectId: string, file: any) {
    const response = await fetch(`${this.baseUrl}/projects/${projectId}/files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(file)
    });
    return response.json();
  }

  // Colaborações
  static async getCollaborations(userId: string) {
    const response = await fetch(`${this.baseUrl}/collaborations?userId=${userId}`);
    return response.json();
  }

  static async addCollaborator(projectId: string, email: string, permission: string) {
    const response = await fetch(`${this.baseUrl}/projects/${projectId}/collaborators`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, permission })
    });
    return response.json();
  }
}