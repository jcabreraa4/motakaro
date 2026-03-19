'use client';

import { useAuth } from '@clerk/nextjs';
import { api } from '@workspace/backend/_generated/api';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { HeadsetIcon } from 'lucide-react';
import { useQuery } from 'convex/react';

export default function Page() {
  const { isLoaded } = useAuth();
  const meetings = useQuery(api.meetings.list, isLoaded ? {} : 'skip');

  if (!meetings) return <CircleLoader />;

  return (
    <main className="flex w-full flex-col gap-2 overflow-hidden p-3 lg:p-5">
      <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center gap-2 select-none">
        <HeadsetIcon className="size-14" />
        <p className="text-2xl font-semibold">Under Construction</p>
      </div>
      {meetings?.map((meeting) => (
        <p key={meeting._id}>Name: {meeting.name}</p>
      ))}
    </main>
  );
}
