import { api } from '@workspace/backend/_generated/api';

import { getConvex } from '@/server/get-convex';
import { verifyAuth } from '@/server/verify-auth';

export async function getContact() {
  // Check Identity
  await verifyAuth();

  // Obtain Convex
  const convex = await getConvex();

  // Return Contact
  return await convex.query(api.contacts.clientGet);
}
