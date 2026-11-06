import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { defineAgent } from 'eve';
import type { AgentReasoningDefinition, EveLanguageModel } from 'eve';

const model = process.env.OPENROUTER_MODEL || 'z-ai/glm-5.3-flash';
const context = Number(process.env.OPENROUTER_CONTEXT || 1048576);
const reasoning = (process.env.OPENROUTER_REASONING || 'provider-default') as AgentReasoningDefinition;

const openrouter = createOpenRouter();

const languageModel: EveLanguageModel = openrouter(model);

export default defineAgent({
  model: languageModel,
  modelContextWindowTokens: context,
  reasoning: reasoning
});
