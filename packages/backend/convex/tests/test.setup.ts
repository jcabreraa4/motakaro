/// <reference types="vite/client" />
import { convexTest } from 'convex-test';
import { vi } from 'vitest';

import schema from '../schema';

// Test Environment

export const testEnv = {
  // Clerk
  CLERK_ADMINS_JWT_DOMAIN: 'https://admins.test.clerk.accounts.dev',
  CLERK_ADMINS_WEBHOOK_SECRET: 'whsec_admins_test',
  CLERK_CLIENTS_JWT_DOMAIN: 'https://clients.test.clerk.accounts.dev',
  CLERK_CLIENTS_WEBHOOK_SECRET: 'whsec_clients_test',
  CLERK_CLIENTS_SECRET_KEY: 'sk_test_clients',

  // Calcom
  CALCOM_WEBHOOK_SECRET: 'calcom_test_secret',

  // Resend
  RESEND_API_KEY: 'resend_test_key',

  // Trigger
  TRIGGER_SECRET_KEY: 'trigger_test_key',

  // Cloudflare
  R2_TOKEN: 'r2_test_token',
  R2_ACCESS_KEY_ID: 'r2_test_access_key',
  R2_SECRET_ACCESS_KEY: 'r2_test_secret_key',
  R2_ENDPOINT: 'https://r2.test',
  R2_PUBLIC_BUCKET: 'public-test',
  R2_PUBLIC_DOMAIN: 'https://assets.test',
  R2_PRIVATE_BUCKET: 'private-test'
};

Object.entries(testEnv).forEach(([key, value]) => vi.stubEnv(key, value));

// Test Backend

const modules = import.meta.glob(['../**/*.{ts,js}', '!../tests/**', '!../**/*.d.ts']);

export function createTestBackend() {
  return convexTest({ schema, modules });
}

export type TestBackend = ReturnType<typeof createTestBackend>;

// Test Identities

export function asAdmin(t: TestBackend, subject = 'admin_123') {
  return t.withIdentity({
    issuer: testEnv.CLERK_ADMINS_JWT_DOMAIN,
    subject
  });
}

export function asClient(t: TestBackend, subject = 'client_123', organization = 'org_a') {
  return t.withIdentity({
    issuer: testEnv.CLERK_CLIENTS_JWT_DOMAIN,
    subject,
    org_id: organization
  });
}
