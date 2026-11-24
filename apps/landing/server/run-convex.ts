import { ConvexHttpClient } from 'convex/browser';

import { env } from '@/env';

const convex = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);

export async function runConvex() {
  // Return Convex
  return { convex };
}
