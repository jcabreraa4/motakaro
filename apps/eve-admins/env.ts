import type { AgentReasoningDefinition } from 'eve';
import { z } from 'zod';

const reasonings = ['provider-default', 'none', 'minimal', 'low', 'medium', 'high', 'xhigh'] as const satisfies readonly AgentReasoningDefinition[];

export const env = z
  .object({
    // System
    CORS_ORIGINS: z.string().min(1),

    // Clerk
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_PUBLISHABLE_KEY: z.string().min(1),

    // OpenRouter
    OPENROUTER_API_KEY: z.string().min(1),
    OPENROUTER_MODEL: z.string().min(1).default('z-ai/glm-5.3-flash'),
    OPENROUTER_CONTEXT: z.coerce.number().int().positive().default(1048576),
    OPENROUTER_REASONING: z.enum(reasonings).default('provider-default')
  })
  .parse(process.env);
