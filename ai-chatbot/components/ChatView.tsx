'use client';

import { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { Sidebar } from './Sidebar';
import { PromptInput } from './PromptInput';
import { MessageBubble } from './MessageBubble';
import { EmptyState } from './EmptyState';
import { ModelSelector } from './ModelSelector';
import { useConversations } from '@/hooks/useConversations';
import { useChatStream } from '@/hooks/useChatStream';
import { deriveTitle } from '@/lib/utils';
import type { ChatMessage } from '@/types/chat';

export function ChatView({ conversationId }: { conversationId?: string }) {
  const { conversations, hydrated, createConversation, updateConversation, deleteConversation, getConversation } =
    useConversations();
  const { send, stop, isStreaming } = useChatStream();

  const [activeId, setActiveId] = useState(conversationId);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = activeId ? getConversation(activeId) : undefined;

  useEffect(() => {
    setActiveId(conversationId);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages.length, streamingText]);

  const ensureConversation = () => {
    if (active) return active;
    const conv = createConversation();
    setActiveId(conv.id);
    window.history.replaceState(null, '', `/chat/${conv.id}`);
    return conv;
  };

  const runAssistantTurn = (convId: string, history: ChatMessage[]) => {
    setError(null);
    setStreamingText('');
    send({
      history,
      model: getConversation(convId)?.model ?? 'claude-sonnet-4-6',
      onToken: (text) => setStreamingText(text),
      onDone: (finalText) => {
        setStreamingText(null);
        const assistantMsg: ChatMessage = {
          id: nanoid(10),
          role: 'assistant',
          content: finalText,
          createdAt: Date.now(),
        };
        updateConversation(convId, { messages: [...history, assistantMsg] });
      },
      onError: (msg) => {
        setStreamingText(null);
        setError(msg);
      },
    });
  };

  const handleSend = (text: string) => {
    const conv = ensureConversation();
    const userMsg: ChatMessage = { id: nanoid(10), role: 'user', content: text, createdAt: Date.now() };
    const nextMessages = [...conv.messages, userMsg];
    const patch: Partial<typeof conv> = { messages: nextMessages };
    if (conv.messages.length === 0) patch.title = deriveTitle(text);
    updateConversation(conv.id, patch);
    runAssistantTurn(conv.id, nextMessages);
  };

  const handleRegenerate = () => {
    if (!active) return;
    const lastUserIdx = [...active.messages].reverse().findIndex((m) => m.role === 'user');
    if (lastUserIdx === -1) return;
    const cutoff = active.messages.length - lastUserIdx;
    const trimmed = active.messages.slice(0, cutoff);
    updateConversation(active.id, { messages: trimmed });
    runAssistantTurn(active.id, trimmed);
  };

  const handleEdit = (messageId: string, newContent: string) => {
    if (!active) return;
    const idx = active.messages.findIndex((m) => m.id === messageId);
    if (idx === -1) return;
    const edited: ChatMessage = { ...active.messages[idx], content: newContent };
    const trimmed = [...active.messages.slice(0, idx), edited];
    updateConversation(active.id, { messages: trimmed });
    runAssistantTurn(active.id, trimmed);
  };

  const handleNewChat = () => {
    const conv = createConversation();
    setActiveId(conv.id);
    window.history.pushState(null, '', `/chat/${conv.id}`);
  };

  if (!hydrated) return null;

  return (
    <div className="flex h-dvh bg-ink">
      <Sidebar
        conversations={conversations}
        activeId={active?.id}
        onNewChat={handleNewChat}
        onDelete={(id) => {
          deleteConversation(id);
          if (id === active?.id) setActiveId(undefined);
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ink-line px-5 py-3">
          <p className="truncate text-sm text-muted">{active?.title ?? 'New chat'}</p>
          <ModelSelector
            value={active?.model ?? 'claude-sonnet-4-6'}
            onChange={(model) => active && updateConversation(active.id, { model })}
          />
        </header>

        <main className="flex-1 overflow-y-auto">
          {!active || active.messages.length === 0 ? (
            <EmptyState onPick={handleSend} />
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6">
              {active.messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  onRegenerate={m.role === 'assistant' ? handleRegenerate : undefined}
                  onEdit={m.role === 'user' ? (text) => handleEdit(m.id, text) : undefined}
                />
              ))}
              {streamingText !== null && (
                <MessageBubble
                  message={{ id: 'streaming', role: 'assistant', content: streamingText, createdAt: Date.now() }}
                  isStreaming
                />
              )}
              {error && (
                <div className="rounded-lg border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber">
                  {error}
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </main>

        <PromptInput onSend={handleSend} onStop={stop} isStreaming={isStreaming} />
      </div>
    </div>
  );
}
