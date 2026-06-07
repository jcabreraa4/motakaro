import { openai } from '@ai-sdk/openai';
import { Agent } from '@convex-dev/agent';
import { v } from 'convex/values';

import { components } from './_generated/api';
import { action, mutation } from './_generated/server';

export const assistant = new Agent(components.agent, {
  name: 'Motakaro Assistant',
  languageModel: openai.chat('gpt-4o-mini'),
  embeddingModel: openai.embedding('text-embedding-3-small'),
  instructions: 'Eres el asistente de Motakaro...',
  maxSteps: 15
});

export const createThread = action({
  args: {
    prompt: v.string()
  },
  handler: async (ctx, { prompt }) => {
    const { threadId, thread } = await assistant.createThread(ctx, {});

    const result = await thread.generateText({ prompt });

    return { threadId, text: result.text };
  }
});

export const continueThread = action({
  args: {
    prompt: v.string(),
    threadId: v.string()
  },
  handler: async (ctx, { prompt, threadId }) => {
    const { thread } = await assistant.continueThread(ctx, { threadId });
    const result = await thread.generateText({ prompt });
    return result.text;
  }
});
