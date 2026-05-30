import { ConvexError } from 'convex/values';

import { ActionCtx, MutationCtx, QueryCtx } from './_generated/server';
import { env } from './env';

type AnyCtx = QueryCtx | MutationCtx | ActionCtx;

export const adminsIssuer = env.CLERK_ADMINS_JWT_DOMAIN;
export const clientsIssuer = env.CLERK_CLIENTS_JWT_DOMAIN;

// Admins Functions

export async function getAdminAuth(ctx: AnyCtx) {
  // Check Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.issuer !== adminsIssuer) {
    return null;
  }

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

// Clients Functions

export async function getClientAuth(ctx: AnyCtx) {
  // Check Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.issuer !== clientsIssuer) {
    return null;
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

// Shared Functions

export async function verifyIdentity(ctx: AnyCtx) {
  // Check Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError('Unauthorized');

  // Return Identity
  return identity;
}
