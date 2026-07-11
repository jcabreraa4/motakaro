import { VelocityScroll } from '@workspace/ui/components/magicui/velocity-scroll';
import { VideoDialog } from '@workspace/ui/components/magicui/video-dialog';

import { Heading1, Heading2, Heading3 } from '@/components/layout/app-heading';
import { SectionContent, SectionInner, SectionWrapper } from '@/components/layout/app-section';
import { ContactLink } from '@/components/motakaro/contact-link';
import { PlaybookLink } from '@/components/motakaro/playbook-link';

const video = process.env.NEXT_PUBLIC_VIDEO_URL;

const industries = ['DATAOPS', 'B2B CONSULTING', 'FINTECH', 'CYBERSECURITY', 'REVOPS', 'MARTECH', 'FINOPS', 'ENTERPRISE IT'];

export function MainHeader() {
  return (
    <SectionWrapper>
      <SectionInner>
        <SectionContent className="flex flex-col gap-5 lg:flex-row">
          <div className="flex w-full flex-col justify-center gap-6 lg:gap-8">
            <Heading1 className="uppercase">B2B Revenue Systems through Hybrid Demand</Heading1>
            <Heading2>Predictable revenue workflows based on</Heading2>
            <Heading3>GTM strategy based on audience targeting and education on LinkedIn, with ads designed to attract your ICP and generate real buying intent signals.</Heading3>
            <div className="flex gap-6">
              <ContactLink />
              <PlaybookLink />
            </div>
          </div>
          <VideoDialog
            video={video || ''}
            thumbnail="/header.webp"
            animation="from-center"
            className="w-full"
          />
        </SectionContent>
        <VelocityScroll>
          {industries.map((industry, index) => (
            <span
              key={index}
              className="mx-2 cursor-default text-4xl font-black transition select-none hover:text-motakaro"
            >
              {industry}
            </span>
          ))}
        </VelocityScroll>
      </SectionInner>
    </SectionWrapper>
  );
}
