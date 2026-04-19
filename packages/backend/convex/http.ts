import type { WebhookEvent } from '@clerk/backend';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { httpRouter } from 'convex/server';
import { Webhook } from 'svix';

const http = httpRouter();

// Clerk Admins Webhook

http.route({
  path: '/clerk-admins-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    // Verify Request
    const event = await validateClerkAdminsRequest(request);
    if (!event) return new Response('Error occurred', { status: 400 });

    // Log Webhook Data
    console.log(`Clerk Admins Webhook Data: ${JSON.stringify(event.data)}`);

    // Handle User Events
    if (event.type === 'user.created' || event.type === 'user.updated') {
      await ctx.runMutation(internal.employees.internalUpsert, {
        email: event.data.email_addresses[0]?.email_address ?? '',
        name: event.data.first_name ?? undefined,
        surname: event.data.last_name ?? undefined,
        avatar: event.data.image_url ?? undefined,
        clerkId: event.data.id
      });
    } else if (event.type === 'user.deleted') {
      await ctx.runMutation(internal.employees.internalRemove, {
        clerkId: event.data.id!
      });
    }

    // Return 200 OK Status
    return new Response(null, { status: 200 });
  })
});

async function validateClerkAdminsRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadStr = await req.text();
  const svixId = req.headers.get('svix-id');
  const svixTimestamp = req.headers.get('svix-timestamp');
  const svixSignature = req.headers.get('svix-signature');
  if (!svixId || !svixTimestamp || !svixSignature) return null;
  const wh = new Webhook(process.env.CLERK_ADMINS_WEBHOOK_SECRET!);
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

type OrgPlans = 'trial' | 'rollout' | 'scaling';

http.route({
  path: '/clerk-clients-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    // Verify Request
    const event = await validateClerkClientsRequest(request);
    if (!event) return new Response('Error occurred', { status: 400 });

    // Log Webhook Data
    console.log(`Clerk Clients Webhook Data: ${JSON.stringify(event.data)}`);

    // Handle User Events
    if (event.type === 'user.created' || event.type === 'user.updated') {
      await ctx.runMutation(internal.contacts.internalUpsert, {
        email: event.data.email_addresses[0]?.email_address ?? '',
        name: event.data.first_name ?? undefined,
        surname: event.data.last_name ?? undefined,
        avatar: event.data.image_url ?? undefined,
        clerkId: event.data.id
      });
    } else if (event.type === 'user.deleted') {
      await ctx.runMutation(internal.contacts.internalRemove, {
        clerkId: event.data.id!
      });
    }

    // Handle Organization Events
    if (event.type === 'organization.created' || event.type === 'organization.updated') {
      await ctx.runMutation(internal.companies.internalUpsert, {
        name: event.data.name,
        logo: event.data.image_url ?? undefined,
        clerkId: event.data.id
      });
    } else if (event.type === 'organization.deleted') {
      await ctx.runMutation(internal.companies.internalRemove, {
        clerkId: event.data.id!
      });
    }

    // Handle Membership Events
    if (event.type === 'organizationMembership.created' || event.type === 'organizationMembership.updated') {
      await ctx.runMutation(internal.memberships.internalUpsert, {
        contactClerkId: event.data.public_user_data.user_id,
        companyClerkId: event.data.organization.id,
        orgRole: event.data.role
      });
    } else if (event.type === 'organizationMembership.deleted') {
      await ctx.runMutation(internal.memberships.internalRemove, {
        contactClerkId: event.data.public_user_data.user_id,
        companyClerkId: event.data.organization.id
      });
    }

    // Handle Billing Events
    if (event.type === 'subscriptionItem.active') {
      const clerkId = event.data.payer?.organization_id;
      if (!clerkId) return new Response(null, { status: 200 });

      const plan = event.data.plan?.slug as OrgPlans;

      await ctx.runMutation(internal.companies.internalUpdate, {
        clerkId: clerkId,
        plan: plan
      });
    }

    // Return 200 OK Status
    return new Response(null, { status: 200 });
  })
});

async function validateClerkClientsRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadStr = await req.text();
  const svixId = req.headers.get('svix-id');
  const svixTimestamp = req.headers.get('svix-timestamp');
  const svixSignature = req.headers.get('svix-signature');
  if (!svixId || !svixTimestamp || !svixSignature) return null;
  const wh = new Webhook(process.env.CLERK_CLIENTS_WEBHOOK_SECRET!);
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
    const trigger = event.triggerEvent;
    const payload = event.payload;

    // Log Webhook Data
    console.log(`Calcom Webhook Data: ${JSON.stringify(event.payload)}`);

    // Handle Booking Event
    if (trigger === 'BOOKING_CREATED') {
      await ctx.runMutation(internal.meetings.upsert, {
        name: payload.title,
        note: payload.responses?.notes?.value,
        url: payload.videoCallData?.url,
        start: new Date(payload.startTime).getTime(),
        end: new Date(payload.endTime).getTime(),
        organizer: payload.organizer.email,
        attendees: payload.attendees.map((a: { email: string }) => a.email),
        website: payload.responses?.website?.value,
        attribution: payload.responses?.attribution?.value,
        status: 'scheduled',
        calcomId: payload.uid
      });
    } else if (trigger === 'BOOKING_RESCHEDULED') {
      await ctx.runMutation(internal.meetings.upsert, {
        start: new Date(payload.startTime).getTime(),
        end: new Date(payload.endTime).getTime(),
        rescheduling: payload.rescheduleReason,
        status: 'scheduled',
        calcomId: payload.rescheduleUid ?? payload.uid,
        newCalcomId: payload.uid
      });
    } else if (trigger === 'BOOKING_CANCELLED') {
      await ctx.runMutation(internal.meetings.upsert, {
        cancellation: payload.cancellationReason ?? '',
        status: 'cancelled',
        calcomId: payload.uid
      });
    } else if (trigger === 'BOOKING_REJECTED') {
      await ctx.runMutation(internal.meetings.upsert, {
        rejection: payload.rejectionReason ?? '',
        status: 'rejected',
        calcomId: payload.uid
      });
    } else if (trigger === 'MEETING_STARTED') {
      await ctx.runMutation(internal.meetings.upsert, {
        status: 'ongoing',
        calcomId: payload.uid
      });
    } else if (trigger === 'MEETING_ENDED') {
      await ctx.runMutation(internal.meetings.upsert, {
        status: 'finished',
        calcomId: payload.uid
      });
    }
    return new Response(null, { status: 200 });
  })
});

async function validateCalcomRequest(body: string, signature: string | null): Promise<boolean> {
  if (!signature || !process.env.CALCOM_WEBHOOK_SECRET) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(process.env.CALCOM_WEBHOOK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return signature === expected;
}

// Default Export

export default http;
