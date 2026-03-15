'use client';

import { useAuth } from '@clerk/nextjs';
import { api } from '@workspace/backend/_generated/api';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { useQuery } from 'convex/react';

export default function Page() {
  const { isLoaded } = useAuth();
  const contacts = useQuery(api.contacts.list, isLoaded ? {} : 'skip');

  if (!contacts) return <CircleLoader />;

  return (
    <main className="flex w-full flex-col gap-2 overflow-hidden p-4 lg:p-5">
      {contacts?.map((contact) => (
        <div key={contact._id}>
          Name: {contact.name} {contact.surname} | Id: {contact.clerkId}
        </div>
      ))}
    </main>
  );
}
