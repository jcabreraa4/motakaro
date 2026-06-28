import { auth } from '@clerk/nextjs/server';

export async function verifyAuth() {
  // Verify Identity
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // Return Identity
  return { userId };
}
