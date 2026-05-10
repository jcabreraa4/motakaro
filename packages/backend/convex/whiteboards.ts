import { mutation, query } from './_generated/server';
import type { Id } from './_generated/dataModel';
import { ConvexError, v } from 'convex/values';
import { verifyAdminAuth } from './auth';

// Admins Functions

export const list = query({
  args: {
    filter: v.optional(v.union(v.literal('own'), v.id('companies')))
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Check for Filter
    if (args.filter === 'own') {
      // Return the Whiteboards
      return await ctx.db
        .query('whiteboards')
        .withIndex('by_companyId_updated', (q) => q.eq('companyId', undefined))
        .order('desc')
        .collect();
    } else if (args.filter) {
      // Return the Whiteboards
      return await ctx.db
        .query('whiteboards')
        .withIndex('by_companyId_updated', (q) => q.eq('companyId', args.filter as Id<'companies'>))
        .order('desc')
        .collect();
    }

    // Return all Whiteboards
    return await ctx.db
      .query('whiteboards')
      .withIndex('by_updated', (q) => q)
      .order('desc')
      .collect();
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
      // Return the Whiteboard
      return await ctx.db.get(args.id as Id<'whiteboards'>);
    } catch {
      return null;
    }
  }
});

export const create = mutation({
  handler: async (ctx) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Create the Whiteboard
    return await ctx.db.insert('whiteboards', {
      name: 'Untitled Whiteboard',
      note: '',
      content: '',
      starred: false,
      updated: Date.now()
    });
  }
});

export const remove = mutation({
  args: {
    id: v.id('whiteboards')
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Obtain the Whiteboard
    const whiteboard = await ctx.db.get(args.id);
    if (!whiteboard) throw new ConvexError('Whiteboard not found');

    // Remove the Whiteboard
    await ctx.db.delete(args.id);
  }
});

export const update = mutation({
  args: {
    id: v.id('whiteboards'),
    name: v.optional(v.string()),
    note: v.optional(v.string()),
    content: v.optional(v.string()),
    starred: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Obtain the Whiteboard
    const whiteboard = await ctx.db.get(args.id);
    if (!whiteboard) throw new ConvexError('Whiteboard not found');

    // Update the Whiteboard
    await ctx.db.patch(args.id, {
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.note !== undefined ? { note: args.note } : {}),
      ...(args.content !== undefined ? { content: args.content } : {}),
      ...(args.starred !== undefined ? { starred: args.starred } : {}),
      updated: Date.now()
    });
  }
});
