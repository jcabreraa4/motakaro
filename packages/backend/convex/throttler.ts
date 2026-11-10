import { DAY, MINUTE, RateLimiter } from '@convex-dev/rate-limiter';
import { v } from 'convex/values';

import { components } from './_generated/api';
import { mutation } from './_generated/server';

const rateLimiter = new RateLimiter(components.rateLimiter, {
  bucket: { kind: 'token bucket', rate: 6, period: MINUTE, capacity: 3 },
  daily: { kind: 'fixed window', rate: 20, period: DAY }
});

export const bucketLimiter = mutation({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await rateLimiter.limit(ctx, 'bucket', { key: args.key });
  }
});

export const dailyLimiter = mutation({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await rateLimiter.limit(ctx, 'daily', { key: args.key });
  }
});
