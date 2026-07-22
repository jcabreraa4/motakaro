import { internal } from '../_generated/api';
import { httpAction } from '../_generated/server';
import { env } from '../env';

type CalcomTrigger = 'BOOKING_CREATED' | 'BOOKING_RESCHEDULED' | 'BOOKING_CANCELLED' | 'BOOKING_REJECTED' | 'MEETING_STARTED' | 'MEETING_ENDED';

// Calcom Sync (/calcom-sync)

export const calcomSync = httpAction(async (ctx, request) => {
  const body = await request.text();

  // Verify Request
  const signature = request.headers.get('X-Cal-Signature-256');
  if (!validateRequest(body, signature)) {
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
});

// Calcom Request Validator

async function validateRequest(body: string, signature: string | null): Promise<boolean> {
  if (!signature || !env.CALCOM_WEBHOOK_SECRET) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(env.CALCOM_WEBHOOK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return signature === expected;
}
