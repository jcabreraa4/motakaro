import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getConvex() {
  // Obtain Token
  const { getToken } = await auth();
  const token = await getToken({ template: 'convex' });

  // Authenticate Convex
  convex.setAuth(token!);
  return convex;
}
