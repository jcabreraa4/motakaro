'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { HeadsetIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { GenericLoader } from '@workspace/ui/custom/generic-loader';

import { useHeader } from '@/hooks/use-header';

interface MeetingsPageProps {
  preloaded: Preloaded<typeof api.meetings.get>;
}

export function MeetingsPage({ preloaded }: MeetingsPageProps) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <GenericLoader />;
  return <MeetingsPageInner preloaded={preloaded} />;
}

function MeetingsPageInner({ preloaded }: MeetingsPageProps) {
  const { setBreadcrumbs } = useHeader();

  const meeting = usePreloadedQuery(preloaded);

  useEffect(() => {
    if (meeting) setBreadcrumbs([{ text: meeting.name }]);
    return () => setBreadcrumbs([]);
  }, [meeting, setBreadcrumbs]);

  if (!meeting) {
    return (
      <main className="flex w-full flex-col items-center justify-center gap-5 select-none">
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
        <p>{meeting.link}</p>
        <p>{meeting.start}</p>
        <p>{meeting.end}</p>
        <p>{meeting.organizer}</p>
        <p>{meeting.website}</p>
        <p>{meeting.attribution}</p>
      </section>
    </main>
  );
}
