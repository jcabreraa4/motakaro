import { Id } from './_generated/dataModel';
import { internalMutation, mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';

const adminsIssuer = process.env.CLERK_JWT_ADMINS_DOMAIN;

export const list = query({
  handler: async (ctx) => {
    // Check Identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.issuer !== adminsIssuer) {
      throw new ConvexError('Unauthorized');
    }

    // Return all Workers
    return await ctx.db.query('workers').collect();
  }
});

export const get = query({
  args: {
    id: v.optional(v.string()),
    clerkId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    try {
      // Check Identity
      const identity = await ctx.auth.getUserIdentity();
      if (!identity || identity.issuer !== adminsIssuer) {
        throw new ConvexError('Unauthorized');
      }

      // Return one Worker
      if (args.id) return await ctx.db.get('workers', args.id as Id<'workers'>);
      if (args.clerkId) {
        return await ctx.db
          .query('workers')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId!))
          .first();
      }
      return null;
    } catch {
      return null;
    }
  }
});

export const getActive = query({
  handler: async (ctx) => {
    // Check Identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.issuer !== adminsIssuer) {
      throw new ConvexError('Unauthorized');
    }

    // Obtain the Workers
    const threshold = Date.now() - 30000;
    return await ctx.db
      .query('workers')
      .filter((q) => q.gte(q.field('seen'), threshold))
      .collect();
  }
});

export const update = mutation({
  args: {
    clerkId: v.string()
  },
  handler: async (ctx, { clerkId }) => {
    // Check Identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.issuer !== adminsIssuer) {
      throw new ConvexError('Unauthorized');
    }

    // Obtain the Worker
    const worker = await ctx.db
      .query('workers')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!worker) throw new ConvexError('Not found');

    // Update the Worker
    if (worker) await ctx.db.patch(worker._id, { seen: Date.now() });
  }
});

// Internal Mutations

export const upsert = internalMutation({
  args: {
    name: v.optional(v.string()),
    surname: v.optional(v.string()),
    email: v.string(),
    avatar: v.optional(v.string()),
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    const worker = await ctx.db
      .query('workers')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();
    if (worker) {
      await ctx.db.patch(worker._id, args);
    } else {
      await ctx.db.insert('workers', args);
    }
  }
});

export const remove = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const worker = await ctx.db
      .query('workers')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();
    if (worker) await ctx.db.delete(worker._id);
  }
});
