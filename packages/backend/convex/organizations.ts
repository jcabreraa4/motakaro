import { createClerkClient } from '@clerk/backend';
import { ConvexError, v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import { internalAction, internalMutation, query } from './_generated/server';
import { getClientAuth, verifyAdminAuth } from './auth';
import { env } from './env';

export const list = query({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    // Return Organizations
    const query = ctx.db.query('organizations').order('desc');
    return args.limit ? await query.take(args.limit) : await query.collect();
  }
});

export const get = query({
  args: {
    id: v.optional(v.string()),
    clerkId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check Identity
    await verifyAdminAuth(ctx);

    try {
      // Return Organization
      if (args.id) {
        return await ctx.db.get(args.id as Id<'organizations'>);
      } else if (args.clerkId) {
        return await ctx.db
          .query('organizations')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId!))
          .first();
      }
    } catch {
      return null;
    }
  }
});

// Client Functions

export const clientList = query({
  handler: async (ctx) => {
    // Obtain Identity
    const identity = await getClientAuth(ctx);
    if (!identity) return null;

    // Obtain Client
    const client = await ctx.db
      .query('clients')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();
    if (!client) throw new ConvexError('Client not found');

    // Obtain Memberships
    const memberships = await ctx.db
      .query('memberships')
      .withIndex('by_clientId', (q) => q.eq('clientId', client._id))
      .collect();

    // Return Organizations
    const organizations = await Promise.all(memberships.map((membership) => ctx.db.get(membership.organizationId)));
    return organizations.filter((organization) => organization !== null);
  }
});

// Internal Mutations

export const internalUpsert = internalMutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    logo: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain Organization
    const organization = await ctx.db
      .query('organizations')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (organization) {
      // Update Organization
      await ctx.db.patch(organization._id, { ...args, updated: Date.now() });
    } else {
      // Create Organization
      await ctx.db.insert('organizations', {
        clerkId: args.clerkId,
        name: args.name,
        logo: args.logo,
        plan: 'onboarding',
        onboarded: false,
        status: 'active',
        starred: false,
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
    // Obtain Organization
    const organization = await ctx.db
      .query('organizations')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();
    if (!organization) throw new ConvexError('Organization not found');

    // Remove Memberships
    const memberships = await ctx.db
      .query('memberships')
      .withIndex('by_organizationId', (q) => q.eq('organizationId', organization._id))
      .collect();
    await Promise.all(memberships.map((m) => ctx.db.delete(m._id)));

    // Remove Organization
    await ctx.db.delete(organization._id);
  }
});

export const internalUpdate = internalMutation({
  args: {
    clerkId: v.string(),
    plan: v.union(v.literal('onboarding'), v.literal('rollout'), v.literal('scaling'))
  },
  handler: async (ctx, args) => {
    // Obtain Organization
    const organization = await ctx.db
      .query('organizations')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();
    if (!organization) throw new ConvexError('Organization not found');

    // Update Organization
    await ctx.db.patch(organization._id, { ...args, updated: Date.now() });
  }
});

// Internal Actions

export const disableDelete = internalAction({
  args: {
    clerkId: v.string()
  },
  handler: async (ctx, args) => {
    const clerk = createClerkClient({ secretKey: env.CLERK_CLIENTS_SECRET_KEY });
    await clerk.organizations.updateOrganization(args.clerkId, {
      adminDeleteEnabled: false
    });
  }
});
