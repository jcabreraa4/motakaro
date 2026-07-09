import Link from 'next/link';

import { Button } from '@workspace/ui/components/button';

export function PlaybookLink({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Link href="/playbook">
        <Button variant="blackout">Our Playbook</Button>
      </Link>
    </div>
  );
}
