'use client';

import Link from 'next/link';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { GenericLoader } from '@workspace/ui/custom/generic-loader';

export default function Page() {
  const { isLoaded } = useAuth();
  const contacts = useQuery(api.contacts.list, isLoaded ? {} : 'skip');

  if (!contacts) return <GenericLoader />;

  return (
    <main className="flex w-full flex-col gap-2 overflow-hidden p-3 lg:p-5">
      {contacts.map((contact) => (
        <Link
          key={contact._id}
          href={`/contacts/${contact._id}`}
        >
          <Button variant="outline">
            {contact.name} {contact.surname}
          </Button>
        </Link>
      ))}
    </main>
  );
}
