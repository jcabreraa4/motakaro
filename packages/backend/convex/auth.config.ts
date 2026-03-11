import { AuthConfig } from 'convex/server';

export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ADMINS_DOMAIN!,
      applicationID: 'convex-admins'
    },
    {
      domain: process.env.CLERK_JWT_CLIENTS_DOMAIN!,
      applicationID: 'convex-clients'
    }
  ]
} satisfies AuthConfig;
