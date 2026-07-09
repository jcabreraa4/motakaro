import { VelocityScroll } from '@workspace/ui/components/magicui/velocity-scroll';
import { VideoDialog } from '@workspace/ui/components/magicui/video-dialog';

import { SectionContent, SectionInner, SectionWrapper } from '@/components/layout/app-section';
import { ContactLink } from '@/components/motakaro/contact-link';
import { PlaybookLink } from '@/components/motakaro/playbook-link';

const industries = ['DATAOPS', 'B2B CONSULTING', 'FINTECH', 'CYBERSECURITY', 'REVOPS', 'MARTECH', 'FINOPS', 'ENTERPRISE IT'];

export function MainHeader() {
  return (
    <SectionWrapper>
      <SectionInner>
        <SectionContent className="flex flex-col gap-10 lg:flex-row lg:gap-0">
          <div className="flex w-full flex-col justify-center gap-8 xl:w-2/4">
            <h1 className="max-w-2xl text-5xl font-black uppercase">B2B Revenue Systems through Hybrid Demand</h1>
            <h2 className="max-w-3xl text-3xl font-bold">Predictable revenue workflows based on</h2>
            <h3 className="max-w-2xl text-xl font-medium">GTM strategy based on audience targeting and education on LinkedIn, with ads designed to attract your ICP and generate real buying intent signals.</h3>
            <div className="flex gap-6">
              <ContactLink />
              <PlaybookLink />
            </div>
          </div>
          <VideoDialog
            video=""
            thumbnail="/header.webp"
            animation="from-center"
            className="w-full xl:w-2/4"
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
