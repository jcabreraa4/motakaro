import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from '@workspace/ui/components/card';
import { type LucideIcon, SproutIcon, RocketIcon } from 'lucide-react';
import { ActionButton } from '@/components/motakaro/action-button';
import { DotPattern } from '@workspace/ui/magicui/dot-pattern';
import { BoxReveal } from '@workspace/ui/magicui/box-reveal';

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
        name: 'Market Research:',
        description: 'Competence and competitive advantage analysis.'
      },
      {
        name: 'Strategy Creation:',
        description: 'Go to market approach and narrative conception.'
      },
      {
        name: 'Content Production:',
        description: 'Recording, editing and distribution of content.'
      },
      {
        name: 'Weekly Reporting:',
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
        name: 'All from Rollout:',
        description: 'All the features included in the Rollout plan.'
      },
      {
        name: 'Ads Funnel Setup:',
        description: 'Web visitor tracker and CRM integration.'
      },
      {
        name: 'Ads Management:',
        description: 'Ad management, deployment and optimization.'
      },
      {
        name: 'Unlimited Consulting:',
        description: 'Absolute availability for doubts or advice.'
      }
    ]
  }
];

export function Pricing() {
  return (
    <section className="container mx-auto flex flex-col gap-10 px-3 py-15 xl:px-5 xl:py-20">
      <h2 className="text-4xl font-black select-none xl:text-5xl">Pricing Plans</h2>
      <div className="flex flex-col gap-5 xl:flex-row">
        {plans.map(({ name, price, features, icon: Icon }, index) => (
          <Card
            key={index}
            className="relative w-full overflow-hidden bg-black text-white"
          >
            <CardHeader>
              <BoxReveal
                boxColor="#007fd8"
                duration={0.5}
              >
                <div className="hidden items-center gap-3 lg:flex">
                  <Icon size={28} />
                  <CardTitle className="text-xl font-bold text-motakaro xl:text-2xl">{name}</CardTitle>
                </div>
              </BoxReveal>
              <div className="flex items-center gap-3 lg:hidden">
                <Icon size={28} />
                <CardTitle className="text-xl font-bold text-motakaro">{name}</CardTitle>
              </div>
              <CardDescription className="mt-1 hidden text-lg font-semibold text-white lg:block">
                <BoxReveal
                  boxColor="#ffffff"
                  duration={0.75}
                >
                  {price}
                </BoxReveal>
              </CardDescription>
              <CardDescription className="mt-2 text-base font-semibold text-white lg:hidden">{price}</CardDescription>
            </CardHeader>
            <BoxReveal
              boxColor="#007fd8"
              duration={0.75}
            >
              <CardContent className="hidden flex-col gap-8 lg:flex">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 font-medium text-white"
                  >
                    <span className="text-xl">•</span>
                    <p className="text-lg">
                      <span className="font-semibold">{feature.name}</span> {feature.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </BoxReveal>
            <CardContent className="flex flex-col gap-8 lg:hidden">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 font-medium text-white"
                >
                  <span className="text-xl">•</span>
                  <p className="text-lg">
                    <span className="font-semibold">{feature.name}</span> {feature.description}
                  </p>
                </div>
              ))}
            </CardContent>
            <CardFooter className="hidden lg:block">
              <BoxReveal
                boxColor="#ffffff"
                duration={1}
              >
                <ActionButton />
              </BoxReveal>
            </CardFooter>
            <CardFooter className="lg:hidden">
              <ActionButton />
            </CardFooter>
            <DotPattern
              width={25}
              height={25}
              cx={3}
              cy={3}
              cr={1.5}
              className="pointer-events-none absolute inset-0 opacity-30"
            />
          </Card>
        ))}
      </div>
    </section>
  );
}
