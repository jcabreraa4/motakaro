import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    // Clerk
    CLERK_SECRET_KEY: z.string().min(1),

    // Trigger
    TRIGGER_SECRET_KEY: z.string().min(1),

    // Sentry
    SENTRY_AUTH_TOKEN: z.string().min(1).optional() // Production Only
  },
  client: {
    // System
    NEXT_PUBLIC_REDIRECT_PAGE: z.string().startsWith('/'),
    NEXT_PUBLIC_SIGN_IN_ACTIVE: z.stringbool(),
    NEXT_PUBLIC_SIGN_UP_ACTIVE: z.stringbool(),
    NEXT_PUBLIC_ORG_SELECTION_URL: z.string().startsWith('/'),

    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().startsWith('/'),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().startsWith('/'),
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string().startsWith('/'),
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string().startsWith('/'),

    // Convex
    NEXT_PUBLIC_CONVEX_URL: z.url(),

    // Eve
    NEXT_PUBLIC_EVE_URL: z.url(),

    // Sentry
    NEXT_PUBLIC_SENTRY_DSN: z.url().optional() // Production Only
  },
  // Client Destructuring
  experimental__runtimeEnv: {
    // System
    NEXT_PUBLIC_REDIRECT_PAGE: process.env.NEXT_PUBLIC_REDIRECT_PAGE,
    NEXT_PUBLIC_SIGN_IN_ACTIVE: process.env.NEXT_PUBLIC_SIGN_IN_ACTIVE,
    NEXT_PUBLIC_SIGN_UP_ACTIVE: process.env.NEXT_PUBLIC_SIGN_UP_ACTIVE,
    NEXT_PUBLIC_ORG_SELECTION_URL: process.env.NEXT_PUBLIC_ORG_SELECTION_URL,

    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,

    // Convex
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,

    // Eve
    NEXT_PUBLIC_EVE_URL: process.env.NEXT_PUBLIC_EVE_URL,

    // Sentry
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN
  },
  // Empty Strings
  emptyStringAsUndefined: true
});
