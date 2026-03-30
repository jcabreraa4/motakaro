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
          .withIndex('by_calcom_id', (q) => q.eq('calcomId', args.calcomId!))
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
    name: v.string(),
    note: v.string(),
    url: v.string(),
    start: v.number(),
    end: v.number(),
    status: v.union(v.literal('scheduled'), v.literal('cancelled'), v.literal('rejected'), v.literal('started'), v.literal('finished')),
    organizer: v.string(),
    attendees: v.array(v.string()),
    cancellation: v.string(),
    rejection: v.string(),
    calcomId: v.string()
  },
  handler: async (ctx, args) => {
    const meeting = await ctx.db
      .query('meetings')
      .withIndex('by_calcom_id', (q) => q.eq('calcomId', args.calcomId))
      .first();
    if (meeting) {
      await ctx.db.patch(meeting._id, args);
    } else {
      await ctx.db.insert('meetings', args);
    }
  }
});

export const updateStatus = internalMutation({
  args: {
    calcomId: v.string(),
    status: v.union(v.literal('scheduled'), v.literal('cancelled'), v.literal('rejected'), v.literal('started'), v.literal('finished'))
  },
  handler: async (ctx, { calcomId, status }) => {
    const meeting = await ctx.db
      .query('meetings')
      .withIndex('by_calcom_id', (q) => q.eq('calcomId', calcomId))
      .first();
    if (meeting) await ctx.db.patch(meeting._id, { status });
  }
});
