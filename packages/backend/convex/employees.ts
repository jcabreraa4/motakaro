import { internalMutation, mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { verifyAdminAuth } from './auth';

export const list = query({
  args: {
    filter: v.optional(v.union(v.literal('actives')))
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Check for Filter
    if (args.filter === 'actives') {
      // Return active Employees
      const threshold = Date.now() - 30000;
      return await ctx.db
        .query('employees')
        .filter((q) => q.gte(q.field('seen'), threshold))
        .order('desc')
        .collect();
    }

    // Return all Employees
    return await ctx.db.query('employees').order('desc').collect();
  }
});

export const get = query({
  args: {
    id: v.optional(v.id('employees')),
    clerkId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    try {
      if (args.id) {
        // Return the Employee
        return await ctx.db.get(args.id);
      } else if (args.clerkId) {
        return await ctx.db
          .query('employees')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId!))
          .first();
      }
    } catch {
      return null;
    }
  }
});

export const update = mutation({
  args: {
    id: v.optional(v.id('employees')),
    clerkId: v.optional(v.string()),
    seen: v.optional(v.boolean()),
    context: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Obtain the Employee
    let employee = null;
    if (args.id) {
      employee = await ctx.db.get(args.id);
    } else if (args.clerkId) {
      employee = await ctx.db
        .query('employees')
        .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId!))
        .first();
    }
    if (!employee) throw new ConvexError('Not found');

    // Update the Employee
    await ctx.db.patch(employee._id, {
      ...(args.seen !== undefined ? { seen: Date.now() } : {}),
      ...(args.context !== undefined ? { context: args.context } : {})
    });
  }
});

// Internal Mutations

export const upsert = internalMutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    surname: v.optional(v.string()),
    avatar: v.optional(v.string()),
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain the Employee
    const employee = await ctx.db
      .query('employees')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();

    // Check for Employee
    if (employee) {
      // Update the Employee
      await ctx.db.patch(employee._id, args);
    } else {
      // Create the Employee
      await ctx.db.insert('employees', args);
    }
  }
});

export const remove = internalMutation({
  args: {
    clerkId: v.string()
  },
  handler: async (ctx, { clerkId }) => {
    // Obtain the Employee
    const employee = await ctx.db
      .query('employees')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();

    // Remove the Employee
    if (employee) await ctx.db.delete(employee._id);
  }
});
