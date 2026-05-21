import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getClientAuth, verifyAdminAuth, verifyClientAuth } from './auth';

// Admins Functions

export const list = query({
  args: {
    limit: v.optional(v.number()),
    companyId: v.optional(v.id('companies'))
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Return Notifications
    const query = ctx.db
      .query('notifications')
      .withIndex('by_companyId', (q) => q.eq('companyId', args.companyId))
      .order('desc');
    return args.limit ? await query.take(args.limit) : await query.collect();
  }
});

export const update = mutation({
  args: {
    id: v.id('notifications'),
    read: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Obtain Notification
    const notification = await ctx.db.get(args.id);
    if (!notification) throw new ConvexError('Notification not found');

    // Update Notification
    await ctx.db.patch(args.id, {
      ...(args.read !== undefined ? { read: args.read } : {}),
      updated: Date.now()
    });
  }
});

// Clients Functions

export const clientsList = query({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await getClientAuth(ctx);
    if (!identity) return null;

    // Obtain Company
    const clerkId = identity.org_id as string;
    if (!clerkId) throw new ConvexError('Organization not found');

    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!company) throw new ConvexError('Company not found');

    // Return Notifications
    const query = ctx.db
      .query('notifications')
      .withIndex('by_companyId', (q) => q.eq('companyId', company._id))
      .order('desc');
    return args.limit ? await query.take(args.limit) : await query.collect();
  }
});

export const clientsUpdate = mutation({
  args: {
    id: v.id('notifications'),
    read: v.optional(v.boolean())
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

    // Obtain Notification
    const notification = await ctx.db.get(args.id);
    if (!notification) throw new ConvexError('Notification not found');

    // Check Ownership
    if (notification.companyId !== company._id) {
      throw new ConvexError('Unauthorized');
    }

    // Update Notification
    await ctx.db.patch(args.id, {
      ...(args.read !== undefined ? { read: args.read } : {}),
      updated: Date.now()
    });
  }
});
