import type { UseEveAgentReturn } from 'eve/react';
import { SendHorizontalIcon } from 'lucide-react';
import { toast } from 'sonner';

import { useAgents } from '@workspace/agents/hooks/use-agents';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '@workspace/ui/components/input-group';
import { Spinner } from '@workspace/ui/components/spinner';

export function AgentsInput({ agent }: { agent: UseEveAgentReturn }) {
  const { input, setInput } = useAgents();

  const busy = agent.status === 'busy' || agent.status === 'resuming';
  const disabled = busy || !input.trim();

  function handleSubmit() {
    // Check Status
    if (disabled) return;

    // Send Message
    agent.send(input).catch(() => toast.error('An internal error has occurred.'));

    // Clean Input
    setInput('');
  }

  return (
    <InputGroup>
      <InputGroupTextarea
        value={input}
        className="min-h-12"
        placeholder="Write a message..."
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <InputGroupAddon
        align="block-end"
        className="flex justify-between"
      >
        <InputGroupButton
          size="icon-sm"
          variant="default"
          onClick={handleSubmit}
          disabled={disabled}
        >
          {busy ? <Spinner /> : <SendHorizontalIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
