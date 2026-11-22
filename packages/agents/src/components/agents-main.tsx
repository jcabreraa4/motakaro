import type { UseEveAgentReturn } from 'eve/react';

import { AgentsChat } from '@workspace/agents/components/agents-chat';
import { AgentsInput } from '@workspace/agents/components/agents-input';

export function AgentsMain({ agent }: { agent: UseEveAgentReturn }) {
  return (
    <section className="flex flex-1 flex-col gap-3 overflow-hidden bg-red-200 py-5">
      <AgentsChat agent={agent} />
      <div className="px-5">
        <AgentsInput agent={agent} />
      </div>
    </section>
  );
}
