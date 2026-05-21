import Link from 'next/link';

import { Button } from '@workspace/ui/components/button';
import { ButtonVariant } from '@workspace/ui/types/button';

interface PlaybookButtonProps {
  variant?: ButtonVariant;
  className?: string;
}

export function PlaybookButton({ variant = 'black', className }: PlaybookButtonProps) {
  return (
    <Link href="/playbook">
      <Button
        variant={variant}
        className={className}
      >
        Our Playbook
      </Button>
    </Link>
  );
}
