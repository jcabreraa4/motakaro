import { verifyAdminAuth, verifyClientAuth } from './auth';
import { ConvexError, v } from 'convex/values';
import { query } from './_generated/server';

// Admins Functions

export const list = query({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const identity = await verifyAdminAuth(ctx);

    // Obtain the Employee
    const emplyee = await ctx.db
      .query('employees')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();
    if (!emplyee) throw new ConvexError('Employee not found');

    // Obtain the Notifications
    const notifications = ctx.db
      .query('notifications')
      .withIndex('by_employeeId_updated', (q) => q.eq('employeeId', emplyee._id))
      .order('desc');

    // Return the Notifications
    if (args.limit) return await notifications.take(args.limit);
    return await notifications.collect();
  }
});

// Clients Functions

export const clientsList = query({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const identity = await verifyClientAuth(ctx);

    // Obtain the Contact
    const contact = await ctx.db
      .query('contacts')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();
    if (!contact) throw new ConvexError('Contact not found');

    // Obtain the Notifications
    const notifications = ctx.db
      .query('notifications')
      .withIndex('by_contactId_updated', (q) => q.eq('contactId', contact._id))
      .order('desc');

    // Return the Notifications
    if (args.limit) return await notifications.take(args.limit);
    return await notifications.collect();
  }
});
