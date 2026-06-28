import { api } from '@workspace/backend/_generated/api';

import { runConvex } from '@/server/run-convex';
import { verifyAuth } from '@/server/verify-auth';

export async function getUser() {
  // Verify Identity
  await verifyAuth();

  // Obtain Convex
  const { convex } = await runConvex();

  // Return Admin
  return await convex.query(api.admins.get, {});
}
