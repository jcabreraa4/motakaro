import { XIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

import { useLayout } from '@/hooks/use-layout';

export function AgentsHeader() {
  const { setAgents } = useLayout();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b bg-sidebar px-4 md:h-16 md:bg-transparent">
      <p className="text-sm font-medium">Ghost Agents</p>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={() => setAgents(false)}
      >
        <XIcon className="size-5" />
      </Button>
    </header>
  );
}
