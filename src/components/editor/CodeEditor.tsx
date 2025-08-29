import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Save, 
  Play, 
  Download, 
  Copy, 
  RotateCcw, 
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { ProjectFile } from '@/types';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

interface CodeEditorProps {
  file: ProjectFile;
  onSave: (content: string) => void;
  onContentChange?: (content: string) => void;
}

const languageMap: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  java: 'java',
  html: 'html',
  css: 'css',
  scss: 'scss',
  json: 'json',
  md: 'markdown',
  xml: 'xml',
  sql: 'sql',
  php: 'php',
  rb: 'ruby',
  go: 'go',
  cpp: 'cpp',
  c: 'c',
  cs: 'csharp'
};

const themes = [
  { value: 'vs-dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'hc-black', label: 'High Contrast Dark' },
  { value: 'hc-light', label: 'High Contrast Light' }
];

export default function CodeEditor({ file, onSave, onContentChange }: CodeEditorProps) {
  const [content, setContent] = useState(file.content);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const { theme, setTheme } = useTheme();
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setContent(file.content);
    setHasUnsavedChanges(false);
  }, [file]);

  useEffect(() => {
    // Sync editor theme with app theme
    setEditorTheme(theme === 'dark' ? 'vs-dark' : 'light');
  }, [theme]);

  const getLanguageFromExtension = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    return languageMap[ext] || 'plaintext';
  };

  const handleEditorChange = (value: string | undefined) => {
    const newContent = value || '';
    setContent(newContent);
    setHasUnsavedChanges(newContent !== file.content);
    onContentChange?.(newContent);
  };

  const handleSave = () => {
    onSave(content);
    setHasUnsavedChanges(false);
    toast.success('Arquivo salvo com sucesso!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success('Código copiado para a área de transferência!');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const blob = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(blob);
    element.download = file.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Arquivo baixado!');
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja desfazer todas as mudanças não salvas?')) {
      setContent(file.content);
      setHasUnsavedChanges(false);
      toast.success('Mudanças desfeitas');
    }
  };

  const handleRun = () => {
    // Implementar execução de código (pode ser integrado com um serviço online)
    toast.info('Funcionalidade de execução será implementada em breve');
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Adicionar shortcuts
    editor.addAction({
      id: 'save-file',
      label: 'Save File',
      keybindings: [2048 | 49], // Ctrl+S
      run: handleSave
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <Card className="border-b rounded-none">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium">{file.name}</h3>
              <Badge variant="secondary">
                {getLanguageFromExtension(file.name)}
              </Badge>
              {hasUnsavedChanges && (
                <Badge variant="destructive">Não salvo</Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Select value={editorTheme} onValueChange={setEditorTheme}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>

            {hasUnsavedChanges && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}

            <Button variant="ghost" size="sm" onClick={handleRun}>
              <Play className="h-4 w-4" />
            </Button>

            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </Card>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={getLanguageFromExtension(file.name)}
          value={content}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme={editorTheme}
          options={{
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Fira Code, Monaco, monospace',
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            matchBrackets: 'always',
            autoIndent: 'full',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabSize: 2,
            insertSpaces: true,
            renderWhitespace: 'selection',
            cursorStyle: 'line',
            renderLineHighlight: 'line'
          }}
        />
      </div>
    </div>
  );
}