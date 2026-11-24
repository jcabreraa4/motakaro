import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    // OpenRouter
    OPENROUTER_API_KEY: z.string().min(1),
    OPENROUTER_MODEL: z.string().min(1)
  },
  client: {
    // System
    NEXT_PUBLIC_VIDEO_URL: z.url(),
    NEXT_PUBLIC_CLIENTS_URL: z.url(),

    // Convex
    NEXT_PUBLIC_CONVEX_URL: z.url(),

    // Gamma
    NEXT_PUBLIC_GAMMA_URL: z.url(),

    // Calcom
    NEXT_PUBLIC_CALCOM_URL: z.url()
  },
  // Client Destructuring
  experimental__runtimeEnv: {
    // System
    NEXT_PUBLIC_VIDEO_URL: process.env.NEXT_PUBLIC_VIDEO_URL,
    NEXT_PUBLIC_CLIENTS_URL: process.env.NEXT_PUBLIC_CLIENTS_URL,

    // Convex
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,

    // Gamma
    NEXT_PUBLIC_GAMMA_URL: process.env.NEXT_PUBLIC_GAMMA_URL,

    // Calcom
    NEXT_PUBLIC_CALCOM_URL: process.env.NEXT_PUBLIC_CALCOM_URL
  }
});
