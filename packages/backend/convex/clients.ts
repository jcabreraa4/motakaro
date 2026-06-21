import { ConvexError, v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import { internalMutation, mutation, query } from './_generated/server';
import { getClientAuth, verifyAdminAuth, verifyClientAuth } from './auth';

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
        .query('clients')
        .filter((q) => q.gte(q.field('seen'), threshold))
        .order('desc')
        .collect();
    }

    // Return Clients
    return await ctx.db.query('clients').order('desc').collect();
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
      // Return Client
      if (args.id) {
        return await ctx.db.get(args.id as Id<'clients'>);
      } else if (args.clerkId) {
        return await ctx.db
          .query('clients')
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
      // Return Client
      return await ctx.db
        .query('clients')
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

    // Obtain Client
    const client = await ctx.db
      .query('clients')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();
    if (!client) throw new ConvexError('Client not found');

    // Update Client
    await ctx.db.patch(client._id, {
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
    // Obtain Client
    const client = await ctx.db
      .query('clients')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (client) {
      // Update Client
      await ctx.db.patch(client._id, { ...args, updated: Date.now() });
    } else {
      // Create Client
      await ctx.db.insert('clients', {
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
    // Obtain Client
    const client = await ctx.db
      .query('clients')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();
    if (!client) throw new ConvexError('Client not found');

    // Remove Memberships
    const memberships = await ctx.db
      .query('memberships')
      .withIndex('by_clientId', (q) => q.eq('clientId', client._id))
      .collect();
    await Promise.all(memberships.map((m) => ctx.db.delete(m._id)));

    // Remove Client
    await ctx.db.delete(client._id);
  }
});
