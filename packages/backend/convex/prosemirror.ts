import { ProsemirrorSync } from '@convex-dev/prosemirror-sync';
import { ConvexError } from 'convex/values';

import { components } from './_generated/api';
import { DataModel, type Id } from './_generated/dataModel';
import { MutationCtx, QueryCtx } from './_generated/server';
import { verifyIdentity } from './auth';

export const prosemirror = new ProsemirrorSync(components.prosemirrorSync);

async function verifyAccess(ctx: QueryCtx | MutationCtx, id: string) {
  // Verify Identity
  const { identity, issuer } = await verifyIdentity(ctx);

  // Filter Clients
  if (issuer === 'admins') return;

  // Obtain Organization
  const clerkId = identity.org_id as string;
  if (!clerkId) throw new ConvexError('Organization not found');

  const organization = await ctx.db
    .query('organizations')
    .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
    .first();
  if (!organization) throw new ConvexError('Organization not found');

  // Obtain Document
  const document = await ctx.db.get(id as Id<'documents'>);
  if (!document) throw new ConvexError('Document not found');

  // Check Ownership
  if (document.organizationId !== organization._id) {
    throw new ConvexError('Unauthorized');
  }
}

export const { getSnapshot, submitSnapshot, latestVersion, getSteps, submitSteps } = prosemirror.syncApi<DataModel>({
  checkRead: verifyAccess,
  checkWrite: verifyAccess,
  onSnapshot: async (ctx, id, snapshot) => {
    await ctx.db.patch(id as Id<'documents'>, {
      content: snapshot,
      updated: Date.now()
    });
  }
});
