'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { UsersIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { EmptySection } from '@workspace/ui/components/custom/empty-section';
import { GenericLoader } from '@workspace/ui/components/custom/generic-loader';

import { AppSection } from '@/components/layout/app-section';
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
    else setBreadcrumbs([{ text: '404 Not Found' }]);
    return () => setBreadcrumbs([]);
  }, [contact, setBreadcrumbs]);

  if (!contact) {
    return (
      <AppSection>
        <EmptySection
          icon={UsersIcon}
          title="404 Not Found"
          description="The contact record could not be found."
        >
          <Link href="/contacts">
            <Button>
              <UsersIcon />
              Check Contacts
            </Button>
          </Link>
        </EmptySection>
      </AppSection>
    );
  }

  return (
    <AppSection>
      <p>
        {contact.name} {contact.surname}
      </p>
    </AppSection>
  );
}
