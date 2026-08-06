import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { DotBackground } from '@workspace/ui/components/magicui/dot-pattern';
import { SparklesText } from '@workspace/ui/components/magicui/sparkles-text';
import { cn } from '@workspace/ui/lib/utils';

import { Heading2, Heading3, Paragraph } from '@/components/layout/app-heading';
import { SectionContent, SectionInner, SectionWrapper } from '@/components/layout/app-section';
import { ContactLink } from '@/components/motakaro/contact-link';

interface Section {
  title: string;
  points: string[];
}

const sections: Section[] = [
  {
    title: 'GTM Problems',
    points: ['Investment in marketing is inefficient and costly, attracting low qualified profiles that do not convert and raise the cost of acquisition.', "Without a content strategy, your brand isn't perceived as a reference. If you don't stand out in the market, customers choose the competition.", "Buyers research, consume content, and trust experts before contacting sales. If you're not on their radar beforehand, you're not an option.", "Your team can't spend hours recording, optimizing ads, and managing LinkedIn. Without a clear strategy, effort doesn't translate into results."]
  },
  {
    title: 'Our Solutions',
    points: ['We generate demand with strategic content and optimized ads, reducing your acquisition cost and attracting customers ready to buy.', 'We convert your CEO or C-level knowledge into high-impact content, differentiating you with a unique narrative that builds trust and authority.', 'Your company appears at the key moment with content and ads that educate buyers before they look for solutions.', 'We take care of everything: interviews, editing, ads, and optimization, maximizing your LinkedIn investment while you focus on closing sales.']
  }
];

export function MainHybrid() {
  return (
    <SectionWrapper>
      <SectionInner>
        <SectionContent>
          <Heading2 className="text-center">
            <SparklesText>Hybrid Demand</SparklesText>
          </Heading2>
        </SectionContent>
        <SectionContent className="flex flex-col gap-5 lg:flex-row">
          {sections.map((section, index) => (
            <Card
              key={index}
              className={cn('relative w-full bg-black', index === 1 && 'shadow-motakaro shadow-lg')}
            >
              <CardHeader>
                <CardTitle>
                  <Heading3 className="text-motakaro">{section.title}</Heading3>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-8">
                {section.points.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2"
                  >
                    <Paragraph className="text-white">•</Paragraph>
                    <Paragraph className="text-white">{point}</Paragraph>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <ContactLink />
              </CardFooter>
              <DotBackground />
            </Card>
          ))}
        </SectionContent>
      </SectionInner>
    </SectionWrapper>
  );
}
