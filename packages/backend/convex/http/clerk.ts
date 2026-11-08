import type { WebhookEvent } from '@clerk/backend';
import { Infer } from 'convex/values';
import { Webhook } from 'svix';

import { internal } from '../_generated/api';
import { httpAction } from '../_generated/server';
import { env } from '../env';
import { membershipsRole, organizationsPlan } from '../schema';

type MembershipsRole = Infer<typeof membershipsRole>;
type OrganizationsPlan = Infer<typeof organizationsPlan>;
type ClerkWebhookType = 'admins' | 'clients';

// Clerk Admins (/clerk-admins)

export const clerkAdmins = httpAction(async (ctx, request) => {
  // Verify Request
  const event = await validateRequest({ request, webhook: 'admins' });
  if (!event) return new Response('Error occurred', { status: 400 });

  // User Events
  if (event.type === 'user.created' || event.type === 'user.updated') {
    // Upsert Admin
    await ctx.runMutation(internal.admins.internalUpsert, {
      email: event.data.email_addresses[0]!.email_address!,
      name: event.data.first_name ?? '',
      surname: event.data.last_name ?? '',
      avatar: event.data.image_url ?? '',
      clerkId: event.data.id
    });
  } else if (event.type === 'user.deleted') {
    // Remove Admin
    await ctx.runMutation(internal.admins.internalRemove, {
      clerkId: event.data.id!
    });
  }

  // Return Success
  return new Response(null, { status: 200 });
});

// Clerk Clients (/clerk-clients)

export const clerkClients = httpAction(async (ctx, request) => {
  // Verify Request
  const event = await validateRequest({ request, webhook: 'clients' });
  if (!event) return new Response('Error occurred', { status: 400 });

  // User Events
  if (event.type === 'user.created' || event.type === 'user.updated') {
    // Upsert Client
    await ctx.runMutation(internal.clients.internalUpsert, {
      email: event.data.email_addresses[0]!.email_address!,
      name: event.data.first_name ?? '',
      surname: event.data.last_name ?? '',
      avatar: event.data.image_url ?? '',
      clerkId: event.data.id
    });
  } else if (event.type === 'user.deleted') {
    // Remove Client
    await ctx.runMutation(internal.clients.internalRemove, {
      clerkId: event.data.id!
    });
  }

  // Organization Events
  if (event.type === 'organization.created' || event.type === 'organization.updated') {
    // Disable Delete
    if (event.type === 'organization.created') {
      await ctx.runAction(internal.organizations.disableDelete, {
        clerkId: event.data.id
      });
    }

    // Upsert Organization
    await ctx.runMutation(internal.organizations.internalUpsert, {
      clerkId: event.data.id,
      name: event.data.name,
      slug: event.data.slug,
      logo: event.data.image_url ?? ''
    });
  } else if (event.type === 'organization.deleted') {
    // Remove Organization
    await ctx.runMutation(internal.organizations.internalRemove, {
      clerkId: event.data.id!
    });
  }

  // Membership Events
  if (event.type === 'organizationMembership.created' || event.type === 'organizationMembership.updated') {
    // Upsert Membership
    await ctx.runMutation(internal.memberships.internalUpsert, {
      role: event.data.role as MembershipsRole,
      clientClerkId: event.data.public_user_data.user_id,
      organizationClerkId: event.data.organization.id
    });
  } else if (event.type === 'organizationMembership.deleted') {
    // Remove Membership
    await ctx.runMutation(internal.memberships.internalRemove, {
      clientClerkId: event.data.public_user_data.user_id,
      organizationClerkId: event.data.organization.id
    });
  }

  // Billing Events
  if (event.type === 'subscriptionItem.active') {
    // Obtain ID
    const clerkId = event.data.payer?.organization_id;
    if (!clerkId) return new Response(null, { status: 200 });

    const plan = event.data.plan?.slug as OrganizationsPlan;

    // Update Organization
    await ctx.runMutation(internal.organizations.internalUpdate, {
      plan: plan,
      clerkId: clerkId
    });
  }

  // Return Success
  return new Response(null, { status: 200 });
});

// Clerk Request Validator

interface ValidateRequestProps {
  request: Request;
  webhook: ClerkWebhookType;
}

async function validateRequest({ request, webhook }: ValidateRequestProps): Promise<WebhookEvent | null> {
  // Obtain Payload
  const payload = await request.text();

  // Verify Headers
  const svixId = request.headers.get('svix-id');
  const svixTimestamp = request.headers.get('svix-timestamp');
  const svixSignature = request.headers.get('svix-signature');
  if (!svixId || !svixTimestamp || !svixSignature) return null;

  // Obtain Secret
  const secret = webhook === 'admins' ? env.CLERK_ADMINS_WEBHOOK_SECRET : env.CLERK_CLIENTS_WEBHOOK_SECRET;
  const wh = new Webhook(secret);

  // Verify Signature
  try {
    return wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature
    }) as unknown as WebhookEvent;
  } catch {
    return null;
  }
}
