import { MutationCtx, QueryCtx, ActionCtx } from './_generated/server';
import { ConvexError } from 'convex/values';

type AnyCtx = QueryCtx | MutationCtx | ActionCtx;

export const adminsIssuer = process.env.CLERK_JWT_ADMINS_DOMAIN;
export const clientsIssuer = process.env.CLERK_JWT_CLIENTS_DOMAIN;

export async function verifyIdentity(ctx: AnyCtx) {
  // Check Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError('Unauthorized');

  // Return Identity
  return identity;
}

export async function verifyAdminAuth(ctx: AnyCtx) {
  // Check Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.issuer !== adminsIssuer) {
    throw new ConvexError('Unauthorized');
  }

  // Return Identity
  return identity;
}

export async function verifyClientAuth(ctx: AnyCtx) {
  // Check Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.issuer !== clientsIssuer) {
    throw new ConvexError('Unauthorized');
  }

  // Return Identity
  return identity;
}
