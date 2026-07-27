export type Role = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  model: ModelId;
  messages: ChatMessage[];
}

export type ModelId = 'claude-sonnet-4-6' | 'claude-opus-4-8' | 'claude-haiku-4-5-20251001';

export const MODEL_LABELS: Record<ModelId, string> = {
  'claude-sonnet-4-6': 'Claude Sonnet',
  'claude-opus-4-8': 'Claude Opus',
  'claude-haiku-4-5-20251001': 'Claude Haiku',
};

export const SUGGESTED_PROMPTS = [
  'Explain quantum computing simply',
  'Build a portfolio website',
  'Teach me React from scratch',
  'Write a resume for a career switch',
  'Brainstorm business ideas',
  'Help me solve a DSA problem',
];
