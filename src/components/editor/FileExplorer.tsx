import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  File,
  Folder,
  FolderOpen,
  Plus,
  FileText,
  Trash2,
  Edit,
  Download
} from 'lucide-react';
import { ProjectFile } from '@/types';
import { toast } from 'sonner';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  expanded?: boolean;
}

interface FileExplorerProps {
  files: ProjectFile[];
  currentFile?: ProjectFile;
  onFileSelect: (file: ProjectFile) => void;
  onFileCreate: (path: string, name: string, type: 'file' | 'folder') => void;
  onFileDelete: (file: ProjectFile) => void;
  onFileRename: (file: ProjectFile, newName: string) => void;
}

export default function FileExplorer({ 
  files, 
  currentFile, 
  onFileSelect, 
  onFileCreate, 
  onFileDelete, 
  onFileRename 
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');
  const [createPath, setCreatePath] = useState('');
  const [newItemName, setNewItemName] = useState('');

  // Transformar lista plana de arquivos em árvore
  const buildFileTree = (files: ProjectFile[]): FileNode[] => {
    const tree: FileNode[] = [];
    const pathMap = new Map<string, FileNode>();

    // Adicionar pasta raiz
    const rootNode: FileNode = {
      id: 'root',
      name: 'src',
      type: 'folder',
      path: '',
      children: [],
      expanded: true
    };
    tree.push(rootNode);
    pathMap.set('', rootNode);

    files.forEach(file => {
      const pathParts = file.path.split('/').filter(Boolean);
      let currentPath = '';
      let currentParent = rootNode;

      // Criar pastas intermediárias se necessário
      pathParts.slice(0, -1).forEach(part => {
        const fullPath = currentPath ? `${currentPath}/${part}` : part;
        
        if (!pathMap.has(fullPath)) {
          const folderNode: FileNode = {
            id: fullPath,
            name: part,
            type: 'folder',
            path: fullPath,
            children: [],
            expanded: expandedFolders.has(fullPath)
          };
          
          currentParent.children = currentParent.children || [];
          currentParent.children.push(folderNode);
          pathMap.set(fullPath, folderNode);
        }
        
        currentParent = pathMap.get(fullPath)!;
        currentPath = fullPath;
      });

      // Adicionar arquivo
      const fileNode: FileNode = {
        id: file.id,
        name: file.name,
        type: 'file',
        path: file.path
      };
      
      currentParent.children = currentParent.children || [];
      currentParent.children.push(fileNode);
    });

    return tree;
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileClick = (node: FileNode) => {
    if (node.type === 'folder') {
      toggleFolder(node.path);
    } else {
      const file = files.find(f => f.id === node.id);
      if (file) {
        onFileSelect(file);
      }
    }
  };

  const handleCreateItem = () => {
    if (!newItemName.trim()) return;
    
    const fullPath = createPath ? `${createPath}/${newItemName}` : newItemName;
    onFileCreate(fullPath, newItemName, createType);
    
    setNewItemName('');
    setIsCreateDialogOpen(false);
    toast.success(`${createType === 'file' ? 'Arquivo' : 'Pasta'} criado com sucesso!`);
  };

  const getFileIcon = (name: string) => {
    const extension = name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return '📄';
      case 'html':
        return '🌐';
      case 'css':
      case 'scss':
        return '🎨';
      case 'json':
        return '📋';
      case 'md':
        return '📝';
      case 'py':
        return '🐍';
      case 'java':
        return '☕';
      default:
        return '📄';
    }
  };

  const renderNode = (node: FileNode, level: number = 0) => {
    const isSelected = currentFile?.id === node.id;
    const isExpanded = expandedFolders.has(node.path);

    return (
      <div key={node.id}>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div
              className={`flex items-center px-2 py-1 cursor-pointer hover:bg-accent rounded text-sm ${
                isSelected ? 'bg-accent text-accent-foreground' : ''
              }`}
              style={{ paddingLeft: `${level * 12 + 8}px` }}
              onClick={() => handleFileClick(node)}
            >
              {node.type === 'folder' ? (
                isExpanded ? (
                  <FolderOpen className="h-4 w-4 mr-2 text-blue-500" />
                ) : (
                  <Folder className="h-4 w-4 mr-2 text-blue-500" />
                )
              ) : (
                <span className="mr-2">{getFileIcon(node.name)}</span>
              )}
              <span className="truncate">{node.name}</span>
            </div>
          </ContextMenuTrigger>
          
          <ContextMenuContent>
            {node.type === 'folder' && (
              <>
                <ContextMenuItem 
                  onClick={() => {
                    setCreateType('file');
                    setCreatePath(node.path);
                    setIsCreateDialogOpen(true);
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Novo Arquivo
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={() => {
                    setCreateType('folder');
                    setCreatePath(node.path);
                    setIsCreateDialogOpen(true);
                  }}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  Nova Pasta
                </ContextMenuItem>
              </>
            )}
            <ContextMenuItem onClick={() => {}}>
              <Edit className="h-4 w-4 mr-2" />
              Renomear
            </ContextMenuItem>
            <ContextMenuItem onClick={() => {}}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </ContextMenuItem>
            {node.type === 'file' && (
              <ContextMenuItem onClick={() => {}}>
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>

        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const fileTree = buildFileTree(files);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-medium">Arquivos</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setCreateType('file');
            setCreatePath('');
            setIsCreateDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-auto p-2">
        {fileTree.map(node => renderNode(node))}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Criar {createType === 'file' ? 'Arquivo' : 'Pasta'}
            </DialogTitle>
            <DialogDescription>
              {createPath && `Local: ${createPath}/`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={createType === 'file' ? 'arquivo.js' : 'nome-da-pasta'}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateItem} disabled={!newItemName.trim()}>
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}