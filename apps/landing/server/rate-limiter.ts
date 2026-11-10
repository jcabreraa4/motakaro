import { headers } from 'next/headers';

import { api } from '@workspace/backend/_generated/api';

import { runConvex } from '@/server/run-convex';

export async function rateLimiter() {
  // Obtain Convex
  const { convex } = await runConvex();

  // Obtain Address
  const data = await headers();
  const ip = data.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous';

  // Check Limiter
  const { ok: bucketOk } = await convex.mutation(api.throttler.bucketLimiter, { key: ip });
  const { ok: dailyOk } = await convex.mutation(api.throttler.dailyLimiter, { key: ip });

  // Return Limiter
  const limited = bucketOk && dailyOk ? false : true;
  return { limited };
}
