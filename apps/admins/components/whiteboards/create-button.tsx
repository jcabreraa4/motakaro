import { ButtonVariant } from '@workspace/ui/types/button';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { cn } from '@workspace/ui/lib/utils';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { PlusIcon } from 'lucide-react';

interface CreateButtonProps {
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
}

export function CreateButton({ variant, className, disabled }: CreateButtonProps) {
  const router = useRouter();

  const createWhiteboard = useMutation(api.whiteboards.create);

  function handleCreate() {
    createWhiteboard({}).then((whiteboardId) => {
      router.push(`/whiteboards/${whiteboardId}`);
    });
  }

  return (
    <Button
      variant={variant}
      className={cn('cursor-pointer', className)}
      onClick={handleCreate}
      disabled={disabled}
    >
      <PlusIcon />
      Create Whiteboard
    </Button>
  );
}
