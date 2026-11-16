'use client';

import { useAgents } from '@workspace/agents/hooks/use-agents';
import { SidebarInset } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';

import { AgentsHeader } from '@/components/agents/agents-header';
import { InsetSection } from '@/components/layout/inset-section';

export function AgentsInset() {
  const { agents } = useAgents();

  return (
    <SidebarInset className={cn('hidden w-full overflow-hidden md:max-w-100 print:hidden', agents && 'xl:flex')}>
      <AgentsHeader />
      <InsetSection>
        <div className="h-full"></div>
      </InsetSection>
    </SidebarInset>
  );
}
