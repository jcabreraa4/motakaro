import { ConvexError, v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import { internalMutation, mutation, query } from './_generated/server';
import { getClientAuth, verifyAdminAuth, verifyClientAuth } from './auth';

export const list = query({
  args: {
    limit: v.optional(v.number()),
    filter: v.optional(v.literal('actives'))
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Return Actives
    if (args.filter) {
      const threshold = Date.now() - 60000;
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
    id: v.optional(v.string()),
    clerkId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    try {
      // Return Contact
      if (args.id) {
        return await ctx.db.get(args.id as Id<'contacts'>);
      } else if (args.clerkId) {
        return await ctx.db
          .query('contacts')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId!))
          .first();
      }
    } catch {
      return null;
    }
  }
});

// Client Functions

export const clientGet = query({
  handler: async (ctx) => {
    // Obtain Identity
    const identity = await getClientAuth(ctx);
    if (!identity) return null;

    try {
      // Return Contact
      return await ctx.db
        .query('contacts')
        .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
        .first();
    } catch {
      return null;
    }
  }
});

export const clientUpdate = mutation({
  args: {
    onboarded: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Obtain Identity
    const identity = await verifyClientAuth(ctx);

    // Obtain Contact
    const contact = await ctx.db
      .query('contacts')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();
    if (!contact) throw new ConvexError('Contact not found');

    // Update Contact
    await ctx.db.patch(contact._id, {
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
    // Obtain Contact
    const contact = await ctx.db
      .query('contacts')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (contact) {
      // Update Contact
      await ctx.db.patch(contact._id, { ...args, updated: Date.now() });
    } else {
      // Create Contact
      await ctx.db.insert('contacts', {
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
    // Obtain Contact
    const contact = await ctx.db
      .query('contacts')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();
    if (!contact) throw new ConvexError('Contact not found');

    // Remove Memberships
    const memberships = await ctx.db
      .query('memberships')
      .withIndex('by_contactId', (q) => q.eq('contactId', contact._id))
      .collect();
    await Promise.all(memberships.map((m) => ctx.db.delete(m._id)));

    // Remove Contact
    await ctx.db.delete(contact._id);
  }
});
