'use client';

import { useAuth } from '@clerk/nextjs';
import { api } from '@workspace/backend/_generated/api';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { useQuery } from 'convex/react';

export default function Page() {
  const { isLoaded } = useAuth();
  const companies = useQuery(api.companies.list, isLoaded ? {} : 'skip');

  if (!companies) return <CircleLoader />;

  return (
    <main className="flex w-full flex-col gap-2 overflow-hidden p-3 lg:p-5">
      {companies?.map((company) => (
        <div key={company._id}>
          Name: {company.name} | Id: {company.clerkId}
        </div>
      ))}
    </main>
  );
}
