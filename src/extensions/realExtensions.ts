// Exemplos de extensões reais para temas e utilidades
import { editor } from 'monaco-editor';

export const realExtensions = [
  {
    id: 'theme-dark-vscode',
    name: 'VSCode Dark Theme',
    description: 'Tema escuro inspirado no Visual Studio Code.',
    activate: (monaco: any) => {
      if (monaco && monaco.editor) {
        monaco.editor.defineTheme('vscode-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#1e1e1e',
          'editor.foreground': '#d4d4d4',
          'editor.lineHighlightBackground': '#2a2d2e',
          'editorCursor.foreground': '#aeafad',
          'editor.selectionBackground': '#264f78',
        },
      });
        monaco.editor.setTheme('vscode-dark');
      }
    },
    deactivate: (monaco: any) => {
      if (monaco && monaco.editor) monaco.editor.setTheme('vs-dark');
    },
  },
  {
    id: 'theme-light-vscode',
    name: 'VSCode Light Theme',
    description: 'Tema claro inspirado no Visual Studio Code.',
    activate: (monaco: any) => {
      if (monaco && monaco.editor) {
        monaco.editor.defineTheme('vscode-light', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#ffffff',
          'editor.foreground': '#333333',
          'editor.lineHighlightBackground': '#f3f3f3',
          'editorCursor.foreground': '#333333',
          'editor.selectionBackground': '#add6ff',
        },
      });
        monaco.editor.setTheme('vscode-light');
      }
    },
    deactivate: (monaco: any) => {
      if (monaco && monaco.editor) monaco.editor.setTheme('vs');
    },
  },
  {
    id: 'minimap-toggle',
    name: 'Minimap Toggle',
    description: 'Ativa/desativa o minimapa do editor.',
    activate: (monaco: typeof editor, editorInstance: editor.IStandaloneCodeEditor) => {
      editorInstance.updateOptions({ minimap: { enabled: true } });
    },
    deactivate: (monaco: typeof editor, editorInstance: editor.IStandaloneCodeEditor) => {
      editorInstance.updateOptions({ minimap: { enabled: false } });
    },
  },
  {
    id: 'line-numbers-toggle',
    name: 'Line Numbers Toggle',
    description: 'Ativa/desativa a exibição dos números de linha.',
    activate: (monaco: typeof editor, editorInstance: editor.IStandaloneCodeEditor) => {
      editorInstance.updateOptions({ lineNumbers: 'on' });
    },
    deactivate: (monaco: typeof editor, editorInstance: editor.IStandaloneCodeEditor) => {
      editorInstance.updateOptions({ lineNumbers: 'off' });
    },
  },
];
