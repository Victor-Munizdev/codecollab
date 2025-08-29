// Carregador de extensões
import { activate as helloWorldActivate } from './helloWorldExtension';
import { activate as snippetActivate } from './snippetExtension';

export const EXTENSIONS = [
  { name: 'Hello World', activate: helloWorldActivate },
  { name: 'Snippets Extra', activate: snippetActivate },
];

export function loadExtensions(monaco: any, editor: any, enabled: string[] = []) {
  EXTENSIONS.forEach(ext => {
    if (enabled.length === 0 || enabled.includes(ext.name)) {
      ext.activate(monaco, editor);
    }
  });
}

