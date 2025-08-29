import React, { useEffect, useState } from 'react';
import { EXTENSIONS } from './index';
import { supabase } from '@/lib/supabase';

// Props: userId obrigatório
export function ExtensionsPanel({ userId }: { userId: string }) {
  const [enabled, setEnabled] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega extensões do banco ao montar
  useEffect(() => {
    async function fetchUserExts() {
      setLoading(true);
      const { data } = await supabase
        .from('user_extensions')
        .select('extensions')
        .eq('user_id', userId)
        .single();
      if (data && Array.isArray(data.extensions)) setEnabled(data.extensions);
      setLoading(false);
    }
    fetchUserExts();
  }, [userId]);

  // Salva extensões no banco ao mudar
  useEffect(() => {
    if (!loading) {
      supabase
        .from('user_extensions')
        .upsert({ user_id: userId, extensions: enabled }, { onConflict: 'user_id' });
    }
  }, [enabled, userId, loading]);

  return (
    <div className="p-4 bg-card border-card-border rounded shadow w-64">
      <h2 className="font-bold mb-2">Extensões</h2>
      <ul>
        {EXTENSIONS.map(ext => (
          <li key={ext.name} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={enabled.includes(ext.name)}
              onChange={e => {
                if (e.target.checked) setEnabled((prev) => [...prev, ext.name]);
                else setEnabled((prev) => prev.filter(n => n !== ext.name));
              }}
            />
            <span>{ext.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
