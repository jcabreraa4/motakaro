import Link from 'next/link';

import { Button } from '@workspace/ui/components/button';

import { Paragraph } from '@/components/layout/app-heading';

export function ContactLink({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Link href="/contact">
        <Button variant="motakaro">
          <Paragraph>Discovery Call</Paragraph>
        </Button>
      </Link>
    </div>
  );
}
