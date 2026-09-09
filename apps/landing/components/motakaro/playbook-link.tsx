import Link from 'next/link';

import { Button } from '@workspace/ui/components/shadcn/button';

import { Paragraph } from '@/components/layout/app-heading';

export function PlaybookLink({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Link href="/playbook">
        <Button variant="blackout">
          <Paragraph>Our Playbook</Paragraph>
        </Button>
      </Link>
    </div>
  );
}
