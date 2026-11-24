import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { defineAgent } from 'eve';
import type { EveLanguageModel } from 'eve';

import { env } from '@/env';

const openrouter = createOpenRouter();

const languageModel: EveLanguageModel = openrouter(env.OPENROUTER_MODEL);

export default defineAgent({
  model: languageModel,
  modelContextWindowTokens: env.OPENROUTER_CONTEXT,
  reasoning: env.OPENROUTER_REASONING
});
