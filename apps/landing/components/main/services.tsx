import { Card, CardHeader, CardDescription, CardFooter, CardTitle } from '@workspace/ui/components/card';
import { type LucideIcon, MegaphoneIcon, SearchIcon, TrendingUpIcon, VideoIcon } from 'lucide-react';
import { ActionButton } from '@/components/motakaro/action-button';
import { WordRotate } from '@workspace/ui/custom/word-rotate';
import { DotPattern } from '@workspace/ui/custom/dot-pattern';
import { BoxReveal } from '@workspace/ui/custom/box-reveal';

type Section = {
  name: string;
  description: string;
  icon: LucideIcon;
};

const sections: Section[] = [
  {
    name: 'Step 1: Market Research',
    description: 'We analyze your competition and competitive advantage to define a unique narrative. We build a strategic framework that positions your company as a leader and differentiates your solution in the market.',
    icon: SearchIcon
  },
  {
    name: 'Step 2: Content Production',
    description: 'We interview your CEO or C-level to extract key ideas and turn them into high-impact content. We edit and optimize these clips for LinkedIn, generating authority and connection with your audience.',
    icon: VideoIcon
  },
  {
    name: 'Step 3: Acceleration with Ads',
    description: 'We use LinkedIn Ads to amplify your content and attract potential customers. With Thought Leader Ads, we impact your ICP in early stages and optimize costs with high creative rotation.',
    icon: MegaphoneIcon
  },
  {
    name: 'Step 4: Signal-Based Selling',
    description: 'We nurture and filter prospects that have shown signs of purchase intent to your SDR team, continually optimizing to focus budget on the profiles with the highest conversion potential.',
    icon: TrendingUpIcon
  }
];

export function Services() {
  return (
    <section className="container mx-auto flex flex-col gap-10 px-3 pt-15 xl:px-5 xl:pt-20 xl:pb-20">
      <h2 className="flex items-center gap-2 text-4xl font-black text-black xl:text-5xl dark:text-white">
        Our{' '}
        <span className="inline-flex">
          <WordRotate words={['Service', 'Process', 'Manual']} />
        </span>
      </h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2">
        {sections.map(({ name, description, icon: Icon }, index) => (
          <Card
            key={index}
            className="relative overflow-hidden bg-black text-white"
          >
            <CardHeader className="flex flex-col items-start gap-3">
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
              <CardDescription className="hidden text-lg text-white lg:block">
                <BoxReveal
                  boxColor="#ffffff"
                  duration={0.75}
                >
                  {description}
                </BoxReveal>
              </CardDescription>
              <CardDescription className="text-lg text-white lg:hidden">{description}</CardDescription>
            </CardHeader>
            <CardFooter className="hidden lg:block">
              <BoxReveal
                boxColor="#007fd8"
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
