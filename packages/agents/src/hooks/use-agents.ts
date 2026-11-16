import { useShallow } from 'zustand/react/shallow';

import { useAgentsStore } from '@workspace/agents/store/layout-store';

export function useAgents() {
  const { agents, setAgents } = useAgentsStore(
    useShallow((state) => ({
      agents: state.agents,
      setAgents: state.setAgents
    }))
  );

  return { agents, setAgents };
}
