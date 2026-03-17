import { Id } from './_generated/dataModel';
import { internalMutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';

const adminsIssuer = process.env.CLERK_JWT_ADMINS_DOMAIN;
const clientsIssuer = process.env.CLERK_JWT_CLIENTS_DOMAIN;

export const list = query({
  handler: async (ctx) => {
    // Check Identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.issuer !== adminsIssuer) {
      throw new ConvexError('Unauthorized');
    }

    // Return all Companies
    return await ctx.db.query('companies').collect();
  }
});

export const get = query({
  args: {
    id: v.optional(v.string()),
    clerkId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    try {
      // Check Identity
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new ConvexError('Unauthorized');

      // Identity is Admin
      if (identity.issuer !== adminsIssuer) {
        // Return one Company
        if (args.id) return await ctx.db.get('companies', args.id as Id<'companies'>);
        if (args.clerkId) {
          return await ctx.db
            .query('companies')
            .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId!))
            .first();
        }
      }

      // Identity is Client
      if (identity.issuer === clientsIssuer) {
        // Return one Company
        const clerkId = identity.org_id as string;
        return await ctx.db
          .query('contacts')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
          .first();
      }
      return null;
    } catch {
      return null;
    }
  }
});

export const upsert = internalMutation({
  args: {
    name: v.string(),
    logo: v.optional(v.string()),
    plan: v.optional(v.string()),
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();
    if (company) {
      await ctx.db.patch(company._id, args);
    } else {
      await ctx.db.insert('companies', args);
    }
  }
});

export const remove = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();
    if (company) await ctx.db.delete(company._id);
  }
});
