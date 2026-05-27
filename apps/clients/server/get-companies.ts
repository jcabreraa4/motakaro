import { api } from '@workspace/backend/_generated/api';

import { getConvex } from '@/server/get-convex';
import { verifyAuth } from '@/server/verify-auth';

export async function getCompanies() {
  // Check Identity
  await verifyAuth();

  // Obtain Convex
  const convex = await getConvex();

  // Return Companies
  return await convex.query(api.companies.clientsList);
}
