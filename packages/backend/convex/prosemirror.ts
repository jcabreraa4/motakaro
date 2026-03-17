import { ProsemirrorSync } from '@convex-dev/prosemirror-sync';
import { MutationCtx, QueryCtx } from './_generated/server';
import { Id, DataModel } from './_generated/dataModel';
import { components } from './_generated/api';
import { ConvexError } from 'convex/values';

export const prosemirrorSync = new ProsemirrorSync((components as any).prosemirrorSync);

const adminsIssuer = process.env.CLERK_JWT_ADMINS_DOMAIN;

async function requireOwner(ctx: QueryCtx | MutationCtx, documentId: string) {
  // Check Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.issuer !== adminsIssuer) {
    throw new ConvexError('Unauthorized');
  }

  const document = await ctx.db.get(documentId as Id<'documents'>);
  if (!document) throw new ConvexError('Not found');
}

export const { getSnapshot, submitSnapshot, latestVersion, getSteps, submitSteps } = prosemirrorSync.syncApi<DataModel>({
  checkRead: requireOwner,
  checkWrite: requireOwner,
  onSnapshot: async (ctx, id, snapshot) => {
    await ctx.db.patch(id as Id<'documents'>, { content: snapshot, updated: Date.now() });
  }
});
