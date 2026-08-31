import { type LucideIcon, MegaphoneIcon, SearchIcon, TrendingUpIcon, VideoIcon } from 'lucide-react';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';

import { Heading2, Heading3, Paragraph } from '@/components/layout/app-heading';
import { SectionContent, SectionInner, SectionWrapper } from '@/components/layout/app-section';
import { ContactLink } from '@/components/motakaro/contact-link';
import { DotBackground } from '@/components/ui/dot-pattern';
import { HyperText } from '@/components/ui/hyper-text';

interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
}

const services: Service[] = [
  {
    title: 'Market Research',
    description: 'We analyze your competition and competitive advantage to define a unique narrative. We build a strategic framework that positions your company as a leader and differentiates your solution in the market.',
    icon: SearchIcon
  },
  {
    title: 'Content Production',
    description: 'We interview your CEO or C-level to extract key ideas and turn them into high-impact content. We edit and optimize these clips for LinkedIn, generating authority and connection with your audience.',
    icon: VideoIcon
  },
  {
    title: 'Ads Acceleration',
    description: 'We use LinkedIn Ads to amplify your content and attract potential customers. With Thought Leader Ads, we impact your ICP in early stages and optimize costs with high creative rotation.',
    icon: MegaphoneIcon
  },
  {
    title: 'Signal-Based Selling',
    description: 'We nurture and filter prospects that have shown signs of purchase intent to your SDR team, continually optimizing to focus budget on the profiles with the highest conversion potential.',
    icon: TrendingUpIcon
  }
];

export function MainService() {
  return (
    <SectionWrapper>
      <SectionInner>
        <SectionContent>
          <Heading2>
            <HyperText>Our Service</HyperText>
          </Heading2>
        </SectionContent>
        <SectionContent className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
          {services.map(({ title, description, icon: Icon }, index) => (
            <Card
              key={index}
              className="relative w-full bg-black"
            >
              <CardHeader className="gap-2">
                <CardTitle className="flex items-center gap-3">
                  <Icon className="size-6 text-white" />
                  <Heading3 className="text-motakaro">
                    Step {index + 1}: {title}
                  </Heading3>
                </CardTitle>
                <CardDescription>
                  <Paragraph className="text-white">{description}</Paragraph>
                </CardDescription>
              </CardHeader>
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
