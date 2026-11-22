import { useShallow } from 'zustand/react/shallow';

import { useAgentsStore } from '@workspace/agents/store/agents-store';

export function useAgents() {
  const { open, setOpen, input, setInput } = useAgentsStore(
    useShallow((state) => ({
      open: state.open,
      setOpen: state.setOpen,
      input: state.input,
      setInput: state.setInput
    }))
  );

  return { open, setOpen, input, setInput };
}
