import { ConvexError, v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import { internalMutation, mutation, query } from './_generated/server';
import { verifyAdminAuth, verifyClientAuth } from './auth';

// Admins Functions

export const list = query({
  args: {
    limit: v.optional(v.number()),
    filter: v.optional(v.literal('actives'))
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Check Filter
    if (args.filter) {
      // Return Contacts
      const threshold = Date.now() - 30000;
      const query = ctx.db
        .query('contacts')
        .filter((q) => q.gte(q.field('seen'), threshold))
        .order('desc');
      return args.limit ? await query.take(args.limit) : await query.collect();
    }

    // Return Contacts
    const query = ctx.db.query('contacts').order('desc');
    return args.limit ? await query.take(args.limit) : await query.collect();
  }
});

export const get = query({
  args: {
    id: v.string()
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    try {
      // Return Contact
      return await ctx.db.get(args.id as Id<'contacts'>);
    } catch {
      return null;
    }
  }
});

// Clients Functions

export const clientsUpdate = mutation({
  handler: async (ctx) => {
    // Check Identity
    const identity = await verifyClientAuth(ctx);

    // Obtain Contact
    const contact = await ctx.db
      .query('contacts')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();
    if (!contact) throw new ConvexError('Contact not found');

    // Update Contact
    if (contact) await ctx.db.patch(contact._id, { seen: Date.now() });
  }
});

// Internal Mutations

export const internalUpsert = internalMutation({
  args: {
    name: v.optional(v.string()),
    surname: v.optional(v.string()),
    email: v.string(),
    avatar: v.optional(v.string()),
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain Contact
    const contact = await ctx.db
      .query('contacts')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (contact) {
      // Update Contact
      await ctx.db.patch(contact._id, args);
    } else {
      // Create Contact
      await ctx.db.insert('contacts', { ...args, onboarded: false });
    }
  }
});

export const internalRemove = internalMutation({
  args: {
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain Contact
    const contact = await ctx.db
      .query('contacts')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();
    if (!contact) throw new ConvexError('Contact not found');

    // Remove Contact
    await ctx.db.delete(contact._id);
  }
});
