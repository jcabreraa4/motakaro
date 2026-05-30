import { ConvexError, v } from 'convex/values';

import { internalMutation } from './_generated/server';

// Internal Functions

export const internalUpsert = internalMutation({
  args: {
    orgRole: v.union(v.literal('org:admin'), v.literal('org:member')),
    contactClerkId: v.string(),
    companyClerkId: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain Convex Contact ID
    const contact = await ctx.db
      .query('contacts')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.contactClerkId))
      .first();
    if (!contact) throw new ConvexError('Contact not found');

    // Obtain Convex Company ID
    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.companyClerkId))
      .first();
    if (!company) throw new ConvexError('Company not found');

    // Obtain Membership
    const membership = await ctx.db
      .query('memberships')
      .withIndex('by_contactId_companyId', (q) => q.eq('contactId', contact._id).eq('companyId', company._id))
      .first();

    // Check for Membership
    if (membership) {
      // Update Membership
      await ctx.db.patch(membership._id, {
        // Webhook Columns
        orgRole: args.orgRole,

        // Primary Columns
        updated: Date.now()
      });
    } else {
      // Create Membership
      await ctx.db.insert('memberships', {
        // Webhook Columns
        orgRole: args.orgRole,
        contactId: contact._id,
        companyId: company._id,

        // Primary Columns
        updated: Date.now()
      });
    }
  }
});

export const internalRemove = internalMutation({
  args: {
    contactClerkId: v.string(),
    companyClerkId: v.string()
  },
  handler: async (ctx, args) => {
    // Obtain Convex Contact ID
    const contact = await ctx.db
      .query('contacts')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.contactClerkId))
      .first();
    if (!contact) return; // Contact already deleted, race condition

    // Obtain Convex Company ID
    const company = await ctx.db
      .query('companies')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.companyClerkId))
      .first();
    if (!company) return; // Company already deleted, race condition

    // Obtain Membership
    const membership = await ctx.db
      .query('memberships')
      .withIndex('by_contactId_companyId', (q) => q.eq('contactId', contact._id).eq('companyId', company._id))
      .first();
    if (!membership) throw new ConvexError('Membership not found');

    // Remove Membership
    await ctx.db.delete(membership._id);
  }
});
