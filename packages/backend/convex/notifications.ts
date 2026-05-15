import { verifyAdminAuth, getClientAuth } from './auth';
import { ConvexError, v } from 'convex/values';
import { query } from './_generated/server';

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
      .withIndex('by_companyId_updated', (q) => q.eq('companyId', args.companyId))
      .order('desc');
    return args.limit ? await query.take(args.limit) : await query.collect();
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
      .withIndex('by_companyId_updated', (q) => q.eq('companyId', company._id))
      .order('desc');
    return args.limit ? await query.take(args.limit) : await query.collect();
  }
});
