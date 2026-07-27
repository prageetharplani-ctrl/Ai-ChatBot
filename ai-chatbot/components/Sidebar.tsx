'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PenSquare, Search, Trash2 } from 'lucide-react';
import { cn, formatTime } from '@/lib/utils';
import type { Conversation } from '@/types/chat';

interface SidebarProps {
  conversations: Conversation[];
  activeId?: string;
  onNewChat: () => void;
  onDelete: (id: string) => void;
}

export function Sidebar({ conversations, activeId, onNewChat, onDelete }: SidebarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const filtered = useMemo(() => {
    if (!query.trim()) return conversations;
    const q = query.toLowerCase();
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [conversations, query]);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-ink-line bg-ink">
      <div className="flex items-center gap-2 px-4 py-4">
        <span className="font-display text-lg italic tracking-tight text-paper">Relay</span>
      </div>

      <div className="px-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-lg border border-ink-line px-3 py-2 text-sm text-paper hover:bg-ink-soft"
        >
          <PenSquare size={15} />
          New chat
        </button>
      </div>

      <div className="mt-3 px-3">
        <div className="flex items-center gap-2 rounded-lg bg-ink-soft px-2.5 py-1.5">
          <Search size={14} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations…"
            className="w-full bg-transparent text-sm text-paper placeholder:text-muted outline-none"
          />
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
        {filtered.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-muted">No conversations yet.</p>
        )}
        {filtered.map((c) => (
          <div
            key={c.id}
            className={cn(
              'group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm',
              c.id === activeId ? 'bg-ink-soft text-paper' : 'text-muted hover:bg-ink-soft hover:text-paper'
            )}
            onClick={() => router.push(`/chat/${c.id}`)}
          >
            <div className="min-w-0">
              <p className="truncate">{c.title}</p>
              <p className="text-[11px] text-muted/70">{formatTime(c.updatedAt)}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(c.id);
              }}
              className="ml-2 shrink-0 rounded p-1 opacity-0 hover:text-amber group-hover:opacity-100"
              aria-label="Delete conversation"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </nav>
    </aside>
  );
}
