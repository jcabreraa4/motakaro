import { auth } from '@clerk/nextjs/server';

export async function verifyAuth() {
  // Check Identity
  const { userId, orgId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // Return Identity
  return { userId, orgId };
}
