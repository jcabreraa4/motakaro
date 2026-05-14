import { mutation, query } from './_generated/server';
import type { Id } from './_generated/dataModel';
import { ConvexError, v } from 'convex/values';
import { verifyAdminAuth } from './auth';

// Admins Functions

export const list = query({
  args: {
    companyId: v.optional(v.id('companies'))
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Check for Filter
    if (args.companyId) {
      // Return the Documents
      return await ctx.db
        .query('documents')
        .withIndex('by_companyId_updated', (q) => q.eq('companyId', args.companyId))
        .order('desc')
        .collect();
    }

    // Return the Documents
    return await ctx.db
      .query('documents')
      .withIndex('by_companyId_updated', (q) => q.eq('companyId', undefined))
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
      // Return the Document
      return await ctx.db.get(args.id as Id<'documents'>);
    } catch {
      return null;
    }
  }
});

export const create = mutation({
  handler: async (ctx) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Create the Document
    return await ctx.db.insert('documents', {
      name: 'Untitled Document',
      note: '',
      content: '',
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
    await verifyAdminAuth(ctx);

    // Obtain the Document
    const document = await ctx.db.get(args.id);
    if (!document) throw new ConvexError('Document not found');

    // Remove the Document
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

    // Obtain the Document
    const document = await ctx.db.get(args.id);
    if (!document) throw new ConvexError('Document not found');

    // Update the Document
    await ctx.db.patch(args.id, {
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.note !== undefined ? { note: args.note } : {}),
      ...(args.content !== undefined ? { content: args.content } : {}),
      ...(args.starred !== undefined ? { starred: args.starred } : {}),
      updated: Date.now()
    });
  }
});
