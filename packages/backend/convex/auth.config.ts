import { AuthConfig } from 'convex/server';

export default {
  providers: [
    {
      domain: process.env.CLERK_ADMINS_JWT_DOMAIN!,
      applicationID: 'convex-admins'
    },
    {
      domain: process.env.CLERK_CLIENTS_JWT_DOMAIN!,
      applicationID: 'convex-clients'
    }
  ]
} satisfies AuthConfig;
