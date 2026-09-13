import { describe, expect, test } from 'vitest';

import { api, internal } from '../_generated/api';
import { asAdmin, asClient, createTestBackend } from './test.setup';

// Authorization Tests

describe('Convex authorization', () => {
  test('rejects unauthenticated access to admin queries', async () => {
    // Create Backend
    const t = createTestBackend();

    // Verify Access
    await expect(t.query(api.admins.get, {})).rejects.toThrow('Unauthorized');
  });

  test('returns the authenticated admin', async () => {
    // Create Backend
    const t = createTestBackend();

    // Create Admin
    await t.mutation(internal.admins.internalUpsert, {
      clerkId: 'admin_123',
      email: 'admin@example.com',
      name: 'Ada',
      surname: 'Lovelace',
      avatar: 'https://example.com/admin.png'
    });

    // Verify Admin
    await expect(asAdmin(t).query(api.admins.get, {})).resolves.toMatchObject({
      clerkId: 'admin_123',
      email: 'admin@example.com',
      name: 'Ada',
      surname: 'Lovelace'
    });
  });

  test('does not expose a client through an admin identity', async () => {
    // Create Backend
    const t = createTestBackend();

    // Create Client
    await t.mutation(internal.clients.internalUpsert, {
      clerkId: 'client_123',
      email: 'client@example.com',
      name: 'Grace',
      surname: 'Hopper',
      avatar: 'https://example.com/client.png'
    });

    // Obtain Identities
    const withAdminIssuer = asAdmin(t, 'client_123');
    const withClientIssuer = asClient(t);

    // Verify Client
    await expect(withAdminIssuer.query(api.clients.clientGet, {})).resolves.toBeNull();
    await expect(withClientIssuer.query(api.clients.clientGet, {})).resolves.toMatchObject({
      clerkId: 'client_123',
      email: 'client@example.com'
    });
  });
});
