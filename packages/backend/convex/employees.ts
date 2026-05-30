import { ConvexError, v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import { internalMutation, mutation, query } from './_generated/server';
import { verifyAdminAuth } from './auth';

// Admins Functions

export const list = query({
  args: {
    limit: v.optional(v.number()),
    filter: v.optional(v.literal('actives'))
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Check Filter
    if (args.filter) {
      // Return Employees
      const threshold = Date.now() - 30000;
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
  args: {
    id: v.optional(v.string()),
    clerkId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    try {
      // Return Employee
      if (args.id) {
        return await ctx.db.get(args.id as Id<'employees'>);
      } else if (args.clerkId) {
        return await ctx.db
          .query('employees')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId!))
          .first();
      } else {
        return await ctx.db
          .query('employees')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
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

    // Obtain Employee
    let employee = null;
    if (args.id) {
      employee = await ctx.db.get(args.id);
    } else if (args.clerkId) {
      employee = await ctx.db
        .query('employees')
        .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId!))
        .first();
    }
    if (!employee) throw new ConvexError('Employee not found');

    // Update Employee
    await ctx.db.patch(employee._id, {
      ...(args.seen !== undefined ? { seen: Date.now() } : {}),
      ...(args.context !== undefined ? { context: args.context } : {}),
      updated: Date.now()
    });
  }
});

// Internal Functions

export const internalUpsert = internalMutation({
  args: {
    email: v.string(),
    name: v.string(),
    surname: v.string(),
    avatar: v.string(),
    clerkId: v.string()
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
        email: args.email,
        name: args.name,
        surname: args.surname,
        avatar: args.avatar,
        clerkId: args.clerkId,
        starred: false,
        onboarded: false,
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
