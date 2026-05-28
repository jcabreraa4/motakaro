import { ConvexError, v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import { internalMutation, query } from './_generated/server';
import { getClientAuth, verifyAdminAuth } from './auth';

// Admins Functions

export const list = query({
  handler: async (ctx) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Return Companies
    return await ctx.db.query('companies').order('desc').collect();
  }
});

export const get = query({
  args: {
    id: v.string()
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    try {
      // Return Company
      return await ctx.db.get(args.id as Id<'companies'>);
    } catch {
      return null;
    }
  }
});

// Clients Functions

export const clientsList = query({
  handler: async (ctx) => {
    // Check Identity
    const identity = await getClientAuth(ctx);
    if (!identity) return null;

    // Obtain Contact
    const contact = await ctx.db
      .query('contacts')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();
    if (!contact) throw new ConvexError('Contact not found');

    // Obtain Memberships
    const memberships = await ctx.db
      .query('memberships')
      .withIndex('by_contactId', (q) => q.eq('contactId', contact._id))
      .collect();

    // Return Companies
    const companies = await Promise.all(memberships.map((membership) => ctx.db.get(membership.companyId)));
    return companies.filter((company) => company !== null);
  }
});

// Internal Mutations

export const internalUpsert = internalMutation({
  args: {
    name: v.string(),
    logo: v.string(),
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain Company
    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (company) {
      // Update Company
      await ctx.db.patch(company._id, { ...args, updated: Date.now() });
    } else {
      // Create Company
      await ctx.db.insert('companies', {
        name: args.name,
        logo: args.logo,
        plan: 'onboarding',
        clerkId: args.clerkId,
        starred: false,
        onboarded: false,
        updated: Date.now()
      });
    }
  }
});

export const internalRemove = internalMutation({
  args: {
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain Company
    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();
    if (!company) throw new ConvexError('Company not found');

    // Remove Memberships
    const memberships = await ctx.db
      .query('memberships')
      .withIndex('by_companyId', (q) => q.eq('companyId', company._id))
      .collect();
    await Promise.all(memberships.map((m) => ctx.db.delete(m._id)));

    // Remove Company
    await ctx.db.delete(company._id);
  }
});

export const internalUpdate = internalMutation({
  args: {
    plan: v.union(v.literal('onboarding'), v.literal('rollout'), v.literal('scaling')),
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain Company
    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();
    if (!company) throw new ConvexError('Company not found');

    // Update Company
    await ctx.db.patch(company._id, { ...args, updated: Date.now() });
  }
});
