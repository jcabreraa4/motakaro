import { ConvexError, v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import { internalMutation, mutation, query } from './_generated/server';
import { verifyAdminAuth } from './auth';

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

// Internal Mutations

export const internalUpsert = internalMutation({
  args: {
    calcomId: v.string(),
    name: v.string(),
    link: v.string(),
    start: v.number(),
    end: v.number(),
    organizer: v.string(),
    attendees: v.array(v.string()),
    status: v.union(v.literal('scheduled'), v.literal('cancelled'), v.literal('rejected'), v.literal('ongoing'), v.literal('finished')),
    note: v.optional(v.string()),
    website: v.optional(v.string()),
    attribution: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Obtain Meeting
    const meeting = await ctx.db
      .query('meetings')
      .withIndex('by_calcomId', (q) => q.eq('calcomId', args.calcomId))
      .first();

    if (meeting) {
      // Update Meeting
      await ctx.db.patch(meeting._id, { ...args, updated: Date.now() });
    } else {
      // Create Meeting
      return await ctx.db.insert('meetings', {
        calcomId: args.calcomId,
        name: args.name,
        link: args.link,
        start: args.start,
        end: args.end,
        organizer: args.organizer,
        attendees: args.attendees,
        status: args.status,
        starred: false,
        updated: Date.now(),
        note: args.note,
        website: args.website,
        attribution: args.attribution
      });
    }
  }
});

export const internalUpdate = internalMutation({
  args: {
    calcomId: v.string(),
    status: v.union(v.literal('scheduled'), v.literal('cancelled'), v.literal('rejected'), v.literal('ongoing'), v.literal('finished')),
    rescheduling: v.optional(v.string()),
    cancellation: v.optional(v.string()),
    rejection: v.optional(v.string()),
    newStart: v.optional(v.number()),
    newEnd: v.optional(v.number()),
    newCalcomId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Obtain Meeting
    const meeting = await ctx.db
      .query('meetings')
      .withIndex('by_calcomId', (q) => q.eq('calcomId', args.calcomId))
      .first();
    if (!meeting) throw new ConvexError('Meeting not found');

    // Update Meeting
    await ctx.db.patch(meeting._id, {
      status: args.status,
      ...(args.rescheduling !== undefined ? { rescheduling: args.rescheduling } : {}),
      ...(args.cancellation !== undefined ? { cancellation: args.cancellation } : {}),
      ...(args.rejection !== undefined ? { rejection: args.rejection } : {}),
      ...(args.newStart !== undefined ? { start: args.newStart } : {}),
      ...(args.newEnd !== undefined ? { end: args.newEnd } : {}),
      ...(args.newCalcomId !== undefined ? { calcomId: args.newCalcomId } : {}),
      updated: Date.now()
    });
  }
});
