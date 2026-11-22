'use client';

import { useEveAgent } from 'eve/react';
import type { UseEveAgentReturn } from 'eve/react';

import { AgentsHeader } from '@workspace/agents/components/agents-header';
import { AgentsMain } from '@workspace/agents/components/agents-main';
import { useAgents } from '@workspace/agents/hooks/use-agents';
import { Sheet, SheetContent } from '@workspace/ui/components/sheet';
import { SidebarInset } from '@workspace/ui/components/sidebar';
import { useIsMobile } from '@workspace/ui/hooks/use-mobile';
import { cn } from '@workspace/ui/lib/utils';

const baseUrl = process.env.NEXT_PUBLIC_EVE_URL!;

function MobileAgents({ agent }: { agent: UseEveAgentReturn }) {
  const { open, setOpen } = useAgents();

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetContent showCloseButton={false}>
        <AgentsHeader />
        <AgentsMain agent={agent} />
      </SheetContent>
    </Sheet>
  );
}

function DesktopAgents({ agent }: { agent: UseEveAgentReturn }) {
  const { open } = useAgents();

  return (
    <SidebarInset className={cn('w-full overflow-hidden md:max-w-100 print:hidden', open ? 'md:flex' : 'hidden')}>
      <AgentsHeader />
      <AgentsMain agent={agent} />
    </SidebarInset>
  );
}

export function AgentsInset() {
  const mobile = useIsMobile();
  const agent = useEveAgent({ baseUrl });

  return mobile ? <MobileAgents agent={agent} /> : <DesktopAgents agent={agent} />;
}
