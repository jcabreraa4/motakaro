import type { NextRequest } from 'next/server';

import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { UIMessage, convertToModelMessages, createUIMessageStreamResponse, streamText, toUIMessageStream } from 'ai';

import instructions from '@/app/api/chatbot/instructions.md' with { type: 'text' };
import { env } from '@/env';
import { rateLimiter } from '@/server/rate-limiter';

const model = env.OPENROUTER_MODEL;

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY
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
    instructions: instructions
  });

  // Return Response
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream })
  });
}
