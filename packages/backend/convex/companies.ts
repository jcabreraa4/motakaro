import { adminsIssuer, clientsIssuer, verifyAdminAuth, verifyIdentity } from './auth';
import { internalMutation, query } from './_generated/server';
import { Id } from './_generated/dataModel';
import { v } from 'convex/values';

export const list = query({
  handler: async (ctx) => {
    // Check Identity
    const identity = await verifyAdminAuth(ctx);

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
    // Check Identity
    const identity = await verifyIdentity(ctx);

    try {
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

// Internal Mutations

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
  args: {
    clerkId: v.string()
  },
  handler: async (ctx, { clerkId }) => {
    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();
    if (company) await ctx.db.delete(company._id);
  }
});
