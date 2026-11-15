'use client';

import { useEveAgent } from 'eve/react';

import { AgentsInput } from '@/components/agents/agents-input';
import { AgentsMessages } from '@/components/agents/agents-messages';

export function AgentsMain() {
  const agent = useEveAgent({
    baseUrl: process.env.NEXT_PUBLIC_EVE_URL
  });

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Messages */}
      {agent.messages.length === 0 ? (
        <div className="flex min-h-48 flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">No messages yet. Start a conversation.</p>
        </div>
      ) : (
        <AgentsMessages
          status={agent.status}
          messages={agent.messages}
        />
      )}

      {/* Input */}
      <AgentsInput
        status={agent.status}
        send={agent.send}
      />
    </div>
  );
}
