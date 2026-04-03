import { action, mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { verifyAdminAuth } from './auth';

export const list = query({
  handler: async (ctx) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Return all Embeddings
    return await ctx.db.query('embeddings').order('desc').collect();
  }
});

export const get = query({
  args: {
    ids: v.array(v.id('embeddings'))
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Return the Embeddings
    return await Promise.all(args.ids.map((id) => ctx.db.get(id)));
  }
});

export const create = mutation({
  args: {
    source: v.string(),
    content: v.string(),
    vector: v.array(v.float64())
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Create one Embedding
    return await ctx.db.insert('embeddings', {
      source: args.source ?? 'Untitled File',
      content: args.content,
      vector: args.vector
    });
  }
});

export const remove = mutation({
  args: {
    id: v.id('embeddings')
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Obtain the Embedding
    const embedding = await ctx.db.get(args.id);
    if (!embedding) throw new ConvexError('Not found');

    // Remove the Embedding
    await ctx.db.delete(args.id);
  }
});

export const empty = mutation({
  handler: async (ctx) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Obtain all Embeddings
    const embeddings = await ctx.db.query('embeddings').order('desc').collect();

    // Remove all Embeddings
    await Promise.all(embeddings.map((embedding) => ctx.db.delete(embedding._id)));
  }
});

export const search = action({
  args: {
    vector: v.array(v.float64()),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Return the Embeddings
    return await ctx.vectorSearch('embeddings', 'by_vector', {
      vector: args.vector,
      limit: args.limit ?? 8
    });
  }
});
