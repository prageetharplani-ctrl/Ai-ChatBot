'use client';

import { useState } from 'react';
import { Check, Copy, Pencil, RotateCcw } from 'lucide-react';
import { Markdown } from './Markdown';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types/chat';

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
  onRegenerate?: () => void;
  onEdit?: (newContent: string) => void;
}

export function MessageBubble({ message, isStreaming, onRegenerate, onEdit }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const isUser = message.role === 'user';

  const onCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const submitEdit = () => {
    setEditing(false);
    if (draft.trim() && draft !== message.content) onEdit?.(draft.trim());
  };

  return (
    <div className={cn('group flex animate-fadeUp gap-3', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('flex max-w-[75ch] flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
        {editing ? (
          <div className="w-full min-w-[260px] rounded-2xl border border-teal/50 bg-ink-soft p-3">
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              className="w-full resize-none bg-transparent text-sm text-paper outline-none"
            />
            <div className="mt-2 flex justify-end gap-2 text-xs">
              <button onClick={() => setEditing(false)} className="text-muted hover:text-paper">
                Cancel
              </button>
              <button onClick={submitEdit} className="rounded bg-teal px-2 py-1 text-ink font-medium">
                Save & resend
              </button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'rounded-2xl px-4 py-2.5 text-[15px]',
              isUser ? 'bg-teal text-ink font-medium' : 'bg-ink-soft text-paper'
            )}
          >
            {isUser ? (
              <span className="whitespace-pre-wrap">{message.content}</span>
            ) : (
              <>
                <Markdown content={message.content} />
                {isStreaming && <span className="inline-block h-4 w-[7px] translate-y-0.5 bg-amber animate-blink" />}
              </>
            )}
          </div>
        )}

        {!editing && !isStreaming && (
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={onCopy}
              className="rounded p-1 text-muted hover:text-paper"
              aria-label="Copy message"
              title="Copy"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            {isUser && onEdit && (
              <button
                onClick={() => setEditing(true)}
                className="rounded p-1 text-muted hover:text-paper"
                aria-label="Edit message"
                title="Edit"
              >
                <Pencil size={14} />
              </button>
            )}
            {!isUser && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="rounded p-1 text-muted hover:text-paper"
                aria-label="Regenerate response"
                title="Regenerate"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
