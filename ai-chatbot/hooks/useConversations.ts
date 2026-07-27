'use client';

import { useCallback, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import type { Conversation, ModelId } from '@/types/chat';

const STORAGE_KEY = 'relay:conversations';
const DEFAULT_MODEL: ModelId = 'claude-sonnet-4-6';

function loadAll(): Conversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Conversation[]) : [];
  } catch {
    return [];
  }
}

function saveAll(list: Conversation[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setConversations(loadAll());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Conversation[]) => {
    setConversations(next);
    saveAll(next);
  }, []);

  const createConversation = useCallback(
    (model: ModelId = DEFAULT_MODEL) => {
      const conv: Conversation = {
        id: nanoid(10),
        title: 'New chat',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        model,
        messages: [],
      };
      persist([conv, ...conversations]);
      return conv;
    },
    [conversations, persist]
  );

  const updateConversation = useCallback(
    (id: string, patch: Partial<Conversation>) => {
      persist(
        conversations.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: Date.now() } : c))
      );
    },
    [conversations, persist]
  );

  const deleteConversation = useCallback(
    (id: string) => {
      persist(conversations.filter((c) => c.id !== id));
    },
    [conversations, persist]
  );

  const getConversation = useCallback(
    (id: string) => conversations.find((c) => c.id === id),
    [conversations]
  );

  return {
    conversations,
    hydrated,
    createConversation,
    updateConversation,
    deleteConversation,
    getConversation,
  };
}
