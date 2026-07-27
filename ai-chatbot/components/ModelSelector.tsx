'use client';

import { ChevronDown } from 'lucide-react';
import { MODEL_LABELS, type ModelId } from '@/types/chat';

export function ModelSelector({
  value,
  onChange,
}: {
  value: ModelId;
  onChange: (m: ModelId) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ModelId)}
        className="appearance-none rounded-lg border border-ink-line bg-ink-soft py-1.5 pl-3 pr-8 text-sm text-paper outline-none"
      >
        {(Object.keys(MODEL_LABELS) as ModelId[]).map((id) => (
          <option key={id} value={id}>
            {MODEL_LABELS[id]}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-2.5 text-muted" />
    </div>
  );
}
