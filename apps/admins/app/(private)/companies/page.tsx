'use client';

import Link from 'next/link';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { GenericLoader } from '@workspace/ui/components/custom/generic-loader';

import { AppSection } from '@/components/layout/app-section';

export default function Page() {
  const { isLoaded } = useAuth();

  const organizations = useQuery(api.organizations.list, isLoaded ? {} : 'skip');

  if (!organizations) return <GenericLoader />;

  return (
    <AppSection className="flex flex-col gap-3">
      {organizations.map((organization) => (
        <Link
          key={organization._id}
          href={`/companies/${organization._id}`}
        >
          <Button variant="outline">{organization.name}</Button>
        </Link>
      ))}
    </AppSection>
  );
}
