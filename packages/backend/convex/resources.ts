import { mutation, query } from './_generated/server';
import type { Id } from './_generated/dataModel';
import { ConvexError, v } from 'convex/values';
import { verifyAdminAuth } from './auth';

// Admins Functions

export const list = query({
  args: {
    limit: v.optional(v.number()),
    filter: v.optional(v.literal('published'))
  },
  handler: async (ctx, args) => {
    // Check Filter
    if (args.filter) {
      // Return Resources
      const query = ctx.db
        .query('resources')
        .withIndex('by_published_updated', (q) => q.eq('published', true))
        .order('desc');
      return args.limit ? await query.take(args.limit) : await query.collect();
    }

    // Check Identity
    await verifyAdminAuth(ctx);

    // Return Resources
    const query = ctx.db
      .query('resources')
      .withIndex('by_updated', (q) => q)
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
      // Return Resource
      return await ctx.db.get(args.id as Id<'resources'>);
    } catch {
      return null;
    }
  }
});

export const create = mutation({
  args: {
    name: v.string(),
    note: v.string(),
    link: v.string(),
    embed: v.string(),
    thumbnail: v.string(),
    published: v.boolean()
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Create Resource
    return await ctx.db.insert('resources', {
      name: args.name ?? 'Untitled Resource',
      note: args.note,
      link: args.link,
      embed: args.embed,
      starred: false,
      updated: Date.now(),
      thumbnail: args.thumbnail,
      published: args.published
    });
  }
});

export const remove = mutation({
  args: {
    id: v.id('resources')
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Obtain Resource
    const resource = await ctx.db.get(args.id);
    if (!resource) throw new ConvexError('Resource not found');

    // Remove Resource
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
    thumbnail: v.optional(v.string()),
    published: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Obtain Resource
    const resource = await ctx.db.get(args.id);
    if (!resource) throw new ConvexError('Resource not found');

    // Update Resource
    await ctx.db.patch(args.id, {
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.note !== undefined ? { note: args.note } : {}),
      ...(args.link !== undefined ? { link: args.link } : {}),
      ...(args.embed !== undefined ? { embed: args.embed } : {}),
      ...(args.starred !== undefined ? { starred: args.starred } : {}),
      ...(args.thumbnail !== undefined ? { thumbnail: args.thumbnail } : {}),
      ...(args.published !== undefined ? { published: args.published } : {}),
      updated: Date.now()
    });
  }
});
