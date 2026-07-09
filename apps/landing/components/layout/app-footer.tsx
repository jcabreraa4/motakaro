import Link from 'next/link';

import { Button } from '@workspace/ui/components/button';

import { SectionContent, SectionInner, SectionWrapper } from '@/components/layout/app-section';
import { Branding } from '@/components/motakaro/branding';

export function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <SectionWrapper>
      <SectionInner className="lg:py-5">
        <SectionContent>
          <Branding />
        </SectionContent>
        <SectionContent className="flex flex-col gap-2 md:flex-row md:items-center">
          <p className="text-lg font-semibold">All Rights Reserved © {year} Motakaro</p>
          <span className="hidden text-lg font-semibold md:inline">|</span>
          <Button
            variant="link"
            className="w-fit p-0 text-lg font-semibold"
          >
            <Link href="/privacy">Privacy Policy</Link>
          </Button>
        </SectionContent>
      </SectionInner>
    </SectionWrapper>
  );
}
