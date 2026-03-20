'use client';

import { useAuth } from '@clerk/nextjs';
import { api } from '@workspace/backend/_generated/api';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { useQuery } from 'convex/react';
import { Building2Icon } from 'lucide-react';

export default function Page() {
  const { isLoaded } = useAuth();
  const companies = useQuery(api.companies.list, isLoaded ? {} : 'skip');

  if (!companies) return <CircleLoader />;

  return (
    <main className="flex w-full flex-col gap-2 overflow-hidden p-3 lg:p-5">
      <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center gap-2 select-none">
        <Building2Icon className="size-14" />
        <p className="text-2xl font-semibold">Under Construction</p>
      </div>
    </main>
  );
}
