'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { PencilRulerIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { EmptySection } from '@workspace/ui/components/custom/empty-section';
import { GenericLoader } from '@workspace/ui/components/custom/generic-loader';

import { AppSection } from '@/components/layout/app-section';
import { WhiteboardsCanvas } from '@/components/whiteboards/whiteboards-canvas';
import { useHeader } from '@/hooks/use-header';

interface WhiteboardsPageProps {
  preloaded: Preloaded<typeof api.whiteboards.get>;
}

export function WhiteboardsPage({ preloaded }: WhiteboardsPageProps) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <GenericLoader />;
  return <WhiteboardsLoaded preloaded={preloaded} />;
}

function WhiteboardsLoaded({ preloaded }: WhiteboardsPageProps) {
  const { setBreadcrumbs } = useHeader();

  const whiteboard = usePreloadedQuery(preloaded);

  useEffect(() => {
    if (whiteboard) setBreadcrumbs([{ text: whiteboard.name || 'Untitled Whiteboard' }]);
    else setBreadcrumbs([{ text: '404 Not Found' }]);
    return () => setBreadcrumbs([]);
  }, [whiteboard, setBreadcrumbs]);

  if (!whiteboard) {
    return (
      <AppSection>
        <EmptySection
          icon={PencilRulerIcon}
          title="404 Not Found"
          description="The whiteboard record could not be found."
        >
          <Link href="/whiteboards">
            <Button className="cursor-pointer">
              <PencilRulerIcon />
              Check Whiteboards
            </Button>
          </Link>
        </EmptySection>
      </AppSection>
    );
  }

  return (
    <main className="relative isolate w-full">
      <WhiteboardsCanvas whiteboard={whiteboard} />
    </main>
  );
}
