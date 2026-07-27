export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/** Derive a short conversation title from the first user message. */
export function deriveTitle(text: string) {
  const clean = text.trim().replace(/\s+/g, ' ');
  return clean.length > 48 ? clean.slice(0, 48).trimEnd() + '…' : clean || 'New chat';
}
