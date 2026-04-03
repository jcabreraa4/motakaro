import { internalMutation, mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { verifyAdminAuth } from './auth';

export const list = query({
  handler: async (ctx) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Return all Meetings
    return ctx.db.query('meetings').order('desc').collect();
  }
});

export const get = query({
  args: {
    id: v.id('meetings')
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    try {
      // Return the Meeting
      return await ctx.db.get(args.id);
    } catch {
      return null;
    }
  }
});

export const update = mutation({
  args: {
    id: v.id('meetings'),
    starred: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Obtain the Meeting
    const meeting = await ctx.db.get(args.id);
    if (!meeting) throw new ConvexError('Not found');

    // Update the Meeting
    await ctx.db.patch(args.id, {
      ...(args.starred !== undefined ? { starred: args.starred } : {})
    });
  }
});

// Internal Mutations

export const upsert = internalMutation({
  args: {
    name: v.optional(v.string()),
    note: v.optional(v.string()),
    url: v.optional(v.string()),
    start: v.optional(v.number()),
    end: v.optional(v.number()),
    organizer: v.optional(v.string()),
    attendees: v.optional(v.array(v.string())),
    website: v.optional(v.string()),
    attribution: v.optional(v.string()),
    rescheduled: v.optional(v.string()),
    cancellation: v.optional(v.string()),
    rejection: v.optional(v.string()),
    status: v.union(v.literal('scheduled'), v.literal('cancelled'), v.literal('rejected'), v.literal('ongoing'), v.literal('finished')),
    newCalcomId: v.optional(v.string()),
    calcomId: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain the Meeting
    const meeting = await ctx.db
      .query('meetings')
      .withIndex('by_calcomId', (q) => q.eq('calcomId', args.calcomId))
      .first();

    // Check for Meeting
    if (meeting) {
      // Update the Meeting
      await ctx.db.patch(meeting._id, args);
    } else {
      // Create the Meeting
      return await ctx.db.insert('meetings', {
        name: args.name ?? 'Untitled Booking',
        note: args.note ?? '',
        url: args.url ?? '',
        start: args.start ?? 0,
        end: args.end ?? 0,
        starred: false,
        organizer: args.organizer ?? '',
        attendees: args.attendees ?? [args.organizer ?? ''],
        website: args.website,
        attribution: args.attribution,
        status: args.status,
        calcomId: args.calcomId
      });
    }
  }
});
