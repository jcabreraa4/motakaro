import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { verifyAdminAuth } from './auth';

export const list = query({
  handler: async (ctx) => {
    // Check Identity
    await verifyAdminAuth(ctx);

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
    id: v.id('whiteboards')
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    try {
      // Return the Whiteboard
      return await ctx.db.get(args.id);
    } catch {
      return null;
    }
  }
});

export const create = mutation({
  handler: async (ctx, args) => {
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
    if (!whiteboard) throw new ConvexError('Not found');

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
    if (!whiteboard) throw new ConvexError('Not found');

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
