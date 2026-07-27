'use client';

import { useCallback, useRef, useState } from 'react';
import type { ChatMessage, ModelId } from '@/types/chat';

interface StreamArgs {
  history: ChatMessage[];
  model: ModelId;
  onToken: (fullTextSoFar: string) => void;
  onDone: (fullText: string) => void;
  onError: (message: string) => void;
}

export function useChatStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const send = useCallback(async ({ history, model, onToken, onDone, onError }: StreamArgs) => {
    const controller = new AbortController();
    controllerRef.current = controller;
    setIsStreaming(true);

    let full = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const payload = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(payload.error || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        onToken(full);
      }
      onDone(full);
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        onDone(full); // keep whatever was streamed before the user hit stop
      } else {
        onError(err instanceof Error ? err.message : 'Something went wrong.');
      }
    } finally {
      setIsStreaming(false);
      controllerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  return { send, stop, isStreaming };
}
