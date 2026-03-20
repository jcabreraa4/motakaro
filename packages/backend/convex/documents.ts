import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { Id } from './_generated/dataModel';
import { verifyAdminAuth } from './auth';

export const list = query({
  handler: async (ctx) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    // Return all Documents
    return await ctx.db
      .query('documents')
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
    const identity = await verifyAdminAuth(ctx);

    try {
      // Return one Document
      return await ctx.db.get('documents', args.id as Id<'documents'>);
    } catch {
      return null;
    }
  }
});

export const create = mutation({
  args: {
    name: v.optional(v.string()),
    content: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    // Create the Document
    return await ctx.db.insert('documents', {
      name: args.name ?? 'Untitled Document',
      note: '',
      content: args.content ?? '{"type":"doc","content":[]}',
      starred: false,
      updated: Date.now()
    });
  }
});

export const remove = mutation({
  args: {
    id: v.id('documents')
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    // Obtain the Document
    const document = await ctx.db.get(args.id);
    if (!document) throw new ConvexError('Not found');

    // Remove the Document
    await ctx.db.delete(args.id);
  }
});

export const update = mutation({
  args: {
    id: v.id('documents'),
    name: v.optional(v.string()),
    content: v.optional(v.string()),
    starred: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    // Obtain the Document
    const document = await ctx.db.get(args.id);
    if (!document) throw new ConvexError('Not found');

    // Update the Document
    await ctx.db.patch(args.id, {
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.content !== undefined ? { content: args.content } : {}),
      ...(args.starred !== undefined ? { starred: args.starred } : {}),
      updated: Date.now()
    });
  }
});
