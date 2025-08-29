// Extensão: adiciona snippet customizado para HTML e PHP
export function activate(monaco, editor) {
  monaco.languages.registerCompletionItemProvider('html', {
    provideCompletionItems: () => ({
      suggestions: [
        {
          label: 'html:hello',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '<h1>Hello from Extension!</h1>',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Snippet de Hello World via extensão',
        },
      ],
    }),
  });
  monaco.languages.registerCompletionItemProvider('php', {
    provideCompletionItems: () => ({
      suggestions: [
        {
          label: 'php:echoext',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "<?php echo 'Hello from Extension!'; ?>",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Snippet PHP echo via extensão',
        },
      ],
    }),
  });
}
