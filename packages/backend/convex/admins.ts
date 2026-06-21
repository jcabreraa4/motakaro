import { ConvexError, v } from 'convex/values';

import { internalMutation, mutation, query } from './_generated/server';
import { verifyAdminAuth } from './auth';

export const list = query({
  args: {
    filter: v.optional(v.literal('actives'))
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Return Actives
    if (args.filter) {
      const threshold = Date.now() - 60000;
      return await ctx.db
        .query('admins')
        .filter((q) => q.gte(q.field('seen'), threshold))
        .order('desc')
        .collect();
    }

    // Return Admins
    return await ctx.db.query('admins').order('desc').collect();
  }
});

export const get = query({
  handler: async (ctx) => {
    // Obtain Identity
    const identity = await verifyAdminAuth(ctx);

    try {
      // Return Admin
      return await ctx.db
        .query('admins')
        .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
        .first();
    } catch {
      return null;
    }
  }
});

export const update = mutation({
  args: {
    onboarded: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Obtain Identity
    const identity = await verifyAdminAuth(ctx);

    // Obtain Admin
    const admin = await ctx.db
      .query('admins')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();
    if (!admin) throw new ConvexError('Admin not found');

    // Update Admin
    await ctx.db.patch(admin._id, {
      ...(args.onboarded !== undefined ? { onboarded: args.onboarded } : {}),
      updated: Date.now(),
      seen: Date.now()
    });
  }
});

// Internal Mutations

export const internalUpsert = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    surname: v.string(),
    avatar: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain Admin
    const admin = await ctx.db
      .query('admins')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (admin) {
      // Update Admin
      await ctx.db.patch(admin._id, { ...args, updated: Date.now() });
    } else {
      // Create Admin
      await ctx.db.insert('admins', {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        surname: args.surname,
        avatar: args.avatar,
        onboarded: false,
        starred: false,
        updated: Date.now()
      });
    }
  }
});

export const internalRemove = internalMutation({
  args: {
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain Admin
    const admin = await ctx.db
      .query('admins')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();
    if (!admin) throw new ConvexError('Admin not found');

    // Remove Admin
    await ctx.db.delete(admin._id);
  }
});
