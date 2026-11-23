'use client';

import { useEveAgent } from 'eve/react';

import { AgentsMain } from '@workspace/agents/components/agents-main';

const baseUrl = process.env.NEXT_PUBLIC_EVE_URL!;

export function AgentsInset() {
  const agent = useEveAgent({ baseUrl });

  return <AgentsMain agent={agent} />;
}
