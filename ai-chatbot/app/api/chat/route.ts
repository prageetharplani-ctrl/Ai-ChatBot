import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import type { ModelId } from '@/types/chat';

export const runtime = 'edge';
export const maxDuration = 30;

const SYSTEM_PROMPT = `You are a helpful, natural-sounding AI assistant embedded in a chat app called Relay.
Keep responses concise unless the person asks for depth. Use markdown (including fenced code blocks
with a language tag) where it aids clarity. Explain difficult concepts simply. If you are unsure of a
fact, say so rather than guessing.`;

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages, model }: { messages: IncomingMessage[]; model: ModelId } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Server is missing ANTHROPIC_API_KEY. Add it to .env.local.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = streamText({
      model: anthropic(model || 'claude-sonnet-4-6'),
      system: SYSTEM_PROMPT,
      messages,
      maxOutputTokens: 4096,
    });

    return result.toTextStreamResponse();
  } catch (err) {
    console.error('chat route error', err);
    return new Response(JSON.stringify({ error: 'Something went wrong talking to the model.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
