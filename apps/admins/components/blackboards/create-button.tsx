'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@workspace/ui/components/button';
import { ButtonVariant } from '@workspace/ui/types/button';
import { api } from '@workspace/backend/_generated/api';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation } from 'convex/react';
import { PlusIcon } from 'lucide-react';

interface CreateButtonProps {
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
}

export function CreateButton({ variant, className, disabled }: CreateButtonProps) {
  const router = useRouter();

  const createDocument = useMutation(api.blackboards.create);

  function handleCreate() {
    createDocument({}).then((documentId) => {
      router.push(`/blackboards/${documentId}`);
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
      Create Blackboard
    </Button>
  );
}
