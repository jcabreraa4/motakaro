import { XIcon } from 'lucide-react';

import { useAgents } from '@workspace/agents/hooks/use-agents';
import { Button } from '@workspace/ui/components/button';

export function AgentsHeader() {
  const { setOpen } = useAgents();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b bg-sidebar px-4 md:h-16 md:bg-transparent">
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
