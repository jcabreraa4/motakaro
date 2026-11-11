import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';

import { verifyAuth } from '@/server/verify-auth';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function runConvex() {
  // Verify Identity
  await verifyAuth();

  // Authenticate Convex
  const { getToken } = await auth();
  const token = await getToken({ template: 'convex' });
  if (!token) throw new Error('Unauthorized');
  convex.setAuth(token);

  // Return Convex
  return { convex, token };
}
