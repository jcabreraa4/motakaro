import { describe, expect, test } from 'vitest';

import { api } from '../_generated/api';
import { asAdmin, createTestBackend, testEnv } from './test.setup';

// Webhook Helpers

async function signCalcomPayload(body: string) {
  // Create Key
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(testEnv.CALCOM_WEBHOOK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);

  // Create Signature
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(body));

  // Return Signature
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

// Webhook Tests

describe('Convex webhooks', () => {
  test('rejects a Cal.com request with an invalid signature', async () => {
    // Create Backend
    const t = createTestBackend();

    // Send Webhook
    const response = await t.fetch('/calcom-sync', {
      method: 'POST',
      headers: { 'X-Cal-Signature-256': 'invalid' },
      body: JSON.stringify({ triggerEvent: 'BOOKING_CREATED', payload: {} })
    });

    // Verify Response
    expect(response.status).toBe(401);
    await expect(response.text()).resolves.toBe('Invalid signature');
  });

  test('creates a meeting from a signed Cal.com booking event', async () => {
    // Create Backend
    const t = createTestBackend();

    // Create Payload
    const body = JSON.stringify({
      triggerEvent: 'BOOKING_CREATED',
      payload: {
        uid: 'booking_123',
        title: 'Discovery call',
        startTime: '2026-09-15T10:00:00.000Z',
        endTime: '2026-09-15T10:30:00.000Z',
        videoCallData: { url: 'https://meet.example.com/booking-123' },
        organizer: { email: 'admin@example.com' },
        attendees: [{ email: 'client@example.com' }],
        responses: {
          notes: { value: 'Discuss project goals' },
          website: { value: 'https://client.example.com' },
          attribution: { value: 'Referral' }
        }
      }
    });

    // Send Webhook
    const response = await t.fetch('/calcom-sync', {
      method: 'POST',
      headers: { 'X-Cal-Signature-256': await signCalcomPayload(body) },
      body
    });

    // Verify Response
    expect(response.status).toBe(200);

    // Verify Meeting
    await expect(asAdmin(t).query(api.meetings.get, { calcomId: 'booking_123' })).resolves.toMatchObject({
      name: 'Discovery call',
      link: 'https://meet.example.com/booking-123',
      organizer: 'admin@example.com',
      attendees: ['client@example.com'],
      status: 'scheduled',
      note: 'Discuss project goals'
    });
  });

  test.each(['/clerk-admins', '/clerk-clients'])('rejects %s requests without Svix headers', async (path) => {
    // Create Backend
    const t = createTestBackend();

    // Send Webhook
    const response = await t.fetch(path, {
      method: 'POST',
      body: JSON.stringify({ type: 'user.created', data: {} })
    });

    // Verify Response
    expect(response.status).toBe(400);
  });
});
