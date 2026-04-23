import { internalMutation } from './_generated/server';
import { ConvexError, v } from 'convex/values';

export const internalUpsert = internalMutation({
  args: {
    contactClerkId: v.string(),
    companyClerkId: v.string(),
    orgRole: v.union(v.literal('org:admin'), v.literal('org:member'))
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
        orgRole: args.orgRole
      });
    } else {
      // Create Membership
      await ctx.db.insert('memberships', {
        contactId: contact._id,
        companyId: company._id,
        orgRole: args.orgRole
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
    if (!membership) throw new ConvexError('Membership not found');

    // Remove Membership
    await ctx.db.delete(membership._id);
  }
});
