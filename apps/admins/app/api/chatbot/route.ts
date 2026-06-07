import { openai } from '@ai-sdk/openai';
import { type UIMessage, convertToModelMessages, stepCountIs, streamText } from 'ai';

import { chatbotTools } from '@/app/api/chatbot/tools';
import { getConvex } from '@/server/get-convex';
import { verifyAuth } from '@/server/verify-auth';

interface RequestProps {
  system: string;
  temperature?: number | 1;
  messages: UIMessage[];
  timezone?: string;
}

export async function POST(request: Request) {
  // Check Identity
  await verifyAuth();

  // Process Request
  const { system, temperature, messages, timezone }: RequestProps = await request.json();

  // Obtain Convex
  const { convex } = await getConvex();

  // Obtain Calendar
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

  // Generate Response
  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `
    You are the helpful, approachable, personal assistant in Motakaro.
    Motakaro is a LinkedIn Ads / GTM Consultancy / Hybrid Demand Agency.
    You are used through the Motakaro web app, only by Motakaro employees.

    Tool Calling: When fetching data with a tool the user already can the data so dont present it through text.

    Current date is: ${date}. Current time is: ${time}.
    ${system}`,
    temperature: temperature,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(15),
    tools: chatbotTools(convex)
  });

  // Return Response
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true
  });
}
