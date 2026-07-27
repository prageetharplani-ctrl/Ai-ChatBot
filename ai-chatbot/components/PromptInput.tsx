'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Square } from 'lucide-react';

interface PromptInputProps {
  onSend: (text: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
}

export function PromptInput({ onSend, onStop, isStreaming, disabled }: PromptInputProps) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-5">
      <div className="flex items-end gap-2 rounded-2xl border border-ink-line bg-ink-soft px-4 py-3 shadow-lg shadow-black/20 focus-within:border-teal/60">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder="Ask anything… (Shift+Enter for a new line)"
          className="max-h-[200px] flex-1 resize-none bg-transparent text-[15px] text-paper placeholder:text-muted outline-none"
        />
        {isStreaming ? (
          <button
            onClick={onStop}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-line text-paper hover:bg-ink-line/70"
            aria-label="Stop generating"
          >
            <Square size={15} />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={!value.trim() || disabled}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal text-ink transition-opacity disabled:opacity-30"
            aria-label="Send message"
          >
            <ArrowUp size={16} />
          </button>
        )}
      </div>
      <p className="mt-2 text-center text-[11px] text-muted">
        Relay can make mistakes. Check important facts.
      </p>
    </div>
  );
}
