import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { verifyAdminAuth } from './auth';

export const list = query({
  args: {
    filter: v.optional(v.union(v.literal('published')))
  },
  handler: async (ctx, args) => {
    // Check for Filter
    if (args.filter === 'published') {
      // Return Published Resources
      return await ctx.db
        .query('resources')
        .withIndex('by_updated', (q) => q)
        .filter((q) => q.gte(q.field('published'), true))
        .order('desc')
        .collect();
    }

    // Return all Resources
    return await ctx.db
      .query('resources')
      .withIndex('by_updated', (q) => q)
      .order('desc')
      .collect();
  }
});

export const get = query({
  args: {
    id: v.id('resources')
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    try {
      // Return the Resource
      return await ctx.db.get(args.id);
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

    // Create one Resource
    return await ctx.db.insert('resources', {
      name: args.name,
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
    thumbnail: v.optional(v.string()),
    published: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

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
      ...(args.published !== undefined ? { published: args.published } : {}),
      updated: Date.now()
    });
  }
});
