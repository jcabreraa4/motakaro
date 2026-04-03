'use client';

import { useAuth } from '@clerk/nextjs';
import { usePresence } from '@/hooks/use-presence';
import { api } from '@workspace/backend/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';

export function AppPresence({ className }: { className?: string }) {
  usePresence();
  const { userId, isLoaded } = useAuth();
  const activeEmployees = useQuery(api.employees.list, isLoaded ? { filter: 'actives' } : 'skip');
  const others = activeEmployees?.filter((employee) => employee.clerkId !== userId);

  if (!others?.length) return null;

  return (
    <div className={cn('flex gap-2', className)}>
      {others.map((employee) => (
        <Tooltip key={employee.clerkId}>
          <TooltipTrigger asChild>
            <div className="relative cursor-default">
              <Avatar className="border-red h-8 w-8 border-red-500">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback className="text-xs">{employee.name?.[0]?.toUpperCase() ?? '?'}</AvatarFallback>
              </Avatar>
              <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full border border-background bg-green-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{`${employee.name ?? ''} ${employee.surname ?? ''}`.trim()}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
