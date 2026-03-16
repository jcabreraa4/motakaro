import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import type { WebhookEvent } from '@clerk/backend';
import { Webhook } from 'svix';

const http = httpRouter();

// Clerk Webhook

http.route({
  path: '/clerk-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    // Verify Request
    const event = await validateClerkRequest(request);
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

async function validateClerkRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadStr = await req.text();
  const svixId = req.headers.get('svix-id');
  const svixTimestamp = req.headers.get('svix-timestamp');
  const svixSignature = req.headers.get('svix-signature');
  if (!svixId || !svixTimestamp || !svixSignature) return null;
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
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
    // Process Request
    const body = await request.text();

    // Verify Request
    const signature = request.headers.get('X-Cal-Signature-256');
    if (!validateCalcomRequest(body, signature)) {
      return new Response('Invalid signature', { status: 401 });
    }

    // Handle Event
    const event = JSON.parse(body);
    const { triggerEvent, payload } = event;

    if (triggerEvent === 'BOOKING_CREATED') {
      await ctx.runMutation(internal.meetings.upsert, {
        calcomId: payload.uid,
        name: payload.title,
        note: payload.additionalNotes ?? '',
        status: 'scheduled',
        startTime: new Date(payload.startTime).getTime(),
        endTime: new Date(payload.endTime).getTime(),
        attendees: payload.attendees.map((a: { email: string }) => a.email)
      });
    } else if (triggerEvent === 'BOOKING_CANCELLED') {
      await ctx.runMutation(internal.meetings.updateStatus, {
        calcomId: payload.uid,
        status: 'cancelled'
      });
    } else if (triggerEvent === 'BOOKING_REJECTED') {
      await ctx.runMutation(internal.meetings.updateStatus, {
        calcomId: payload.uid,
        status: 'rejected'
      });
    } else if (triggerEvent === 'MEETING_STARTED') {
      await ctx.runMutation(internal.meetings.updateStatus, {
        calcomId: payload.uid,
        status: 'started'
      });
    } else if (triggerEvent === 'MEETING_ENDED') {
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
