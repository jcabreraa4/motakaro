import { ConvexError, v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { getClientAuth, verifyAdminAuth, verifyClientAuth, verifyIdentity } from './auth';

export const list = query({
  args: {
    limit: v.optional(v.number()),
    organizationId: v.optional(v.id('organizations'))
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Return Multimedia
    const query = ctx.db
      .query('multimedia')
      .withIndex('by_organizationId_updated', (q) => q.eq('organizationId', args.organizationId))
      .order('desc');
    const multimedia = args.limit ? await query.take(args.limit) : await query.collect();
    return await Promise.all(multimedia.map(async (file) => ({ ...file, url: await ctx.storage.getUrl(file.storageId) })));
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
      // Obtain File
      const file = await ctx.db.get(args.id as Id<'multimedia'>);
      if (!file) return null;

      // Obtain Storage
      const url = await ctx.storage.getUrl(file.storageId);
      if (!url) return null;

      // Return File
      return { ...file, url };
    } catch {
      return null;
    }
  }
});

export const create = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    size: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    storageId: v.id('_storage'),
    organizationId: v.optional(v.id('organizations'))
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Create File
    return await ctx.db.insert('multimedia', {
      name: args.name ?? 'Untitled File',
      note: '',
      type: args.type,
      size: args.size,
      width: args.width,
      height: args.height,
      starred: false,
      updated: Date.now(),
      storageId: args.storageId,
      organizationId: args.organizationId,
      clientVisible: false,
      clientStarred: false
    });
  }
});

export const remove = mutation({
  args: {
    id: v.id('multimedia')
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Obtain File
    const file = await ctx.db.get(args.id);
    if (!file) throw new ConvexError('File not found');

    // Remove File
    await ctx.storage.delete(file.storageId);
    await ctx.db.delete(args.id);
  }
});

export const update = mutation({
  args: {
    id: v.id('multimedia'),
    name: v.optional(v.string()),
    note: v.optional(v.string()),
    starred: v.optional(v.boolean()),
    clientVisible: v.optional(v.boolean()),
    clientStarred: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Obtain File
    const file = await ctx.db.get(args.id);
    if (!file) throw new ConvexError('File not found');

    // Update File
    await ctx.db.patch(args.id, {
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.note !== undefined ? { note: args.note } : {}),
      ...(args.starred !== undefined ? { starred: args.starred } : {}),
      ...(args.clientVisible !== undefined ? { clientVisible: args.clientVisible } : {}),
      ...(args.clientStarred !== undefined ? { clientStarred: args.clientStarred } : {}),
      updated: Date.now()
    });
  }
});

// Client Functions

export const clientList = query({
  args: {
    limit: v.optional(v.number())
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

    // Return Multimedia
    const query = ctx.db
      .query('multimedia')
      .withIndex('by_organizationId_clientVisible', (q) => q.eq('organizationId', organization._id).eq('clientVisible', true))
      .order('desc');
    const multimedia = args.limit ? await query.take(args.limit) : await query.collect();
    return await Promise.all(multimedia.map(async (file) => ({ ...file, url: await ctx.storage.getUrl(file.storageId) })));
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
      // Obtain File
      const file = await ctx.db.get(args.id as Id<'multimedia'>);
      if (!file) return null;

      // Check Ownership
      if (file.organizationId !== organization._id) return null;

      // Obtain Storage
      const url = await ctx.storage.getUrl(file.storageId);
      if (!url) return null;

      // Return File
      return { ...file, url };
    } catch {
      return null;
    }
  }
});

export const clientCreate = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    size: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    storageId: v.id('_storage')
  },
  handler: async (ctx, args) => {
    // Obtain Identity
    const identity = await verifyClientAuth(ctx);

    // Obtain Organization
    const clerkId = identity.org_id as string;
    if (!clerkId) throw new ConvexError('Organization not found');

    const organization = await ctx.db
      .query('organizations')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!organization) throw new ConvexError('Organization not found');

    // Create File
    return await ctx.db.insert('multimedia', {
      name: args.name ?? 'Untitled File',
      note: '',
      type: args.type,
      size: args.size,
      width: args.width,
      height: args.height,
      starred: false,
      updated: Date.now(),
      storageId: args.storageId,
      organizationId: organization._id,
      clientVisible: true,
      clientStarred: false
    });
  }
});

export const clientRemove = mutation({
  args: {
    id: v.id('multimedia')
  },
  handler: async (ctx, args) => {
    // Obtain Identity
    const identity = await verifyClientAuth(ctx);

    // Obtain Organization
    const clerkId = identity.org_id as string;
    if (!clerkId) throw new ConvexError('Organization not found');

    const organization = await ctx.db
      .query('organizations')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!organization) throw new ConvexError('Organization not found');

    // Obtain File
    const file = await ctx.db.get(args.id);
    if (!file) throw new ConvexError('Media file not found');

    // Check Ownership
    if (file.organizationId !== organization._id) {
      throw new ConvexError('Unauthorized');
    }

    // Remove File
    await ctx.storage.delete(file.storageId);
    await ctx.db.delete(args.id);
  }
});

export const clientUpdate = mutation({
  args: {
    id: v.id('multimedia'),
    name: v.optional(v.string()),
    note: v.optional(v.string()),
    clientStarred: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Obtain Identity
    const identity = await verifyClientAuth(ctx);

    // Obtain Organization
    const clerkId = identity.org_id as string;
    if (!clerkId) throw new ConvexError('Organization not found');

    const organization = await ctx.db
      .query('organizations')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!organization) throw new ConvexError('Organization not found');

    // Obtain File
    const file = await ctx.db.get(args.id);
    if (!file) throw new ConvexError('Media file not found');

    // Check Ownership
    if (file.organizationId !== organization._id) {
      throw new ConvexError('Unauthorized');
    }

    // Update File
    await ctx.db.patch(args.id, {
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.note !== undefined ? { note: args.note } : {}),
      ...(args.clientStarred !== undefined ? { clientStarred: args.clientStarred } : {}),
      updated: Date.now()
    });
  }
});

// Shared Functions

export const sharedUpload = mutation({
  handler: async (ctx) => {
    // Check Identity
    await verifyIdentity(ctx);

    // Return Storage Url
    return await ctx.storage.generateUploadUrl();
  }
});
