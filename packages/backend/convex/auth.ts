import { MutationCtx, QueryCtx, ActionCtx } from './_generated/server';
import { ConvexError } from 'convex/values';

type AnyCtx = QueryCtx | MutationCtx | ActionCtx;

export const adminsIssuer = process.env.CLERK_JWT_ADMINS_DOMAIN;
export const clientsIssuer = process.env.CLERK_JWT_CLIENTS_DOMAIN;

// Admins Functions

export async function verifyAdminAuth(ctx: AnyCtx) {
  // Check Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.issuer !== adminsIssuer) {
    throw new ConvexError('Unauthorized');
  }

  // Return Identity
  return identity;
}

export async function getAdminAuth(ctx: AnyCtx) {
  // Check Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.issuer !== adminsIssuer) {
    return null;
  }

  // Return Identity
  return identity;
}

// Clients Functions

export async function verifyClientAuth(ctx: AnyCtx) {
  // Check Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.issuer !== clientsIssuer) {
    throw new ConvexError('Unauthorized');
  }

  // Return Identity
  return identity;
}

export async function getClientAuth(ctx: AnyCtx) {
  // Check Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.issuer !== clientsIssuer) {
    return null;
  }

  // Return Identity
  return identity;
}

// Shared Functions

export async function verifyIdentity(ctx: AnyCtx) {
  // Check Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError('Unauthorized');

  // Return Identity
  return identity;
}
