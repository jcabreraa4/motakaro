'use client';

import { ConvexProvider as ConvexClientProvider, ConvexReactClient } from 'convex/react';

import { env } from '@/env';

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

export function ConvexProvider({ children }: { children: React.ReactNode }) {
  return <ConvexClientProvider client={convex}>{children}</ConvexClientProvider>;
}
