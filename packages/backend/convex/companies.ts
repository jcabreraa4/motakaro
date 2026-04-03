import { internalMutation, query } from './_generated/server';
import { verifyAdminAuth } from './auth';
import { v } from 'convex/values';

export const list = query({
  handler: async (ctx) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Return all Companies
    return await ctx.db.query('companies').order('desc').collect();
  }
});

export const get = query({
  args: {
    id: v.id('companies')
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    try {
      // Return the Company
      return await ctx.db.get(args.id);
    } catch {
      return null;
    }
  }
});

// Internal Mutations

export const upsert = internalMutation({
  args: {
    name: v.string(),
    logo: v.optional(v.string()),
    plan: v.optional(v.string()),
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain the Company
    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();

    // Check for Company
    if (company) {
      // Update the Company
      await ctx.db.patch(company._id, args);
    } else {
      // Create the Company
      await ctx.db.insert('companies', args);
    }
  }
});

export const remove = internalMutation({
  args: {
    clerkId: v.string()
  },
  handler: async (ctx, { clerkId }) => {
    // Obtain the Company
    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();

    // Remove the Company
    if (company) await ctx.db.delete(company._id);
  }
});
