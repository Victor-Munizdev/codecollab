import React, { useState, useEffect } from 'react';
import { realExtensions } from '@/extensions/realExtensions';
import { saveUserExtensions, getUserExtensions } from '@/lib/extensionsStorage';

export function RealExtensionsList({ monaco, editorInstance, userId }: { monaco: any, editorInstance: any, userId: string }) {
  console.log('[RealExtensionsList.tsx] userId prop:', userId);
  const [active, setActive] = useState<string[]>([]);
  const [detail, setDetail] = useState<null | { id: string, name: string, description: string }>(null);
  useEffect(() => {
    if (!userId) return;
    getUserExtensions(userId).then(exts => {
      setActive(exts);
      // Ativa extensões salvas ao abrir
      exts.forEach(id => {
        const ext = realExtensions.find(e => e.id === id);
        if (ext) ext.activate(monaco, editorInstance);
      });
    });
  }, [userId, monaco, editorInstance]);

  const persist = (newActive: string[]) => {
    setActive(newActive);
    if (userId) saveUserExtensions(userId, newActive);
  };
  const handleActivate = (ext: any) => {
    if (!active.includes(ext.id)) {
      ext.activate(monaco, editorInstance);
      persist([...active, ext.id]);
    }
  };
  const handleDeactivate = (ext: any) => {
    if (active.includes(ext.id)) {
      ext.deactivate(monaco, editorInstance);
      persist(active.filter(id => id !== ext.id));
    }
  };

  return (
    <div className="space-y-4">
      {realExtensions.map(ext => (
  <div key={ext.id} className="border rounded p-3 flex flex-col gap-1 bg-black text-white shadow-md">
          <div className="font-semibold flex items-center gap-2">
            {ext.name}
            <span className="text-xs text-muted ml-2">({ext.id})</span>
          </div>
          <div className="text-sm text-muted mb-2">{ext.description}</div>
          <div className="flex gap-2">
            <button className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 text-xs" onClick={() => handleActivate(ext)} disabled={active.includes(ext.id)}>
              Ativar
            </button>
            <button className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-xs" onClick={() => handleDeactivate(ext)} disabled={!active.includes(ext.id)}>
              Desativar
            </button>
            <button className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs" onClick={() => setDetail(ext)}>
              Detalhes
            </button>
          </div>
        </div>
      ))}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="bg-black text-white border border-zinc-700 rounded-lg shadow-2xl p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-xl text-zinc-400 hover:text-white" onClick={() => setDetail(null)}>&times;</button>
            <h3 className="text-lg font-bold mb-2">{detail.name}</h3>
            <div className="mb-4 text-zinc-400">ID: {detail.id}</div>
            <div>{detail.description}</div>
          </div>
        </div>
      )}
    </div>
  );
}
