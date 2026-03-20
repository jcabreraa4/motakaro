import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { Id } from './_generated/dataModel';
import { verifyAdminAuth } from './auth';

export const list = query({
  handler: async (ctx) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    // Return all Whiteboards
    return await ctx.db.query('whiteboards').collect();
  }
});

export const get = query({
  args: {
    id: v.string()
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    try {
      // Return the Whiteboard
      return await ctx.db.get('whiteboards', args.id as Id<'whiteboards'>);
    } catch {
      return null;
    }
  }
});

export const create = mutation({
  args: {
    name: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    // Create one Whiteboard
    return await ctx.db.insert('whiteboards', {
      name: args.name ?? 'Untitled Whiteboard',
      note: '',
      starred: false,
      updated: Date.now(),
      content: ''
    });
  }
});

export const remove = mutation({
  args: {
    id: v.id('whiteboards')
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

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
    starred: v.optional(v.boolean()),
    content: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    // Obtain the Whiteboard
    const whiteboard = await ctx.db.get(args.id);
    if (!whiteboard) throw new ConvexError('Not found');

    // Update the Whiteboard
    await ctx.db.patch(args.id, {
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.starred !== undefined ? { starred: args.starred } : {}),
      ...(args.content !== undefined ? { content: args.content } : {}),
      updated: Date.now()
    });
  }
});
