import React, { useEffect, useState } from 'react';
import { ExtensionsPanel } from '../../extensions/ExtensionsPanel';
import { loadExtensions } from '../../extensions';

export function ExtensionsSidebar({ userId, monaco, editor }) {
  const [enabled, setEnabled] = useState<string[]>([]);

  // Carrega extensões do banco ao montar (delegado ao painel)
  // Ativa/desativa extensões ao mudar
  useEffect(() => {
    if (monaco && editor) {
      loadExtensions(monaco, editor, enabled);
    }
  }, [enabled, monaco, editor]);

  return (
    <div className="h-full w-64 bg-card border-l border-card-border p-2">
      <ExtensionsPanel userId={userId} />
    </div>
  );
}
