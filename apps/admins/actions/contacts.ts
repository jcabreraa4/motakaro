'use server';

import { createClerkClient } from '@clerk/nextjs/server';

const client = createClerkClient({
  secretKey: process.env.CLERK_CLIENTS_APP_SECRET_KEY!
});

export async function getContacts() {
  const { data: users } = await client.users.getUserList({ limit: 500 });
  return users.map((user) => ({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.emailAddresses[0]?.emailAddress,
    avatar: user.imageUrl
  }));
}
