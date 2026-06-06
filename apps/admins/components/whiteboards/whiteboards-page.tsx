'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { PencilRulerIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import type { Whiteboard } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { GenericLoader } from '@workspace/ui/custom/generic-loader';

import { WhiteboardsToolbar } from '@/components/whiteboards/whiteboards-toolbar';
import { useCanvas } from '@/hooks/use-canvas';
import { useHeader } from '@/hooks/use-header';

interface WhiteboardsPageProps {
  preloaded: Preloaded<typeof api.whiteboards.get>;
}

export function WhiteboardsPage({ preloaded }: WhiteboardsPageProps) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <GenericLoader />;
  return <CanvasMainInner preloaded={preloaded} />;
}

function CanvasMainInner({ preloaded }: WhiteboardsPageProps) {
  const { setSubroute } = useHeader();

  const whiteboard = usePreloadedQuery(preloaded);

  useEffect(() => {
    if (whiteboard) setSubroute(whiteboard.name);
  }, [whiteboard, setSubroute]);

  if (!whiteboard) {
    return (
      <section className="flex w-full flex-col items-center justify-center gap-5 select-none">
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

  return <CanvasEditor whiteboard={whiteboard} />;
}

function CanvasEditor({ whiteboard }: { whiteboard: Whiteboard }) {
  const { mainRef, canvasElRef } = useCanvas(whiteboard);

  return (
    <main
      ref={mainRef}
      className="relative flex min-h-0 flex-1 touch-none overflow-hidden"
    >
      <WhiteboardsToolbar />
      <canvas ref={canvasElRef} />
    </main>
  );
}
