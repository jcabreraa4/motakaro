import { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';

const adminsIssuer = process.env.CLERK_JWT_ADMINS_DOMAIN;

export const list = query({
  handler: async (ctx) => {
    // Check Identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.issuer !== adminsIssuer) {
      throw new ConvexError('Unauthorized');
    }

    // Return all Multimedia
    const multimedia = await ctx.db
      .query('multimedia')
      .withIndex('by_updated', (q) => q)
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
    try {
      // Check Identity
      const identity = await ctx.auth.getUserIdentity();
      if (!identity || identity.issuer !== adminsIssuer) {
        throw new ConvexError('Unauthorized');
      }

      // Obtain the Media File
      const mediaFile = await ctx.db.get('multimedia', args.id as Id<'multimedia'>);
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

export const storage = mutation({
  handler: async (ctx) => {
    // Check Identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.issuer !== adminsIssuer) {
      throw new ConvexError('Unauthorized');
    }

    // Return Storage Url
    return await ctx.storage.generateUploadUrl();
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.issuer !== adminsIssuer) {
      throw new ConvexError('Unauthorized');
    }

    // Create one Media File
    return await ctx.db.insert('multimedia', {
      name: args.name,
      note: '',
      type: args.type,
      size: args.size,
      width: args.width,
      height: args.height,
      starred: false,
      updated: Date.now(),
      storageId: args.storageId,
      companyId: args.companyId
    });
  }
});

export const remove = mutation({
  args: {
    id: v.id('multimedia')
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.issuer !== adminsIssuer) {
      throw new ConvexError('Unauthorized');
    }

    // Obtain the Media File
    const mediaFile = await ctx.db.get(args.id);
    if (!mediaFile) throw new ConvexError('Not found');

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
    starred: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.issuer !== adminsIssuer) {
      throw new ConvexError('Unauthorized');
    }

    // Obtain the Media File
    const mediaFile = await ctx.db.get(args.id);
    if (!mediaFile) throw new ConvexError('Not found');

    // Update the Media File
    await ctx.db.patch(args.id, {
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.note !== undefined ? { note: args.note } : {}),
      ...(args.starred !== undefined ? { starred: args.starred } : {}),
      updated: Date.now()
    });
  }
});
