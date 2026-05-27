import { auth } from '@clerk/nextjs/server';

export async function verifyAuth() {
  // Check Identity
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // Return Identity
  return { userId };
}
