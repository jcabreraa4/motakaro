import { api } from '@workspace/backend/_generated/api';

import { runConvex } from '@/server/run-convex';
import { verifyAuth } from '@/server/verify-auth';

export async function getUser() {
  // Check Identity
  await verifyAuth();

  // Obtain Convex
  const { convex } = await runConvex();

  // Return Client
  return await convex.query(api.clients.clientGet);
}
