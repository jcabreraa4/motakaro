import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from '@workspace/ui/components/card';
import { ActionButton } from '@/components/motakaro/action-button';
import { DotPattern } from '@workspace/ui/magicui/dot-pattern';
import { BoxReveal } from '@workspace/ui/magicui/box-reveal';

const plans = [
  {
    name: 'Rollout Plan',
    icon: '🌱',
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
    icon: '🚀',
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
      <h2 className="text-4xl font-black xl:text-5xl">Pricing Plans</h2>
      <div className="flex flex-col gap-5 xl:flex-row">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className="relative w-full overflow-hidden bg-black text-white"
          >
            <CardHeader>
              <CardTitle className="hidden text-2xl font-bold text-motakaro lg:block">
                <BoxReveal
                  boxColor="#007fd8"
                  duration={0.5}
                >
                  {plan.icon} {plan.name}
                </BoxReveal>
              </CardTitle>
              <CardTitle className="text-xl font-bold text-motakaro lg:hidden">
                {plan.icon} {plan.name}
              </CardTitle>
              <CardDescription className="hidden text-lg font-semibold text-white lg:block">
                <BoxReveal
                  boxColor="#ffffff"
                  duration={0.75}
                >
                  {plan.price}
                </BoxReveal>
              </CardDescription>
              <CardDescription className="text-base font-semibold text-white lg:hidden">{plan.price}</CardDescription>
            </CardHeader>
            <BoxReveal
              boxColor="#007fd8"
              duration={0.75}
            >
              <CardContent className="hidden flex-col gap-8 lg:flex">
                {plan.features.map((feature, index) => (
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
              {plan.features.map((feature, index) => (
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
