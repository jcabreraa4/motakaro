import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { Id } from './_generated/dataModel';
import { verifyAdminAuth } from './auth';

export const list = query({
  handler: async (ctx) => {
    // Return all Resources
    return await ctx.db.query('resources').collect();
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
      // Return the Resource
      return await ctx.db.get('resources', args.id as Id<'resources'>);
    } catch {
      return null;
    }
  }
});

export const create = mutation({
  args: {
    name: v.string(),
    note: v.optional(v.string()),
    link: v.optional(v.string()),
    embed: v.optional(v.string()),
    starred: v.optional(v.boolean()),
    thumbnail: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    // Create one Resource
    return await ctx.db.insert('resources', {
      name: args.name,
      note: args.note ?? '',
      link: args.link ?? '',
      embed: args.embed ?? '',
      starred: args.starred ?? false,
      updated: Date.now(),
      thumbnail: args.thumbnail ?? ''
    });
  }
});

export const remove = mutation({
  args: {
    id: v.id('resources')
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    // Obtain the Resource
    const resource = await ctx.db.get(args.id);
    if (!resource) throw new ConvexError('Not found');

    // Remove the Resource
    await ctx.db.delete(args.id);
  }
});

export const update = mutation({
  args: {
    id: v.id('resources'),
    name: v.optional(v.string()),
    note: v.optional(v.string()),
    link: v.optional(v.string()),
    embed: v.optional(v.string()),
    starred: v.optional(v.boolean()),
    thumbnail: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    // Obtain the Resource
    const resource = await ctx.db.get(args.id);
    if (!resource) throw new ConvexError('Not found');

    // Update the Resource
    await ctx.db.patch(args.id, {
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.note !== undefined ? { note: args.note } : {}),
      ...(args.link !== undefined ? { link: args.link } : {}),
      ...(args.embed !== undefined ? { embed: args.embed } : {}),
      ...(args.starred !== undefined ? { starred: args.starred } : {}),
      ...(args.thumbnail !== undefined ? { thumbnail: args.thumbnail } : {}),
      updated: Date.now()
    });
  }
});
