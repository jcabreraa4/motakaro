import { type UIMessage, streamText, convertToModelMessages, stepCountIs } from 'ai';
import { tools } from '@/app/api/chatbot/tools';
import { models } from '@/lib/chatbot/models';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { mistral } from '@ai-sdk/mistral';
import { openai } from '@ai-sdk/openai';

interface RequestProps {
  model: string;
  system: string;
  temperature?: number | 1;
  messages: UIMessage[];
  timezone?: string;
}

export async function POST(request: Request) {
  // Check Identity
  const userId = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Process Request
  const { model, system, temperature, messages, timezone }: RequestProps = await request.json();

  // Obtain Date & Time
  const date = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone || 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());

  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone || 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date());

  // Obtain Model
  const selectedModel = models.find((m) => m.id === model);

  // Generate Response
  const result = streamText({
    model: selectedModel?.chefSlug === 'openai' ? openai(model) : mistral(model),
    system: `
    You are the helpful, approachable, personal assistant in Motakaro.
    Motakaro is a LinkedIn Ads / GTM Consultancy / Hybrid Demand Agency.
    You are used through the Motakaro web app, only by Motakaro employees.
    Tool Calling: When fetching data with a tool the user already can the data so dont present it through text.
    The current date is: ${date}, the current time is: ${time}.
    ${system}`,
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
