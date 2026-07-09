import { type LucideIcon, RocketIcon, SproutIcon } from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { DotBackground } from '@workspace/ui/components/magicui/dot-pattern';
import { HyperText } from '@workspace/ui/components/magicui/hyper-text';

import { SectionContent, SectionInner, SectionTitle, SectionWrapper } from '@/components/layout/app-section';
import { ContactLink } from '@/components/motakaro/contact-link';

interface Plan {
  name: string;
  icon: LucideIcon;
  price: string;
  features: {
    name: string;
    description: string;
  }[];
}

const plans: Plan[] = [
  {
    name: 'Rollout Plan',
    icon: SproutIcon,
    price: '$950 / month',
    features: [
      {
        name: 'Market Research',
        description: 'Competence and competitive advantage analysis.'
      },
      {
        name: 'Strategy Creation',
        description: 'Go to market approach and narrative conception.'
      },
      {
        name: 'Content Production',
        description: 'Recording, editing and distribution of content.'
      },
      {
        name: 'Weekly Reporting',
        description: 'Weekly written and recorded work reports.'
      }
    ]
  },
  {
    name: 'Scaling Plan',
    icon: RocketIcon,
    price: '$1,750 / month',
    features: [
      {
        name: 'All from Rollout',
        description: 'All the features included in the Rollout plan.'
      },
      {
        name: 'Ads Funnel Setup',
        description: 'Web visitor tracker and CRM integration.'
      },
      {
        name: 'Ads Management',
        description: 'Ad management, deployment and optimization.'
      },
      {
        name: 'Unlimited Consulting',
        description: 'Absolute availability for doubts or advice.'
      }
    ]
  }
];

export function MainPricing() {
  return (
    <SectionWrapper>
      <SectionInner>
        <SectionContent>
          <SectionTitle>
            <HyperText>Pricing Plans</HyperText>
          </SectionTitle>
        </SectionContent>
        <SectionContent className="flex flex-col gap-5 lg:flex-row">
          {plans.map(({ name, price, features, icon: Icon }, index) => (
            <Card
              key={index}
              className="relative w-full bg-black"
            >
              <CardHeader className="gap-2">
                <CardTitle className="flex items-center gap-3">
                  <Icon className="size-6 text-white" />
                  <span className="text-xl font-bold text-motakaro">{name}</span>
                </CardTitle>
                <CardDescription className="text-lg text-white">{price}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-lg font-medium text-white"
                  >
                    <span>•</span>
                    <span>
                      {feature.name}: {feature.description}
                    </span>
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
