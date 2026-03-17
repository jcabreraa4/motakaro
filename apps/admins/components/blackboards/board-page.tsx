'use client';

import { useEffect } from 'react';
import { api } from '@workspace/backend/_generated/api';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { Button } from '@workspace/ui/components/button';
import { useAppStateStore } from '@/store/state-store';
import { PencilRulerIcon } from 'lucide-react';
import { Canvas } from './canvas';
import Link from 'next/link';

export default function BoardPage({ preloadedBlackboard }: { preloadedBlackboard: Preloaded<typeof api.blackboards.get> }) {
  const board = usePreloadedQuery(preloadedBlackboard);
  const setSubroute = useAppStateStore((state) => state.setSubroute);

  useEffect(() => {
    if (board) setSubroute(board.name);
  }, [board, setSubroute]);

  if (!board) {
    return (
      <section className="flex w-full flex-col items-center justify-center gap-5">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xl font-semibold">404 Not Found</p>
          <p>The blackboard you are looking for could not be found.</p>
        </div>
        <Link href="/blackboards">
          <Button className="cursor-pointer">
            <PencilRulerIcon />
            Check Blackboards
          </Button>
        </Link>
      </section>
    );
  }

  return <Canvas />;
}
