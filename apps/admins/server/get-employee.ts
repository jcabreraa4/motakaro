import { api } from '@workspace/backend/_generated/api';

import { runConvex } from '@/server/run-convex';
import { verifyAuth } from '@/server/verify-auth';

export async function getEmployee() {
  // Check Identity
  await verifyAuth();

  // Obtain Convex
  const { convex } = await runConvex();

  // Return Employee
  return await convex.query(api.employees.get, {});
}
