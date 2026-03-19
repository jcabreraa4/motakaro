'use client';

import { useEffect } from 'react';
import { useAppStateStore } from '@/store/state-store';
import { api } from '@workspace/backend/_generated/api';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { CanvasToolbar } from '@/components/whiteboards/canvas-toolbar';
import type { Whiteboard } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { useCanvas } from '@/hooks/use-canvas';
import { PencilRulerIcon } from 'lucide-react';
import Link from 'next/link';

function CanvasEditor({ whiteboard }: { whiteboard: Whiteboard }) {
  const { mainRef, canvasElRef } = useCanvas(whiteboard);

  return (
    <main
      ref={mainRef}
      className="relative flex min-h-0 flex-1 touch-none overflow-hidden"
    >
      <CanvasToolbar />
      <canvas ref={canvasElRef} />
    </main>
  );
}

export function CanvasMain({ preloadedWhiteboard }: { preloadedWhiteboard: Preloaded<typeof api.whiteboards.get> }) {
  const whiteboard = usePreloadedQuery(preloadedWhiteboard);
  const setSubroute = useAppStateStore((state) => state.setSubroute);

  useEffect(() => {
    if (whiteboard) setSubroute(whiteboard.name);
  }, [whiteboard, setSubroute]);

  if (!whiteboard) {
    return (
      <section className="flex w-full flex-col items-center justify-center gap-5">
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
