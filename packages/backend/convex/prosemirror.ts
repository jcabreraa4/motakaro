import { ProsemirrorSync } from '@convex-dev/prosemirror-sync';
import { ConvexError } from 'convex/values';

import { components } from './_generated/api';
import { DataModel, type Id } from './_generated/dataModel';
import { MutationCtx, QueryCtx } from './_generated/server';
import { verifyAdminAuth } from './auth';

export const prosemirrorSync = new ProsemirrorSync((components as any).prosemirrorSync);

async function requireOwner(ctx: QueryCtx | MutationCtx, documentId: string) {
  // Check Identity
  await verifyAdminAuth(ctx);

  const document = await ctx.db.get(documentId as Id<'documents'>);
  if (!document) throw new ConvexError('Document not found');
}

export const { getSnapshot, submitSnapshot, latestVersion, getSteps, submitSteps } = prosemirrorSync.syncApi<DataModel>({
  checkRead: requireOwner,
  checkWrite: requireOwner,
  onSnapshot: async (ctx, id, snapshot) => {
    await ctx.db.patch(id as Id<'documents'>, { content: snapshot, updated: Date.now() });
  }
});
