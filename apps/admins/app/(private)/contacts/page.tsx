'use client';

import Link from 'next/link';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { GenericLoader } from '@workspace/ui/components/custom/generic-loader';

import { InsetSection } from '@/components/layout/inset-section';

export default function Page() {
  const { isLoaded } = useAuth();

  const contacts = useQuery(api.clients.list, isLoaded ? {} : 'skip');

  if (!contacts) return <GenericLoader />;

  return (
    <InsetSection className="flex flex-col gap-3">
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
    </InsetSection>
  );
}
