import Link from 'next/link';

import { Button } from '@workspace/ui/components/button';

export function ContactLink({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Link href="/contact">
        <Button variant="motakaro">Discovery Call</Button>
      </Link>
    </div>
  );
}
