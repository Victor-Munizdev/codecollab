// Exemplo de extensão: comando Hello World
export function activate(monaco: any, editor: any) {
  // Adiciona um comando customizado Ctrl+Shift+H
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyH, () => {
    alert('Hello World from Extension!');
  });
}
