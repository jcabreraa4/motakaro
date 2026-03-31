import { internalMutation, query } from './_generated/server';
import { Id } from './_generated/dataModel';
import { verifyAdminAuth } from './auth';
import { v } from 'convex/values';

export const list = query({
  handler: async (ctx) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    // Return all Meetings
    return ctx.db.query('meetings').collect();
  }
});

export const get = query({
  args: {
    id: v.optional(v.string()),
    calcomId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

    try {
      // Return one Meeting
      if (args.id) return await ctx.db.get('meetings', args.id as Id<'meetings'>);
      if (args.calcomId) {
        return await ctx.db
          .query('meetings')
          .withIndex('by_calcomId', (q) => q.eq('calcomId', args.calcomId!))
          .first();
      }
      return null;
    } catch {
      return null;
    }
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
    const meeting = await ctx.db
      .query('meetings')
      .withIndex('by_calcomId', (q) => q.eq('calcomId', args.calcomId))
      .first();
    if (meeting) {
      await ctx.db.patch(meeting._id, {
        ...(args.start !== undefined ? { start: args.start } : {}),
        ...(args.end !== undefined ? { end: args.end } : {}),
        ...(args.rescheduled !== undefined ? { rescheduled: args.rescheduled } : {}),
        ...(args.cancellation !== undefined ? { cancellation: args.cancellation } : {}),
        ...(args.rejection !== undefined ? { rejection: args.rejection } : {}),
        ...(args.newCalcomId !== undefined ? { calcomId: args.newCalcomId } : {}),
        status: args.status
      });
    } else {
      return await ctx.db.insert('meetings', {
        name: args.name ?? 'Untitled Booking',
        note: args.note ?? '',
        url: args.url ?? '',
        start: args.start ?? 0,
        end: args.end ?? 0,
        organizer: args.organizer ?? '',
        attendees: args.attendees ?? [args.organizer ?? ''],
        website: args.website,
        attribution: args.attribution,
        rescheduled: args.rescheduled,
        cancellation: args.cancellation,
        rejection: args.rejection,
        status: args.status,
        calcomId: args.calcomId
      });
    }
  }
});
