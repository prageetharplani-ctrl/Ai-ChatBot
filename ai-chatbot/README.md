# Relay — a working AI chat prototype

A streaming chat app built with Next.js 15 (App Router), the Vercel AI SDK, and the
Claude API. This is a working core, not the full 8,000+ line spec — see "What's not
included" below for the extension points.

## Design

- **Palette:** ink (`#16171B`) background, warm paper text, a muted teal accent
  (`#4FA98C`) with amber (`#E8A33D`) reserved for the streaming cursor and warnings.
- **Type:** Fraunces (display/wordmark), Inter (UI), JetBrains Mono (code).
- **Signature element:** the streaming cursor is a blinking amber dash, and empty
  states use the Fraunces wordmark instead of a generic "how can I help" line.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then paste your Anthropic API key
npm run dev
```

Open http://localhost:3000.

## What's included

- Streaming responses (server-sent via an Edge API route — the API key never
  reaches the browser)
- Markdown rendering with GitHub-flavored tables/lists
- Syntax-highlighted code blocks (Shiki) with a copy button
- Multiple conversations, stored in `localStorage`, with search
- New chat / delete chat / auto-generated titles
- Copy, edit-and-resend, and regenerate on messages
- Stop-generating button
- Model switcher (Sonnet / Opus / Haiku)
- Auto-growing input, Enter to send, Shift+Enter for a newline
- Suggested starter prompts on the empty state
- Keyboard-visible focus states, reduced-motion support, mobile-responsive layout

## What's not included (see the original spec for the full list)

These are straightforward to layer on top of this structure but were out of scope
for a first working prototype:

- **Auth / per-user accounts** — conversations currently live in the browser's
  `localStorage`, not a database. Swap `hooks/useConversations.ts` for calls to
  Supabase/Postgres once you add auth (Clerk was the suggested provider).
- **Server-side persistence & cross-device sync** — same reason as above.
- **File upload / PDF / CSV analysis** — would hang off a new `/api/upload` route.
- **Voice input/output** — would call Whisper (STT) and ElevenLabs (TTS) from the
  client and stream audio alongside text.
- **Vector memory / semantic search across past chats** — the current search is a
  simple substring match; real semantic search needs embeddings + a vector store.
- **Light theme** — only the dark "ink" theme is implemented; the token system in
  `tailwind.config.ts` is set up so a light variant is a matter of adding a second
  set of CSS variables.

## Project structure

```
app/
  api/chat/route.ts    Edge route that streams from the Claude API
  chat/[id]/page.tsx   A conversation view
  page.tsx             Empty/new-chat view
  layout.tsx           Fonts + global shell
  globals.css          Design tokens, prose styles, focus states
components/            Sidebar, ChatView, MessageBubble, PromptInput, CodeBlock, ...
hooks/                  useConversations (localStorage store), useChatStream (SSE reader)
types/chat.ts           Shared types + model list + suggested prompts
```
