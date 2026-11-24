import type { UseEveAgentReturn } from 'eve/react';
import { XIcon } from 'lucide-react';

import { AgentsChat } from '@workspace/agents/components/agents-chat';
import { AgentsInput } from '@workspace/agents/components/agents-input';
import { useAgents } from '@workspace/agents/hooks/use-agents';
import { Button } from '@workspace/ui/components/button';
import { Sheet, SheetContent } from '@workspace/ui/components/sheet';
import { SidebarInset } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';

function AgentsHeader({ className }: { className?: string }) {
  const { setOpen } = useAgents();

  return (
    <header className={cn('flex h-12 shrink-0 items-center justify-between border-b bg-sidebar px-3 md:h-16 md:bg-transparent md:px-4', className)}>
      <p className="text-sm font-medium select-none">Ghost Agents</p>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={() => setOpen(false)}
      >
        <XIcon className="size-5" />
      </Button>
    </header>
  );
}

function AgentsSection({ agent }: { agent: UseEveAgentReturn }) {
  return (
    <section className="flex flex-1 flex-col gap-3 overflow-hidden py-5">
      <AgentsChat agent={agent} />
      <div className="px-5">
        <AgentsInput agent={agent} />
      </div>
    </section>
  );
}

function AgentsMobile({ agent }: { agent: UseEveAgentReturn }) {
  const { open, setOpen } = useAgents();

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetContent
        showCloseButton={false}
        className="w-full min-w-full"
      >
        <div className="flex flex-1 bg-sidebar md:p-2">
          <div className="flex flex-1 flex-col rounded-xl bg-background shadow-sm">
            <AgentsHeader />
            <AgentsSection agent={agent} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function AgentsDesktop({ agent }: { agent: UseEveAgentReturn }) {
  const { open } = useAgents();

  return (
    <SidebarInset className={cn('w-full max-w-100 min-w-100 overflow-hidden print:hidden', open ? 'md:flex' : 'hidden')}>
      <AgentsHeader />
      <AgentsSection agent={agent} />
    </SidebarInset>
  );
}

export function AgentsMain({ agent }: { agent: UseEveAgentReturn }) {
  const { isMobile } = useAgents();

  return isMobile ? <AgentsMobile agent={agent} /> : <AgentsDesktop agent={agent} />;
}
