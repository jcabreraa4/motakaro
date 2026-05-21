import Link from 'next/link';

import { Button } from '@workspace/ui/components/button';
import { ButtonVariant } from '@workspace/ui/types/button';

interface ActionButtonProps {
  variant?: ButtonVariant;
  className?: string;
}

export function ActionButton({ variant = 'motakaro', className }: ActionButtonProps) {
  return (
    <Link href="/contact">
      <Button
        variant={variant}
        className={className}
      >
        Schedule Call
      </Button>
    </Link>
  );
}
