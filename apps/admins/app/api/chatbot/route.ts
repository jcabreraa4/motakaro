import { type UIMessage, streamText, convertToModelMessages, stepCountIs } from 'ai';
import { tools } from '@/app/api/chatbot/tools';
import { models } from '@/lib/chatbot/models';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { mistral } from '@ai-sdk/mistral';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

interface RequestProps {
  model: string;
  system: string;
  temperature?: number | 1;
  messages: UIMessage[];
}

export async function POST(request: Request) {
  // Check Identity
  const userId = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Obtain Request
  const { model, system, temperature, messages }: RequestProps = await request.json();

  // Obtain AI Model
  const selectedModel = models.find((m) => m.id === model);

  // Generate Response
  const result = streamText({
    model: selectedModel?.chefSlug === 'openai' ? openai(model) : selectedModel?.chefSlug === 'google' ? google(model) : mistral(model),
    system: `${system}`,
    temperature: temperature,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: tools
  });

  // Return Response
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true
  });
}
