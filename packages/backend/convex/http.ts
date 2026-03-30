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

    // Handle Event
    if (event.type === 'user.created' || event.type === 'user.updated') {
      await ctx.runMutation(internal.workers.upsert, {
        name: event.data.first_name ?? undefined,
        surname: event.data.last_name ?? undefined,
        email: event.data.email_addresses[0]?.email_address ?? '',
        avatar: event.data.image_url ?? undefined,
        clerkId: event.data.id
      });
    } else if (event.type === 'user.deleted') {
      await ctx.runMutation(internal.workers.remove, {
        clerkId: event.data.id!
      });
    }
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

http.route({
  path: '/clerk-clients-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    // Verify Request
    const event = await validateClerkClientsRequest(request);
    if (!event) return new Response('Error occurred', { status: 400 });

    // Handle Event
    if (event.type === 'organization.created' || event.type === 'organization.updated') {
      await ctx.runMutation(internal.companies.upsert, {
        name: event.data.name,
        logo: event.data.image_url ?? undefined,
        clerkId: event.data.id
      });
    } else if (event.type === 'organization.deleted') {
      await ctx.runMutation(internal.companies.remove, {
        clerkId: event.data.id!
      });
    } else if (event.type === 'user.created' || event.type === 'user.updated') {
      await ctx.runMutation(internal.contacts.upsert, {
        name: event.data.first_name ?? undefined,
        surname: event.data.last_name ?? undefined,
        email: event.data.email_addresses[0]?.email_address ?? '',
        avatar: event.data.image_url ?? undefined,
        clerkId: event.data.id
      });
    } else if (event.type === 'user.deleted') {
      await ctx.runMutation(internal.contacts.remove, {
        clerkId: event.data.id!
      });
    }
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

/*
Custom Payload Template
{
 "trigger": "{{triggerEvent}}",
 "name": "{{title}}",
 "url": "{{metadata.videoCallUrl}}"
 "start": "{{startTime}}",
 "end": "{{endTime}}",
 "organizer": "{{organizer.email}}",
 "attendees": "{{attendees}}",
 "cancellation": "{{cancellationReason}}",
 "rejecttion": "{{rejectionReason}}",
 "calcomId": "{{uid}}"
}
*/

http.route({
  path: '/cal-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const body = await request.text();
    const signature = request.headers.get('X-Cal-Signature-256');
    if (!validateCalcomRequest(body, signature)) {
      return new Response('Invalid signature', { status: 401 });
    }

    const event = JSON.parse(body);
    const trigger = event.triggerEvent;
    const payload = event.payload;

    if (trigger === 'BOOKING_CREATED') {
      await ctx.runMutation(internal.meetings.upsert, {
        name: payload.title,
        note: payload.responses?.notes?.value ?? '',
        url: payload.videoCallData?.url ?? '',
        start: new Date(payload.startTime).getTime(),
        end: new Date(payload.endTime).getTime(),
        status: 'scheduled',
        organizer: payload.organizer.email,
        attendees: payload.attendees.map((a: { email: string }) => a.email),
        cancellation: '',
        rejection: '',
        calcomId: payload.uid
      });
    } else if (trigger === 'BOOKING_CANCELLED') {
      await ctx.runMutation(internal.meetings.updateStatus, {
        calcomId: payload.uid,
        status: 'cancelled'
      });
    } else if (trigger === 'BOOKING_REJECTED') {
      await ctx.runMutation(internal.meetings.updateStatus, {
        calcomId: payload.uid,
        status: 'rejected'
      });
    } else if (trigger === 'MEETING_STARTED') {
      await ctx.runMutation(internal.meetings.updateStatus, {
        calcomId: payload.uid,
        status: 'started'
      });
    } else if (trigger === 'MEETING_ENDED') {
      await ctx.runMutation(internal.meetings.updateStatus, {
        calcomId: payload.uid,
        status: 'finished'
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
