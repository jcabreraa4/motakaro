import { ConvexError } from 'convex/values';

function getKey(key: string) {
  const keyValue = process.env[key];
  if (!keyValue) throw new ConvexError(`Missing environment variable: ${key}`);
  return keyValue;
}

export const env = {
  // Clerk Admins
  CLERK_ADMINS_JWT_DOMAIN: getKey('CLERK_ADMINS_JWT_DOMAIN'),
  CLERK_ADMINS_WEBHOOK_SECRET: getKey('CLERK_ADMINS_WEBHOOK_SECRET'),

  // Clerk Clients
  CLERK_CLIENTS_JWT_DOMAIN: getKey('CLERK_CLIENTS_JWT_DOMAIN'),
  CLERK_CLIENTS_WEBHOOK_SECRET: getKey('CLERK_CLIENTS_WEBHOOK_SECRET'),
  CLERK_CLIENTS_SECRET_KEY: getKey('CLERK_CLIENTS_SECRET_KEY'),

  // Calcom Keys
  CALCOM_WEBHOOK_SECRET: getKey('CALCOM_WEBHOOK_SECRET'),

  // Cloudflare Keys
  R2_TOKEN: getKey('R2_TOKEN'),
  R2_ACCESS_KEY_ID: getKey('R2_ACCESS_KEY_ID'),
  R2_SECRET_ACCESS_KEY: getKey('R2_SECRET_ACCESS_KEY'),
  R2_ENDPOINT: getKey('R2_ENDPOINT'),
  R2_BUCKET: getKey('R2_BUCKET')
};
