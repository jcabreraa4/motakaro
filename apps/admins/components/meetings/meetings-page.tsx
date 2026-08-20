'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { HeadsetIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { EmptySection } from '@workspace/ui/components/custom/empty-section';
import { GenericLoader } from '@workspace/ui/components/custom/generic-loader';

import { AppSection } from '@/components/layout/app-section';
import { useHeader } from '@/hooks/use-header';

interface MeetingsPageProps {
  preloaded: Preloaded<typeof api.meetings.get>;
}

export function MeetingsPage({ preloaded }: MeetingsPageProps) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <GenericLoader />;
  return <MeetingsLoaded preloaded={preloaded} />;
}

function MeetingsLoaded({ preloaded }: MeetingsPageProps) {
  const { setBreadcrumbs } = useHeader();

  const meeting = usePreloadedQuery(preloaded);

  useEffect(() => {
    if (meeting) setBreadcrumbs([{ text: meeting.name || 'Untitled Meeting' }]);
    else setBreadcrumbs([{ text: '404 Not Found' }]);
    return () => setBreadcrumbs([]);
  }, [meeting, setBreadcrumbs]);

  if (!meeting) {
    return (
      <AppSection>
        <EmptySection
          icon={HeadsetIcon}
          title="404 Not Found"
          description="The meeting record could not be found."
        >
          <Link href="/meetings">
            <Button>
              <HeadsetIcon />
              Check Meetings
            </Button>
          </Link>
        </EmptySection>
      </AppSection>
    );
  }

  return (
    <AppSection className="flex flex-col">
      <h1 className="text-2xl font-semibold">{meeting.name}</h1>
      <p>{meeting.note}</p>
      <p>{meeting.link}</p>
      <p>{meeting.start}</p>
      <p>{meeting.end}</p>
      <p>{meeting.organizer}</p>
      <p>{meeting.website}</p>
      <p>{meeting.attribution}</p>
    </AppSection>
  );
}
