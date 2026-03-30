'use client';

import { useEffect } from 'react';
import { api } from '@workspace/backend/_generated/api';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { Button } from '@workspace/ui/components/button';
import { useAppStateStore } from '@/store/state-store';
import { HeadsetIcon } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

interface MeetingPageProps {
  preloadedMeeting: Preloaded<typeof api.meetings.get>;
}

export function MeetingPage({ preloadedMeeting }: MeetingPageProps) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <CircleLoader />;
  return <MeetingPageInner preloadedMeeting={preloadedMeeting} />;
}

function MeetingPageInner({ preloadedMeeting }: MeetingPageProps) {
  const meeting = usePreloadedQuery(preloadedMeeting);
  const setSubroute = useAppStateStore((state) => state.setSubroute);

  useEffect(() => {
    if (meeting) setSubroute(meeting.name);
  }, [meeting, setSubroute]);

  if (!meeting) {
    return (
      <main className="flex w-full flex-col items-center justify-center gap-5">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xl font-semibold">404 Not Found</p>
          <p>The meeting you are looking for could not be found.</p>
        </div>
        <Link href="/meetings">
          <Button className="cursor-pointer">
            <HeadsetIcon />
            Check Meetings
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="flex w-full flex-1 justify-center p-3 lg:p-5">
      <section className="flex w-full max-w-5xl flex-col justify-center gap-6 md:px-5">
        <h1 className="text-3xl font-semibold">{meeting.name}</h1>
        <p>{meeting.note}</p>
      </section>
    </main>
  );
}
