import { ConvexError } from 'convex/values';
import { MutationCtx, QueryCtx } from './_generated/server';

export const adminsIssuer = process.env.CLERK_JWT_ADMINS_DOMAIN;
export const clientsIssuer = process.env.CLERK_JWT_CLIENTS_DOMAIN;

export async function verifyIdentity(ctx: QueryCtx | MutationCtx) {
  // Check Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError('Unauthorized');
  return identity;
}

export async function verifyAdminAuth(ctx: QueryCtx | MutationCtx) {
  // Check Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.issuer !== adminsIssuer) {
    throw new ConvexError('Unauthorized');
  }
  return identity;
}

export async function verifyClientAuth(ctx: QueryCtx | MutationCtx) {
  // Check Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.issuer !== clientsIssuer) {
    throw new ConvexError('Unauthorized');
  }
  return identity;
}
