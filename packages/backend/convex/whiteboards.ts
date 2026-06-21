import { ConvexError, v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { verifyAdminAuth } from './auth';

export const list = query({
  args: {
    organizationId: v.optional(v.id('organizations'))
  },
  handler: async (ctx, args) => {
    // Verify Identity
    await verifyAdminAuth(ctx);

    // Return Whiteboards
    return await ctx.db
      .query('whiteboards')
      .withIndex('by_organizationId_updated', (q) => q.eq('organizationId', args.organizationId))
      .order('desc')
      .collect();
  }
});

export const get = query({
  args: {
    id: v.string()
  },
  handler: async (ctx, args) => {
    // Verify Identity
    await verifyAdminAuth(ctx);

    try {
      // Return Whiteboard
      return await ctx.db.get(args.id as Id<'whiteboards'>);
    } catch {
      return null;
    }
  }
});

export const create = mutation({
  args: {
    organizationId: v.optional(v.id('organizations'))
  },
  handler: async (ctx, args) => {
    // Verify Identity
    await verifyAdminAuth(ctx);

    // Create Whiteboard
    return await ctx.db.insert('whiteboards', {
      name: 'Untitled Whiteboard',
      note: '',
      content: '',
      starred: false,
      updated: Date.now(),
      organizationId: args.organizationId
    });
  }
});

export const remove = mutation({
  args: {
    id: v.id('whiteboards')
  },
  handler: async (ctx, args) => {
    // Verify Identity
    await verifyAdminAuth(ctx);

    // Obtain Whiteboard
    const whiteboard = await ctx.db.get(args.id);
    if (!whiteboard) throw new ConvexError('Whiteboard not found');

    // Remove Whiteboard
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
    // Verify Identity
    await verifyAdminAuth(ctx);

    // Obtain Whiteboard
    const whiteboard = await ctx.db.get(args.id);
    if (!whiteboard) throw new ConvexError('Whiteboard not found');

    // Update Whiteboard
    await ctx.db.patch(args.id, {
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.note !== undefined ? { note: args.note } : {}),
      ...(args.content !== undefined ? { content: args.content } : {}),
      ...(args.starred !== undefined ? { starred: args.starred } : {}),
      updated: Date.now()
    });
  }
});
