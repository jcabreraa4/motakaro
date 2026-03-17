import { Id } from './_generated/dataModel';
import { internalMutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';

const adminsIssuer = process.env.CLERK_JWT_ADMINS_DOMAIN;

export const list = query({
  handler: async (ctx) => {
    // Check Identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.issuer !== adminsIssuer) {
      throw new ConvexError('Unauthorized');
    }

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
    try {
      // Check Identity
      const identity = await ctx.auth.getUserIdentity();
      if (!identity || identity.issuer !== adminsIssuer) {
        throw new ConvexError('Unauthorized');
      }

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
    status: v.union(v.literal('scheduled'), v.literal('cancelled'), v.literal('rejected'), v.literal('started'), v.literal('finished')),
    startTime: v.number(),
    endTime: v.number(),
    attendees: v.array(v.string()),
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
