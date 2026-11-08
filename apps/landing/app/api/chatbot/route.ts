import type { NextRequest } from 'next/server';

import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { UIMessage, convertToModelMessages, createUIMessageStreamResponse, streamText, toUIMessageStream } from 'ai';

const model = process.env.OPENROUTER_MODEL || 'z-ai/glm-5.3-flash';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

export async function POST(request: NextRequest) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: openrouter.chat(model),
    messages: await convertToModelMessages(messages),
    instructions: 'You are Tokito, the Motakaro AI assistant. You help landing visitors with information about the company. Motakaro is a B2B GTM Agency.'
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream })
  });
}
