import { FastLink } from '@fast-link/next';

import { Button } from '@workspace/ui/components/button';

import { Paragraph } from '@/components/layout/app-heading';

export function ContactLink({ className }: { className?: string }) {
  return (
    <div className={className}>
      <FastLink href="/contact">
        <Button variant="motakaro">
          <Paragraph>Discovery Call</Paragraph>
        </Button>
      </FastLink>
    </div>
  );
}
