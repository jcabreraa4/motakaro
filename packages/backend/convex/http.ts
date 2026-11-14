import { httpRouter } from 'convex/server';

import { calcomSync } from './endpoints/calcom';
import { clerkAdmins, clerkClients } from './endpoints/clerk';

const http = httpRouter();

// Clerk Endpoints

http.route({
  path: '/clerk-admins',
  method: 'POST',
  handler: clerkAdmins
});

http.route({
  path: '/clerk-clients',
  method: 'POST',
  handler: clerkClients
});

// Calcom Endpoints

http.route({
  path: '/calcom-sync',
  method: 'POST',
  handler: calcomSync
});

// Default Export

export default http;
