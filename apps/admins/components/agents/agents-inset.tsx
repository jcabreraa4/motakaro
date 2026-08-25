'use client';

import { SidebarInset } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';

import { AgentsHeader } from '@/components/agents/agents-header';
import { InsetSection } from '@/components/layout/inset-section';
import { useLayout } from '@/hooks/use-layout';

export function AgentsInset() {
  const { agents } = useLayout();

  return (
    <SidebarInset className={cn('hidden w-full overflow-hidden md:max-w-100 print:hidden', agents && 'xl:flex')}>
      <AgentsHeader />
      <InsetSection>
        <div className="h-full bg-yellow-100"></div>
      </InsetSection>
    </SidebarInset>
  );
}
