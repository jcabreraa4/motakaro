import { openai } from '@ai-sdk/openai';
import { Agent, stepCountIs } from '@convex-dev/agent';

import { components } from './_generated/api';

export const chatbot = new Agent(components.agent, {
  name: 'Motakaro Assistant',
  languageModel: openai.chat('gpt-4o-mini'),
  stopWhen: stepCountIs(15),
  instructions: 'You are the helpful, approachable, personal assistant in Motakaro.'
});
