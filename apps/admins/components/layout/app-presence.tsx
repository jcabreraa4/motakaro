'use client';

import { usePresence } from '@/hooks/use-presence';
import { useAuth } from '@clerk/nextjs';
import { api } from '@workspace/backend/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';

export function AppPresence({ className }: { className?: string }) {
  usePresence();
  const { userId, isLoaded } = useAuth();
  const activeWorkers = useQuery(api.workers.getActive, isLoaded ? {} : 'skip');
  const others = activeWorkers?.filter((w) => w.clerkId !== userId);

  if (!others?.length) return null;

  return (
    <div className={cn('flex -space-x-2 *:ring-2 *:ring-background', className)}>
      {others.map((worker) => (
        <Tooltip key={worker.clerkId}>
          <TooltipTrigger asChild>
            <div className="relative cursor-default">
              <Avatar className="h-8 w-8">
                <AvatarImage src={worker.avatar} />
                <AvatarFallback className="text-xs">{worker.name?.[0]?.toUpperCase() ?? '?'}</AvatarFallback>
              </Avatar>
              <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full border border-background bg-green-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{`${worker.name ?? ''} ${worker.surname ?? ''}`.trim()}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
