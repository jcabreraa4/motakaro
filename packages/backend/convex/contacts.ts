import { internalMutation, mutation, query } from './_generated/server';
import { verifyAdminAuth, verifyClientAuth } from './auth';
import { ConvexError, v } from 'convex/values';
import { Id } from './_generated/dataModel';

export const list = query({
  args: {
    filter: v.optional(v.union(v.literal('actives')))
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    // Check for Filter
    if (args.filter === 'actives') {
      // Return active Contacts
      const threshold = Date.now() - 30000;
      return await ctx.db
        .query('contacts')
        .filter((q) => q.gte(q.field('seen'), threshold))
        .collect();
    }

    // Return all Contacts
    return await ctx.db.query('contacts').collect();
  }
});

export const get = query({
  args: {
    id: v.optional(v.string()),
    clerkId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    try {
      // Return one Contact
      if (args.id) return await ctx.db.get('contacts', args.id as Id<'contacts'>);
      if (args.clerkId) {
        return await ctx.db
          .query('contacts')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId!))
          .first();
      }
      return null;
    } catch {
      return null;
    }
  }
});

export const update = mutation({
  args: {
    clerkId: v.string()
  },
  handler: async (ctx, { clerkId }) => {
    // Check Identity
    const identity = await verifyClientAuth(ctx);

    // Obtain the Contact
    const contact = await ctx.db
      .query('contacts')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!contact) throw new ConvexError('Not found');

    // Update the Contact
    if (contact) await ctx.db.patch(contact._id, { seen: Date.now() });
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
    const contact = await ctx.db
      .query('contacts')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();
    if (contact) {
      await ctx.db.patch(contact._id, args);
    } else {
      await ctx.db.insert('contacts', args);
    }
  }
});

export const remove = internalMutation({
  args: {
    clerkId: v.string()
  },
  handler: async (ctx, { clerkId }) => {
    const contact = await ctx.db
      .query('contacts')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();
    if (contact) await ctx.db.delete(contact._id);
  }
});
