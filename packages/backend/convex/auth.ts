import { ConvexError } from 'convex/values';

import { ActionCtx, MutationCtx, QueryCtx } from './_generated/server';
import { env } from './env';

export const adminsIssuer = env.CLERK_ADMINS_JWT_DOMAIN;
export const clientsIssuer = env.CLERK_CLIENTS_JWT_DOMAIN;

type AnyCtx = QueryCtx | MutationCtx | ActionCtx;
type Issuer = 'admins' | 'clients' | null;

// Admins Functions

export async function getAdminAuth(ctx: AnyCtx) {
  // Obtain Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.issuer !== adminsIssuer) {
    return null;
  }

  // Return Identity
  return identity;
}

export async function verifyAdminAuth(ctx: AnyCtx) {
  // Obtain Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.issuer !== adminsIssuer) {
    throw new ConvexError('Unauthorized');
  }

  // Return Identity
  return identity;
}

// Clients Functions

export async function getClientAuth(ctx: AnyCtx) {
  // Obtain Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.issuer !== clientsIssuer) {
    return null;
  }

  // Return Identity
  return identity;
}

export async function verifyClientAuth(ctx: AnyCtx) {
  // Obtain Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.issuer !== clientsIssuer) {
    throw new ConvexError('Unauthorized');
  }

  // Return Identity
  return identity;
}

// Shared Functions

export async function verifyIdentity(ctx: AnyCtx) {
  // Obtain Identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError('Unauthorized');

  // Obtain Issuer
  const issuer: Issuer = identity.issuer === clientsIssuer ? 'clients' : identity.issuer === adminsIssuer ? 'admins' : null;
  if (!issuer) throw new ConvexError('Unauthorized');

  // Return Identity
  return { identity, issuer };
}
