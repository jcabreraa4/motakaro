import { useShallow } from 'zustand/react/shallow';

import { useAgentsStore } from '@workspace/agents/store/agents-store';
import { useScreen } from '@workspace/ui/hooks/use-screen';

export function useAgents() {
  const screen = useScreen();

  const isMobile = screen !== 'xl' && screen !== '2xl';

  const { open, setOpen, input, setInput } = useAgentsStore(
    useShallow((state) => ({
      open: state.open,
      setOpen: state.setOpen,
      input: state.input,
      setInput: state.setInput
    }))
  );

  return { isMobile, open, setOpen, input, setInput };
}
