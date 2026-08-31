import Image from 'next/image';

import { Heading1, Heading2, Heading3 } from '@/components/layout/app-heading';
import { SectionContent, SectionInner, SectionWrapper } from '@/components/layout/app-section';
import { ContactLink } from '@/components/motakaro/contact-link';
import { PlaybookLink } from '@/components/motakaro/playbook-link';
import { VelocityScroll } from '@/components/ui/velocity-scroll';

const video = process.env.NEXT_PUBLIC_VIDEO_URL!;

const industries = ['DataOps', 'B2B Consulting', 'Fintech', 'Cyber Security', 'RevOps', 'MarTech', 'FinOps', 'Enterprise IT'];

export function MainHeader() {
  return (
    <SectionWrapper>
      <SectionInner>
        <SectionContent className="flex flex-col gap-5 lg:flex-row">
          <div className="flex w-full flex-col justify-center gap-6 lg:gap-8">
            <Heading1 className="uppercase">B2B Revenue Systems through Hybrid Demand</Heading1>
            <Heading3>Powered by a GTM strategy based on targeted LinkedIn ads, generating ICP buying intent signals and triggering automated outbound sequences.</Heading3>
            <div className="flex gap-6">
              <ContactLink />
              <PlaybookLink />
            </div>
          </div>
          <div className="flex aspect-video w-full items-center justify-center overflow-hidden">
            {video ? (
              <video
                controls
                src={video}
                preload="metadata"
                poster="/header.webp"
                className="aspect-video w-full cursor-pointer rounded-lg object-cover"
              />
            ) : (
              <Image
                width={500}
                height={500}
                src="/header.webp"
                alt="Header Image"
                className="pointer-events-none aspect-video w-full rounded-lg border object-cover select-none"
              />
            )}
          </div>
        </SectionContent>
        <VelocityScroll>
          {industries.map((industry, index) => (
            <Heading2
              key={index}
              className="mx-2 cursor-default uppercase transition select-none hover:text-motakaro"
            >
              {industry}
            </Heading2>
          ))}
        </VelocityScroll>
      </SectionInner>
    </SectionWrapper>
  );
}
