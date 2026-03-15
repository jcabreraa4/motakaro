import { internalMutation, query } from './_generated/server';
import { v } from 'convex/values';

const adminsIssuer = process.env.CLERK_JWT_ADMINS_DOMAIN;

export const list = query({
  handler: async (ctx) => {
    // Check Identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.issuer !== adminsIssuer) {
      throw new Error('Unauthorized');
    }

    // Return all Contacts
    return await ctx.db.query('contacts').collect();
  }
});

export const get = query({
  args: {
    id: v.optional(v.id('contacts')),
    clerkId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.issuer !== adminsIssuer) {
      throw new Error('Unauthorized');
    }

    // Return one Contact
    if (args.id) return await ctx.db.get(args.id);
    if (args.clerkId) {
      return await ctx.db
        .query('contacts')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId!))
        .first();
    }
    return null;
  }
});

export const upsert = internalMutation({
  args: {
    name: v.optional(v.string()),
    surname: v.optional(v.string()),
    email: v.string(),
    avatar: v.optional(v.string()),
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    const contact = await ctx.db
      .query('contacts')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();
    if (contact) {
      await ctx.db.patch(contact._id, args);
    } else {
      await ctx.db.insert('contacts', args);
    }
  }
});

export const remove = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const contact = await ctx.db
      .query('contacts')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();
    if (contact) await ctx.db.delete(contact._id);
  }
});
