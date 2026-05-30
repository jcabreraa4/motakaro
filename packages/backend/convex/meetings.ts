import { ConvexError, v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import { internalMutation, mutation, query } from './_generated/server';
import { verifyAdminAuth } from './auth';

// Admins Functions

export const list = query({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Return Meetings
    const query = ctx.db.query('meetings').order('desc');
    return args.limit ? await query.take(args.limit) : await query.collect();
  }
});

export const get = query({
  args: {
    id: v.optional(v.string()),
    calcomId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    try {
      // Return Meeting
      if (args.id) {
        return await ctx.db.get(args.id as Id<'meetings'>);
      } else if (args.calcomId) {
        return await ctx.db
          .query('meetings')
          .withIndex('by_calcomId', (q) => q.eq('calcomId', args.calcomId!))
          .first();
      }
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

    // Obtain Meeting
    const meeting = await ctx.db.get(args.id);
    if (!meeting) throw new ConvexError('Meeting not found');

    // Update Meeting
    await ctx.db.patch(args.id, {
      ...(args.starred !== undefined ? { starred: args.starred } : {})
    });
  }
});

// Internal Functions

export const upsert = internalMutation({
  args: {
    name: v.optional(v.string()),
    note: v.optional(v.string()),
    link: v.optional(v.string()),
    start: v.optional(v.number()),
    end: v.optional(v.number()),
    organizer: v.optional(v.string()),
    attendees: v.optional(v.array(v.string())),
    website: v.optional(v.string()),
    attribution: v.optional(v.string()),
    rescheduling: v.optional(v.string()),
    cancellation: v.optional(v.string()),
    rejection: v.optional(v.string()),
    status: v.union(v.literal('scheduled'), v.literal('cancelled'), v.literal('rejected'), v.literal('ongoing'), v.literal('finished')),
    newCalcomId: v.optional(v.string()),
    calcomId: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain Meeting
    const meeting = await ctx.db
      .query('meetings')
      .withIndex('by_calcomId', (q) => q.eq('calcomId', args.calcomId))
      .first();

    if (meeting) {
      // Update Meeting
      await ctx.db.patch(meeting._id, args);
    } else {
      // Create Meeting
      return await ctx.db.insert('meetings', {
        name: args.name ?? 'Untitled Booking',
        note: args.note ?? '',
        link: args.link ?? '',
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
