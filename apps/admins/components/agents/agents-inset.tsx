'use client';

import { AgentsHeader } from '@workspace/agents/components/agents-header';
import { useAgents } from '@workspace/agents/hooks/use-agents';
import { SidebarInset } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';

import { InsetSection } from '@/components/layout/inset-section';

export function AgentsInset() {
  const { open } = useAgents();

  return (
    <SidebarInset className={cn('hidden w-full overflow-hidden md:max-w-100 print:hidden', open && 'xl:flex')}>
      <AgentsHeader />
      <InsetSection>
        <div className="h-full"></div>
      </InsetSection>
    </SidebarInset>
  );
}
