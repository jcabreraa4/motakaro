import { DownloadIcon } from 'lucide-react';

import { Separator } from '@workspace/ui/components/separator';

import { Heading2, Heading3, Paragraph } from '@/components/layout/app-heading';
import { SectionContent, SectionInner, SectionWrapper } from '@/components/layout/app-section';

interface Section {
  title: string;
  description: string;
  link: string;
}

const sections: Section[] = [
  {
    title: 'Debian Desktop',
    description: 'The Debian installer for the desktop version of Motakaro.',
    link: ''
  }
];

export default function Page() {
  return (
    <SectionWrapper className="flex flex-1">
      <SectionInner>
        <SectionContent className="flex flex-col gap-5">
          <Heading2>Desktop Download</Heading2>
          <Heading3>Here you can download the desktop version of Motakaro.</Heading3>
        </SectionContent>
        <SectionContent className="flex flex-1 flex-col gap-6 lg:gap-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className="flex flex-col gap-6 lg:gap-8"
            >
              <Separator />
              <div className="flex flex-col gap-3">
                <Heading3 className="flex items-center gap-2">
                  [ <DownloadIcon /> ] {section.title}
                </Heading3>
                <div>
                  {section.description.split('\n').map((line, i) => (
                    <Paragraph key={i}>{line}</Paragraph>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </SectionContent>
      </SectionInner>
    </SectionWrapper>
  );
}
