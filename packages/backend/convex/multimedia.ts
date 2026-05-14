import { verifyAdminAuth, verifyClientAuth, verifyIdentity } from './auth';
import { mutation, query } from './_generated/server';
import type { Id } from './_generated/dataModel';
import { ConvexError, v } from 'convex/values';

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
      // Return the Multimedia
      const multimedia = await ctx.db
        .query('multimedia')
        .withIndex('by_companyId_updated', (q) => q.eq('companyId', args.companyId))
        .order('desc')
        .collect();
      return await Promise.all(multimedia.map(async (file) => ({ ...file, url: await ctx.storage.getUrl(file.storageId) })));
    }

    // Return the Multimedia
    const multimedia = await ctx.db
      .query('multimedia')
      .withIndex('by_companyId_updated', (q) => q.eq('companyId', undefined))
      .order('desc')
      .collect();
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
      // Obtain the Media File
      const mediaFile = await ctx.db.get(args.id as Id<'multimedia'>);
      if (!mediaFile) return null;

      // Obtain the Storage Url
      const url = await ctx.storage.getUrl(mediaFile.storageId);
      if (!url) return null;

      // Return the Media File
      return { ...mediaFile, url };
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
    companyId: v.optional(v.id('companies'))
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Create the Media File
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
      companyId: args.companyId,
      clientsVisible: false,
      clientsStarred: false
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

    // Obtain the Media File
    const mediaFile = await ctx.db.get(args.id);
    if (!mediaFile) throw new ConvexError('Media file not found');

    // Remove the Media File
    await ctx.storage.delete(mediaFile.storageId);
    await ctx.db.delete(args.id);
  }
});

export const update = mutation({
  args: {
    id: v.id('multimedia'),
    name: v.optional(v.string()),
    note: v.optional(v.string()),
    starred: v.optional(v.boolean()),
    clientsVisible: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Obtain the Media File
    const mediaFile = await ctx.db.get(args.id);
    if (!mediaFile) throw new ConvexError('Media file not found');

    // Update the Media File
    await ctx.db.patch(args.id, {
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.note !== undefined ? { note: args.note } : {}),
      ...(args.starred !== undefined ? { starred: args.starred } : {}),
      ...(args.clientsVisible !== undefined ? { clientsVisible: args.clientsVisible } : {}),
      updated: Date.now()
    });
  }
});

// Clients Functions

export const clientsList = query({
  handler: async (ctx) => {
    // Check Identity
    const identity = await verifyClientAuth(ctx);

    // Obtain Company
    const clerkId = identity.org_id as string;
    if (!clerkId) throw new ConvexError('Organization not found');

    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!company) throw new ConvexError('Company not found');

    // Return the Multimedia
    const multimedia = await ctx.db
      .query('multimedia')
      .withIndex('by_companyId_clientsVisible_updated', (q) => q.eq('companyId', company._id).eq('clientsVisible', true))
      .order('desc')
      .collect();
    return await Promise.all(multimedia.map(async (file) => ({ ...file, url: await ctx.storage.getUrl(file.storageId) })));
  }
});

export const clientsGet = query({
  args: {
    id: v.string()
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyClientAuth(ctx);

    // Obtain Company
    const clerkId = identity.org_id as string;
    if (!clerkId) throw new ConvexError('Organization not found');

    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!company) throw new ConvexError('Company not found');

    try {
      // Obtain the Media File
      const mediaFile = await ctx.db.get(args.id as Id<'multimedia'>);
      if (!mediaFile) return null;

      // Check Ownership
      if (mediaFile.companyId !== company._id) return null;

      // Obtain the Storage Url
      const url = await ctx.storage.getUrl(mediaFile.storageId);
      if (!url) return null;

      // Return the Media File
      return { ...mediaFile, url };
    } catch {
      return null;
    }
  }
});

export const clientsCreate = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    size: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    storageId: v.id('_storage')
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyClientAuth(ctx);

    // Obtain Company
    const clerkId = identity.org_id as string;
    if (!clerkId) throw new ConvexError('Organization not found');

    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!company) throw new ConvexError('Company not found');

    // Create the Media File
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
      companyId: company._id,
      clientsVisible: true,
      clientsStarred: false
    });
  }
});

export const clientsRemove = mutation({
  args: {
    id: v.id('multimedia')
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyClientAuth(ctx);

    // Obtain Company
    const clerkId = identity.org_id as string;
    if (!clerkId) throw new ConvexError('Organization not found');

    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!company) throw new ConvexError('Company not found');

    // Obtain the Media File
    const mediaFile = await ctx.db.get(args.id);
    if (!mediaFile) throw new ConvexError('Media file not found');

    // Check Ownership
    if (mediaFile.companyId !== company._id) {
      throw new ConvexError('Unauthorized');
    }

    // Remove the Media File
    await ctx.storage.delete(mediaFile.storageId);
    await ctx.db.delete(args.id);
  }
});

export const clientsUpdate = mutation({
  args: {
    id: v.id('multimedia'),
    name: v.optional(v.string()),
    note: v.optional(v.string()),
    clientsStarred: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyClientAuth(ctx);

    // Obtain Company
    const clerkId = identity.org_id as string;
    if (!clerkId) throw new ConvexError('Organization not found');

    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!company) throw new ConvexError('Company not found');

    // Obtain the Media File
    const mediaFile = await ctx.db.get(args.id);
    if (!mediaFile) throw new ConvexError('Media file not found');

    // Check Ownership
    if (mediaFile.companyId !== company._id) {
      throw new ConvexError('Unauthorized');
    }

    // Update the Media File
    await ctx.db.patch(args.id, {
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.note !== undefined ? { note: args.note } : {}),
      ...(args.clientsStarred !== undefined ? { clientsStarred: args.clientsStarred } : {}),
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
