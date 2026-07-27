'use client';

import { SUGGESTED_PROMPTS } from '@/types/chat';

export function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-4xl italic text-paper">Relay</h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        A fast, private space to think out loud — ask a question, paste some code, or start
        drafting something.
      </p>
      <div className="mt-8 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
        {SUGGESTED_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => onPick(p)}
            className="rounded-xl border border-ink-line bg-ink-soft px-4 py-3 text-left text-sm text-paper/90 hover:border-teal/50 hover:bg-ink-soft/70"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
