'use client';

import Link from 'next/link';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { GenericLoader } from '@workspace/ui/custom/generic-loader';

export default function Page() {
  const { isLoaded } = useAuth();
  const companies = useQuery(api.companies.list, isLoaded ? {} : 'skip');

  if (!companies) return <GenericLoader />;

  return (
    <main className="flex w-full flex-col gap-2 overflow-hidden p-3 lg:p-5">
      {companies.map((company) => (
        <Link
          key={company._id}
          href={`/companies/${company._id}`}
        >
          <Button variant="outline">{company.name}</Button>
        </Link>
      ))}
    </main>
  );
}
