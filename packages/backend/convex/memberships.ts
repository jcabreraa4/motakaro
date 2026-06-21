import { ConvexError, v } from 'convex/values';

import { internalMutation } from './_generated/server';
import { organizationRole } from './schema';

// Internal Mutations

export const internalUpsert = internalMutation({
  args: {
    clientClerkId: v.string(),
    organizationClerkId: v.string(),
    organizationRole: organizationRole
  },
  handler: async (ctx, args) => {
    // Obtain Client
    const client = await ctx.db
      .query('clients')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clientClerkId))
      .first();
    if (!client) throw new ConvexError('Client not found');

    // Obtain Organization
    const organization = await ctx.db
      .query('organizations')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.organizationClerkId))
      .first();
    if (!organization) throw new ConvexError('Organization not found');

    // Obtain Membership
    const membership = await ctx.db
      .query('memberships')
      .withIndex('by_clientId_organizationId', (q) => q.eq('clientId', client._id).eq('organizationId', organization._id))
      .first();

    if (membership) {
      // Update Membership
      await ctx.db.patch(membership._id, {
        organizationRole: args.organizationRole,
        updated: Date.now()
      });
    } else {
      // Create Membership
      await ctx.db.insert('memberships', {
        clientId: client._id,
        organizationId: organization._id,
        organizationRole: args.organizationRole,
        updated: Date.now()
      });
    }
  }
});

export const internalRemove = internalMutation({
  args: {
    clientClerkId: v.string(),
    organizationClerkId: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain Client
    const client = await ctx.db
      .query('clients')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clientClerkId))
      .first();
    if (!client) return; // If client already deleted, race condition

    // Obtain Organization
    const organization = await ctx.db
      .query('organizations')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.organizationClerkId))
      .first();
    if (!organization) return; // If organization already deleted, race condition

    // Obtain Membership
    const membership = await ctx.db
      .query('memberships')
      .withIndex('by_clientId_organizationId', (q) => q.eq('clientId', client._id).eq('organizationId', organization._id))
      .first();
    if (!membership) throw new ConvexError('Membership not found');

    // Remove Membership
    await ctx.db.delete(membership._id);
  }
});
