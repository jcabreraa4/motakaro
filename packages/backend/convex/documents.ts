import { ConvexError, v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { getClientAuth, verifyAdminAuth, verifyClientAuth } from './auth';

export const list = query({
  args: {
    limit: v.optional(v.number()),
    organizationId: v.optional(v.id('organizations'))
  },
  handler: async (ctx, args) => {
    // Verify Identity
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
    // Verify Identity
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
    // Verify Identity
    await verifyAdminAuth(ctx);

    // Create Document
    return await ctx.db.insert('documents', {
      name: 'Untitled Document',
      note: '',
      content: '',
      starred: false,
      updated: Date.now(),
      clientVisible: false,
      clientStarred: false,
      organizationId: args.organizationId
    });
  }
});

export const remove = mutation({
  args: {
    id: v.id('documents')
  },
  handler: async (ctx, args) => {
    // Verify Identity
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
    // Verify Identity
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

// Client Functions

export const clientList = query({
  handler: async (ctx) => {
    // Obtain Identity
    const identity = await getClientAuth(ctx);
    if (!identity) return null;

    // Obtain Organization
    const clerkId = identity.org_id as string;
    if (!clerkId) throw new ConvexError('Organization not found');

    const organization = await ctx.db
      .query('organizations')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!organization) throw new ConvexError('Organization not found');

    // Return Documents
    return await ctx.db
      .query('documents')
      .withIndex('by_organizationId_clientVisible', (q) => q.eq('organizationId', organization._id).eq('clientVisible', true))
      .order('desc')
      .collect();
  }
});

export const clientGet = query({
  args: {
    id: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain Identity
    const identity = await getClientAuth(ctx);
    if (!identity) return null;

    // Obtain Organization
    const clerkId = identity.org_id as string;
    if (!clerkId) throw new ConvexError('Organization not found');

    const organization = await ctx.db
      .query('organizations')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!organization) throw new ConvexError('Organization not found');

    try {
      // Obtain Document
      const document = await ctx.db.get(args.id as Id<'documents'>);
      if (!document) return null;

      // Check Ownership
      if (document.organizationId !== organization._id) return null;

      // Return Document
      return document;
    } catch {
      return null;
    }
  }
});

export const clientCreate = mutation({
  handler: async (ctx) => {
    // Verify Identity
    const identity = await verifyClientAuth(ctx);

    // Obtain Organization
    const clerkId = identity.org_id as string;
    if (!clerkId) throw new ConvexError('Organization not found');

    const organization = await ctx.db
      .query('organizations')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!organization) throw new ConvexError('Organization not found');

    // Create Document
    return await ctx.db.insert('documents', {
      name: 'Untitled Document',
      note: '',
      content: '',
      starred: false,
      updated: Date.now(),
      clientVisible: true,
      clientStarred: false,
      organizationId: organization._id
    });
  }
});

export const clientRemove = mutation({
  args: {
    id: v.id('documents')
  },
  handler: async (ctx, args) => {
    // Verify Identity
    const identity = await verifyClientAuth(ctx);

    // Obtain Organization
    const clerkId = identity.org_id as string;
    if (!clerkId) throw new ConvexError('Organization not found');

    const organization = await ctx.db
      .query('organizations')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!organization) throw new ConvexError('Organization not found');

    // Obtain Document
    const document = await ctx.db.get(args.id);
    if (!document) throw new ConvexError('Document not found');

    // Check Ownership
    if (document.organizationId !== organization._id) {
      throw new ConvexError('Unauthorized');
    }

    // Remove Document
    await ctx.db.delete(args.id);
  }
});

export const clientUpdate = mutation({
  args: {
    id: v.id('documents'),
    name: v.optional(v.string()),
    note: v.optional(v.string()),
    content: v.optional(v.string()),
    clientStarred: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Verify Identity
    const identity = await verifyClientAuth(ctx);

    // Obtain Organization
    const clerkId = identity.org_id as string;
    if (!clerkId) throw new ConvexError('Organization not found');

    const organization = await ctx.db
      .query('organizations')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!organization) throw new ConvexError('Organization not found');

    // Obtain Document
    const document = await ctx.db.get(args.id);
    if (!document) throw new ConvexError('Document not found');

    // Check Ownership
    if (document.organizationId !== organization._id) {
      throw new ConvexError('Unauthorized');
    }

    // Update Document
    await ctx.db.patch(args.id, {
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.note !== undefined ? { note: args.note } : {}),
      ...(args.content !== undefined ? { content: args.content } : {}),
      ...(args.clientStarred !== undefined ? { clientStarred: args.clientStarred } : {}),
      updated: Date.now()
    });
  }
});
