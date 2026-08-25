import { useShallow } from 'zustand/react/shallow';

import { useLayoutStore } from '@/store/layout-store';

export function useLayout() {
  const { agents, setAgents } = useLayoutStore(
    useShallow((state) => ({
      agents: state.agents,
      setAgents: state.setAgents
    }))
  );

  return { agents, setAgents };
}
