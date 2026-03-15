import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';

const adminsIssuer = process.env.CLERK_JWT_ADMINS_DOMAIN;

export const list = query({
  handler: async (ctx) => {
    // Return all Resources
    return await ctx.db.query('resources').collect();
  }
});

export const get = query({
  args: {
    id: v.id('resources')
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.issuer !== adminsIssuer) {
      throw new Error('Unauthorized');
    }

    // Return the Resource
    return await ctx.db.get(args.id);
  }
});

export const create = mutation({
  args: {
    name: v.string(),
    note: v.optional(v.string()),
    link: v.optional(v.string()),
    embed: v.optional(v.string()),
    starred: v.optional(v.boolean()),
    thumbnail: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.issuer !== adminsIssuer) {
      throw new Error('Unauthorized');
    }

    // Create one Resource
    return await ctx.db.insert('resources', {
      name: args.name,
      note: args.note ?? '',
      link: args.link ?? '',
      embed: args.embed ?? '',
      starred: args.starred ?? false,
      updated: Date.now(),
      thumbnail: args.thumbnail ?? ''
    });
  }
});
