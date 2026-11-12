import type { IconType } from 'react-icons';
import { FaWindows } from 'react-icons/fa6';
import { SiDebian } from 'react-icons/si';

import { DownloadIcon } from 'lucide-react';

import { Separator } from '@workspace/ui/components/separator';

import { Heading2, Heading3, Paragraph } from '@/components/layout/app-heading';
import { SectionContent, SectionInner, SectionWrapper } from '@/components/layout/app-section';

interface Section {
  icon: IconType;
  title: string;
  description: string;
  link: string;
}

const sections: Section[] = [
  {
    icon: SiDebian,
    title: 'Debian Desktop',
    description: 'Download the Motakaro desktop app for Debian.',
    link: 'https://github.com/jcabreraa4/motakaro/releases/download/desktop/motakaro_amd64.deb'
  },
  {
    icon: FaWindows,
    title: 'Windows Desktop',
    description: 'Download the Motakaro desktop app for Windows.',
    link: 'https://github.com/jcabreraa4/motakaro/releases/download/desktop/motakaro_x64-setup.exe'
  }
];

export default function Page() {
  return (
    <SectionWrapper className="flex flex-1">
      <SectionInner>
        <SectionContent className="flex flex-col gap-5">
          <Heading2>Desktop Download</Heading2>
          <Heading3>Choose your platform to download the desktop app.</Heading3>
        </SectionContent>
        <SectionContent className="flex flex-1 flex-col gap-6 lg:gap-8">
          {sections.map(({ icon: Icon, title, description, link }) => (
            <div
              key={title}
              className="flex flex-col gap-6 lg:gap-8"
            >
              <Separator />
              <div className="flex flex-col gap-3">
                <Heading3 className="flex items-center gap-2">
                  <Icon />
                  {title}
                </Heading3>
                <Paragraph>{description}</Paragraph>
                <a
                  href={link}
                  className="inline-flex w-fit items-center gap-2 underline underline-offset-4"
                >
                  <DownloadIcon size={16} />
                  Download
                </a>
              </div>
            </div>
          ))}
        </SectionContent>
      </SectionInner>
    </SectionWrapper>
  );
}
