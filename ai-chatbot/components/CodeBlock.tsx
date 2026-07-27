'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
}

/**
 * Lazily loads shiki (it's heavy) only when a code block actually renders,
 * and falls back to a plain <pre> until highlighting is ready.
 */
export function CodeBlock({ code, language = 'text' }: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import('shiki').then(async ({ codeToHtml }) => {
      try {
        const out = await codeToHtml(code, {
          lang: language,
          theme: 'github-dark-default',
        });
        if (!cancelled) setHtml(out);
      } catch {
        // unsupported language id — just keep the plain fallback
      }
    });
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  const onCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative my-1 overflow-hidden rounded-lg border border-ink-line bg-[#0d0e11]">
      <div className="flex items-center justify-between px-3 py-1.5 text-xs text-muted font-mono border-b border-ink-line">
        <span>{language}</span>
        <button
          onClick={onCopy}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:text-paper transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {html ? (
        <div
          className={cn('overflow-x-auto text-[13px] leading-relaxed [&>pre]:p-3 [&>pre]:m-0')}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-3 text-[13px] leading-relaxed font-mono text-paper">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
