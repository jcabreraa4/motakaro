import type { NextRequest } from 'next/server';

import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { UIMessage, convertToModelMessages, createUIMessageStreamResponse, streamText, toUIMessageStream } from 'ai';

import { rateLimiter } from '@/server/rate-limiter';

const model = process.env.OPENROUTER_MODEL || 'z-ai/glm-5.3-flash';
const instructions = 'You are Tokito, the Motakaro AI assistant. You help landing visitors with information about the company. Motakaro is a B2B GTM Agency. Write plain text responses, not markdown.';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

export async function POST(request: NextRequest) {
  // Limit Requests
  const { limited } = await rateLimiter();
  if (limited) return new Response('Too Many Requests', { status: 429 });

  // Obtain Messages
  const { messages }: { messages: UIMessage[] } = await request.json();

  // Generate Response
  const result = streamText({
    model: openrouter.chat(model),
    messages: await convertToModelMessages(messages),
    instructions
  });

  // Return Response
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream })
  });
}
