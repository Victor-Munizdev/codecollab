// Componente para editar/excluir mensagem
import React, { useState, useEffect, useRef } from 'react';

// Tipo das props do componente auxiliar
interface ChatMessageActionsProps {
  message: Message;
  user: UserType;
  onEdit: (newContent: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

// Componente auxiliar para editar/excluir mensagem
function ChatMessageActions({ message, user, onEdit, onDelete }: ChatMessageActionsProps) {
  const [editing, setEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(message.content);

  if (message.user_id !== user.id) {
    return <p className="text-sm text-card-foreground leading-relaxed">{message.content}</p>;
  }

  return editing ? (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onEdit(editValue);
        setEditing(false);
      }}
      className="flex gap-2 items-center"
    >
      <Input
        value={editValue}
        onChange={e => setEditValue(e.target.value)}
        className="flex-1 text-sm"
      />
      <Button type="submit" size="sm" variant="hero">Salvar</Button>
      <Button type="button" size="sm" variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
    </form>
  ) : (
    <div className="flex gap-2 items-center">
      <p className="text-sm text-card-foreground leading-relaxed">{message.content}</p>
      <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>Editar</Button>
      <Button size="sm" variant="destructive" onClick={async () => {
        await onDelete();
        setEditing(false);
      }}>Excluir</Button>
    </div>
  );
}
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle, User } from 'lucide-react';
import { User as UserType } from '@/types';

interface Message {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

interface ChatPanelProps {
  user: UserType;
  projectId: string;
}

export function ChatPanel({ user, projectId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Buscar mensagens do Supabase ao carregar
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('project_chat')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });
      setMessages(Array.isArray(data) ? data : []);
    };
    fetchMessages();

    // Realtime subscription
    const channel = supabase.channel('public:project_chat_' + projectId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_chat', filter: `project_id=eq.${projectId}` }, (payload) => {
        fetchMessages();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [projectId]);

  // Scroll automático para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await supabase.from('project_chat').insert({
        project_id: projectId,
        user_id: user.id,
        user_name: user.name,
        content: newMessage.trim(),
      });
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full bg-card border-t border-card-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-card-border">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Chat do Projeto
        </h3>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4" ref={scrollRef}>
          {(Array.isArray(messages) ? messages : []).map((message) => (
            <div key={message.id} className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-secondary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {message.user_id === user.id ? 'Você' : message.user_name}
                  </span>
                  <span className="text-xs text-muted">{new Date(message.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <ChatMessageActions
                  message={message}
                  user={user}
                  onEdit={async (newContent: string) => {
                    await supabase.from('project_chat')
                      .update({ content: newContent })
                      .eq('id', message.id)
                      .eq('project_id', projectId)
                      .eq('user_id', user.id);
                    setMessages((msgs) => msgs.map(m => m.id === message.id ? { ...m, content: newContent } : m));
                  }}
                  onDelete={async () => {
                    await supabase.from('project_chat')
                      .delete()
                      .eq('id', message.id)
                      .eq('project_id', projectId)
                      .eq('user_id', user.id);
                    setMessages((msgs) => msgs.filter(m => m.id !== message.id));
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-card-border">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Digite uma mensagem..."
            className="flex-1 bg-background-secondary border-card-border"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            variant="hero"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted mt-2">
          Pressione Enter para enviar • Shift+Enter para nova linha
        </p>
      </div>
    </div>
  );
}