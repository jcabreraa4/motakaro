import Link from 'next/link';

import { MotakaroLogo } from '@workspace/ui/components/custom/motakaro-logo';
import { Button } from '@workspace/ui/components/shadcn/button';

import { Paragraph } from '@/components/layout/app-heading';
import { SectionContent, SectionInner, SectionWrapper } from '@/components/layout/app-section';

export function AppFooter() {
  return (
    <SectionWrapper>
      <SectionInner className="lg:py-5">
        <SectionContent>
          <Link href="/">
            <MotakaroLogo />
          </Link>
        </SectionContent>
        <SectionContent className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <Paragraph>All Rights Reserved © {new Date().getFullYear()} Motakaro</Paragraph>
          <Paragraph className="hidden lg:inline">|</Paragraph>
          <Link href="/privacy">
            <Button
              variant="link"
              className="w-fit p-0"
            >
              <Paragraph>Privacy Policy</Paragraph>
            </Button>
          </Link>
        </SectionContent>
      </SectionInner>
    </SectionWrapper>
  );
}
