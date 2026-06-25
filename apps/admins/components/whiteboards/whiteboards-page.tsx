'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { PencilRulerIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { GenericLoader } from '@workspace/ui/custom/generic-loader';

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
    return () => setBreadcrumbs([]);
  }, [whiteboard, setBreadcrumbs]);

  if (!whiteboard) {
    return (
      <section className="flex w-full flex-col items-center justify-center gap-5 p-3 select-none md:p-5">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xl font-semibold">404 Not Found</p>
          <p>The whiteboard you are looking for could not be found.</p>
        </div>
        <Link href="/whiteboards">
          <Button className="cursor-pointer">
            <PencilRulerIcon />
            Check Whiteboards
          </Button>
        </Link>
      </section>
    );
  }

  return (
    <main className="relative isolate w-full">
      <WhiteboardsCanvas whiteboard={whiteboard} />
    </main>
  );
}
