import { internalMutation, mutation, query } from './_generated/server';
import { verifyAdminAuth, verifyIdentity } from './auth';
import { ConvexError, v } from 'convex/values';
import { Id } from './_generated/dataModel';

export const list = query({
  args: {
    filter: v.optional(v.union(v.literal('actives')))
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Check for Filter
    if (args.filter === 'actives') {
      // Return active Contacts
      const threshold = Date.now() - 30000;
      return await ctx.db
        .query('contacts')
        .filter((q) => q.gte(q.field('seen'), threshold))
        .order('desc')
        .collect();
    }

    // Return all Contacts
    return await ctx.db.query('contacts').collect();
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
      // Return the Contact
      return await ctx.db.get(args.id as Id<'contacts'>);
    } catch {
      return null;
    }
  }
});

export const update = mutation({
  args: {
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyIdentity(ctx);

    // Obtain the Contact
    const contact = await ctx.db
      .query('contacts')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();
    if (!contact) throw new ConvexError('Contact not found');

    // Update the Contact
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
    // Obtain the Contact
    const contact = await ctx.db
      .query('contacts')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();

    // Check for Contact
    if (contact) {
      // Update the Contact
      await ctx.db.patch(contact._id, args);
    } else {
      // Create the Contact
      await ctx.db.insert('contacts', args);
    }
  }
});

export const internalRemove = internalMutation({
  args: {
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain the Contact
    const contact = await ctx.db
      .query('contacts')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();
    if (!contact) throw new ConvexError('Contact not found');

    // Remove the Contact
    await ctx.db.delete(contact._id);
  }
});
