import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';

import { verifyAuth } from '@/server/verify-auth';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getConvex() {
  // Check Identity
  await verifyAuth();

  // Obtain Token
  const { getToken } = await auth();
  const token = await getToken({ template: 'convex' });

  // Authenticate Convex
  convex.setAuth(token!);
  return convex;
}
