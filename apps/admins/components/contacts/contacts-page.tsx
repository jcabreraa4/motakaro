'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { UserIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { GenericLoader } from '@workspace/ui/custom/generic-loader';

import { useHeader } from '@/hooks/use-header';

interface ContactsPageProps {
  preloaded: Preloaded<typeof api.clients.get>;
}

export function ContactsPage({ preloaded }: ContactsPageProps) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <GenericLoader />;
  return <ContactsLoaded preloaded={preloaded} />;
}

export function ContactsLoaded({ preloaded }: ContactsPageProps) {
  const { setBreadcrumbs } = useHeader();

  const contact = usePreloadedQuery(preloaded);

  useEffect(() => {
    if (contact) setBreadcrumbs([{ text: `${contact.name} ${contact.surname}` }]);
    return () => setBreadcrumbs([]);
  }, [contact, setBreadcrumbs]);

  if (!contact) {
    return (
      <section className="flex w-full flex-col items-center justify-center gap-5 select-none">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xl font-semibold">404 Not Found</p>
          <p>The document you are looking for could not be found.</p>
        </div>
        <Link href="/contacts">
          <Button className="cursor-pointer">
            <UserIcon />
            Check Documents
          </Button>
        </Link>
      </section>
    );
  }

  return (
    <main>
      <section>
        <p>
          {contact.name} {contact.surname}
        </p>
      </section>
    </main>
  );
}
