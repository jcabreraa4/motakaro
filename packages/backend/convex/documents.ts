import { ConvexError, v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { verifyAdminAuth } from './auth';

export const list = query({
  args: {
    limit: v.optional(v.number()),
    organizationId: v.optional(v.id('organizations'))
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Return Documents
    const query = ctx.db
      .query('documents')
      .withIndex('by_organizationId_updated', (q) => q.eq('organizationId', args.organizationId))
      .order('desc');
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
      // Return Document
      return await ctx.db.get(args.id as Id<'documents'>);
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
    // Check Identity
    await verifyAdminAuth(ctx);

    // Create Document
    return await ctx.db.insert('documents', {
      name: 'Untitled Document',
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
    id: v.id('documents')
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Obtain Document
    const document = await ctx.db.get(args.id);
    if (!document) throw new ConvexError('Document not found');

    // Remove Document
    await ctx.db.delete(args.id);
  }
});

export const update = mutation({
  args: {
    id: v.id('documents'),
    name: v.optional(v.string()),
    note: v.optional(v.string()),
    content: v.optional(v.string()),
    starred: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Obtain Document
    const document = await ctx.db.get(args.id);
    if (!document) throw new ConvexError('Document not found');

    // Update Document
    await ctx.db.patch(args.id, {
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.note !== undefined ? { note: args.note } : {}),
      ...(args.content !== undefined ? { content: args.content } : {}),
      ...(args.starred !== undefined ? { starred: args.starred } : {}),
      updated: Date.now()
    });
  }
});
