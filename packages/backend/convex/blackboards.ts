import { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';

const adminsIssuer = process.env.CLERK_JWT_ADMINS_DOMAIN;

export const list = query({
  handler: async (ctx) => {
    // Return all Blackboards
    return await ctx.db.query('blackboards').collect();
  }
});

export const get = query({
  args: {
    id: v.string()
  },
  handler: async (ctx, args) => {
    try {
      // Check Identity
      const identity = await ctx.auth.getUserIdentity();
      if (!identity || identity.issuer !== adminsIssuer) {
        throw new ConvexError('Unauthorized');
      }

      // Return the Blackboard
      return await ctx.db.get('blackboards', args.id as Id<'blackboards'>);
    } catch {
      return null;
    }
  }
});

export const create = mutation({
  args: {
    name: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.issuer !== adminsIssuer) {
      throw new ConvexError('Unauthorized');
    }

    // Create one Blackboard
    return await ctx.db.insert('blackboards', {
      name: args.name ?? 'Untitled Board',
      note: '',
      starred: false,
      updated: Date.now()
    });
  }
});
