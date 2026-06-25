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

interface CompaniesPageProps {
  preloaded: Preloaded<typeof api.organizations.get>;
}

export function CompaniesPage({ preloaded }: CompaniesPageProps) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <GenericLoader />;
  return <CompaniesLoaded preloaded={preloaded} />;
}

export function CompaniesLoaded({ preloaded }: CompaniesPageProps) {
  const { setBreadcrumbs } = useHeader();

  const company = usePreloadedQuery(preloaded);

  useEffect(() => {
    if (company) setBreadcrumbs([{ text: company.name }]);
    return () => setBreadcrumbs([]);
  }, [company, setBreadcrumbs]);

  if (!company) {
    return (
      <section className="flex w-full flex-col items-center justify-center gap-5 p-3 select-none md:p-5">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xl font-semibold">404 Not Found</p>
          <p>The company you are looking for could not be found.</p>
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
    <main className="p-3 md:p-5">
      <p>{company.name}</p>
    </main>
  );
}
