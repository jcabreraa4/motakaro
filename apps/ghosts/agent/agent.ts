import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import type { LanguageModel } from 'ai';
import { defineAgent } from 'eve';

const openrouter = createOpenRouter();

const model: LanguageModel = openrouter('z-ai/glm-5.3-flash');

export default defineAgent({
  model,
  modelContextWindowTokens: 1_048_576,
  reasoning: 'high'
});
