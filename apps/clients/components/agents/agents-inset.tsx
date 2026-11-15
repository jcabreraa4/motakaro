'use client';

import { useEveAgent } from 'eve/react';

import { SidebarInset } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';

import { AgentsHeader } from '@/components/agents/agents-header';
import { AgentsInput } from '@/components/agents/agents-input';
import { AgentsMain } from '@/components/agents/agents-main';
import { useLayout } from '@/hooks/use-layout';

export function AgentsInset() {
  const { agents } = useLayout();

  const agent = useEveAgent({
    baseUrl: process.env.NEXT_PUBLIC_EVE_URL
  });

  return (
    <SidebarInset className={cn('hidden w-full overflow-hidden md:max-w-100 print:hidden', agents && 'xl:flex')}>
      <AgentsHeader />
      <section className="flex flex-1 flex-col gap-3 overflow-hidden py-5">
        <AgentsMain agent={agent} />
        <div className="px-5">
          <AgentsInput agent={agent} />
        </div>
      </section>
    </SidebarInset>
  );
}
