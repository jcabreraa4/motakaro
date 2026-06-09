import { ConvexError, v } from 'convex/values';

import { internalMutation, mutation, query } from './_generated/server';
import { verifyAdminAuth } from './auth';

export const list = query({
  args: {
    limit: v.optional(v.number()),
    filter: v.optional(v.literal('actives'))
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Return Actives
    if (args.filter) {
      const threshold = Date.now() - 60000;
      const query = ctx.db
        .query('employees')
        .filter((q) => q.gte(q.field('seen'), threshold))
        .order('desc');
      return args.limit ? await query.take(args.limit) : await query.collect();
    }

    // Return Employees
    const query = ctx.db.query('employees').order('desc');
    return args.limit ? await query.take(args.limit) : await query.collect();
  }
});

export const get = query({
  handler: async (ctx) => {
    // Obtain Identity
    const identity = await verifyAdminAuth(ctx);

    try {
      // Return Employee
      return await ctx.db
        .query('employees')
        .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
        .first();
    } catch {
      return null;
    }
  }
});

export const update = mutation({
  args: {
    onboarded: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Obtain Identity
    const identity = await verifyAdminAuth(ctx);

    // Obtain Employee
    const employee = await ctx.db
      .query('employees')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();
    if (!employee) throw new ConvexError('Employee not found');

    // Update Employee
    await ctx.db.patch(employee._id, {
      ...(args.onboarded !== undefined ? { onboarded: args.onboarded } : {}),
      updated: Date.now(),
      seen: Date.now()
    });
  }
});

// Internal Mutations

export const internalUpsert = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    surname: v.string(),
    avatar: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain Employee
    const employee = await ctx.db
      .query('employees')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (employee) {
      // Update Employee
      await ctx.db.patch(employee._id, { ...args, updated: Date.now() });
    } else {
      // Create Employee
      await ctx.db.insert('employees', {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        surname: args.surname,
        avatar: args.avatar,
        onboarded: false,
        starred: false,
        updated: Date.now()
      });
    }
  }
});

export const internalRemove = internalMutation({
  args: {
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain Employee
    const employee = await ctx.db
      .query('employees')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();
    if (!employee) throw new ConvexError('Employee not found');

    // Remove Employee
    await ctx.db.delete(employee._id);
  }
});
