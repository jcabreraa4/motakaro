'use client';

import { useAuth } from '@clerk/nextjs';
import { api } from '@workspace/backend/_generated/api';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { useQuery } from 'convex/react';

export default function Page() {
  const { isLoaded } = useAuth();
  const meetings = useQuery(api.meetings.list, isLoaded ? {} : 'skip');

  if (!meetings) return <CircleLoader />;

  return (
    <main className="flex w-full flex-col gap-2 overflow-hidden p-3 lg:p-5">
      {meetings?.map((meeting) => (
        <div key={meeting._id}>
          Name: {meeting.name} | Id: {meeting.calcomId}
        </div>
      ))}
    </main>
  );
}
