function getKey(key: string) {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

export const env = {
  // Clerk Admins
  CLERK_ADMINS_JWT_DOMAIN: getKey('CLERK_ADMINS_JWT_DOMAIN'),
  CLERK_ADMINS_WEBHOOK_SECRET: getKey('CLERK_ADMINS_WEBHOOK_SECRET'),

  // Clerk Clients
  CLERK_CLIENTS_JWT_DOMAIN: getKey('CLERK_CLIENTS_JWT_DOMAIN'),
  CLERK_CLIENTS_WEBHOOK_SECRET: getKey('CLERK_CLIENTS_WEBHOOK_SECRET'),
  CLERK_CLIENTS_SECRET_KEY: getKey('CLERK_CLIENTS_SECRET_KEY'),

  // Calcom
  CALCOM_WEBHOOK_SECRET: getKey('CALCOM_WEBHOOK_SECRET')
};
