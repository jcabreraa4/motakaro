import type { WebhookEvent } from '@clerk/backend';
import { httpRouter } from 'convex/server';
import { Infer } from 'convex/values';
import { Webhook } from 'svix';

import { internal } from './_generated/api';
import { httpAction } from './_generated/server';
import { env } from './env';
import { organizationPlan, organizationRole } from './schema';

const http = httpRouter();

// Clerk Admins Webhook

http.route({
  path: '/clerk-admins-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    // Verify Request
    const event = await validateClerkAdminsRequest(request);
    if (!event) return new Response('Error occurred', { status: 400 });

    // User Events
    if (event.type === 'user.created' || event.type === 'user.updated') {
      // Upsert Admin
      await ctx.runMutation(internal.admins.internalUpsert, {
        email: event.data.email_addresses[0]?.email_address,
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
  })
});

async function validateClerkAdminsRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadStr = await req.text();
  const svixId = req.headers.get('svix-id');
  const svixTimestamp = req.headers.get('svix-timestamp');
  const svixSignature = req.headers.get('svix-signature');
  if (!svixId || !svixTimestamp || !svixSignature) return null;
  const wh = new Webhook(env.CLERK_ADMINS_WEBHOOK_SECRET);
  try {
    return wh.verify(payloadStr, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature
    }) as WebhookEvent;
  } catch {
    return null;
  }
}

// Clerk Clients Webhook

type OrganizationRole = Infer<typeof organizationRole>;
type OrganizationPlan = Infer<typeof organizationPlan>;

http.route({
  path: '/clerk-clients-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    // Verify Request
    const event = await validateClerkClientsRequest(request);
    if (!event) return new Response('Error occurred', { status: 400 });

    // User Events
    if (event.type === 'user.created' || event.type === 'user.updated') {
      // Upsert Contact
      await ctx.runMutation(internal.clients.internalUpsert, {
        email: event.data.email_addresses[0].email_address,
        name: event.data.first_name ?? '',
        surname: event.data.last_name ?? '',
        avatar: event.data.image_url ?? '',
        clerkId: event.data.id
      });
    } else if (event.type === 'user.deleted') {
      // Remove Contact
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
        name: event.data.name,
        logo: event.data.image_url ?? '',
        clerkId: event.data.id
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
        clientClerkId: event.data.public_user_data.user_id,
        organizationClerkId: event.data.organization.id,
        organizationRole: event.data.role as OrganizationRole
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
      const clerkId = event.data.payer?.organization_id;
      if (!clerkId) return new Response(null, { status: 200 });

      const plan = event.data.plan?.slug as OrganizationPlan;

      await ctx.runMutation(internal.organizations.internalUpdate, {
        plan: plan,
        clerkId: clerkId
      });
    }

    // Return Success
    return new Response(null, { status: 200 });
  })
});

async function validateClerkClientsRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadStr = await req.text();
  const svixId = req.headers.get('svix-id');
  const svixTimestamp = req.headers.get('svix-timestamp');
  const svixSignature = req.headers.get('svix-signature');
  if (!svixId || !svixTimestamp || !svixSignature) return null;
  const wh = new Webhook(env.CLERK_CLIENTS_WEBHOOK_SECRET);
  try {
    return wh.verify(payloadStr, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature
    }) as WebhookEvent;
  } catch {
    return null;
  }
}

// Calcom Webhook

type CalcomTrigger = 'BOOKING_CREATED' | 'BOOKING_RESCHEDULED' | 'BOOKING_CANCELLED' | 'BOOKING_REJECTED' | 'MEETING_STARTED' | 'MEETING_ENDED';

http.route({
  path: '/cal-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const body = await request.text();

    // Verify Request
    const signature = request.headers.get('X-Cal-Signature-256');
    if (!validateCalcomRequest(body, signature)) {
      return new Response('Invalid signature', { status: 401 });
    }

    // Extract Data
    const event = JSON.parse(body);
    const trigger = event.triggerEvent as CalcomTrigger;
    const payload = event.payload;

    // Booking Events
    if (trigger === 'BOOKING_CREATED') {
      await ctx.runMutation(internal.meetings.internalUpsert, {
        calcomId: payload.uid,
        name: payload.title,
        note: payload.responses?.notes?.value,
        link: payload.videoCallData?.url,
        start: new Date(payload.startTime).getTime(),
        end: new Date(payload.endTime).getTime(),
        organizer: payload.organizer.email,
        attendees: payload.attendees.map((a: { email: string }) => a.email),
        status: 'scheduled',
        website: payload.responses?.website?.value,
        attribution: payload.responses?.attribution?.value
      });
    } else if (trigger === 'BOOKING_RESCHEDULED') {
      await ctx.runMutation(internal.meetings.internalUpdate, {
        calcomId: payload.rescheduleUid ?? payload.uid,
        status: 'scheduled',
        rescheduling: payload.responses?.rescheduleReason?.value,
        newStart: new Date(payload.startTime).getTime(),
        newEnd: new Date(payload.endTime).getTime(),
        newCalcomId: payload.uid
      });
    } else if (trigger === 'BOOKING_CANCELLED') {
      await ctx.runMutation(internal.meetings.internalUpdate, {
        calcomId: payload.uid,
        status: 'cancelled',
        cancellation: payload.cancellationReason
      });
    } else if (trigger === 'BOOKING_REJECTED') {
      await ctx.runMutation(internal.meetings.internalUpdate, {
        calcomId: payload.uid,
        status: 'rejected',
        rejection: payload.rejectionReason
      });
    } else if (trigger === 'MEETING_STARTED') {
      await ctx.runMutation(internal.meetings.internalUpdate, {
        calcomId: event.uid,
        status: 'ongoing'
      });
    } else if (trigger === 'MEETING_ENDED') {
      await ctx.runMutation(internal.meetings.internalUpdate, {
        calcomId: event.uid,
        status: 'finished'
      });
    }

    // Return Success
    return new Response(null, { status: 200 });
  })
});

async function validateCalcomRequest(body: string, signature: string | null): Promise<boolean> {
  if (!signature || !env.CALCOM_WEBHOOK_SECRET) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(env.CALCOM_WEBHOOK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return signature === expected;
}

// Default Export

export default http;
