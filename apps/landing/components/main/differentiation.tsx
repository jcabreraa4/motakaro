import { BoxReveal } from '@workspace/ui/custom/box-reveal';
import { SparklesText } from '@workspace/ui/custom/sparkles-text';
import { GridPattern } from '@workspace/ui/custom/grid-pattern';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@workspace/ui/components/card';
import { ActionButton } from '@/components/motakaro/action-button';
import { HyperText } from '@workspace/ui/custom/hyper-text';
import { cn } from '@workspace/ui/lib/utils';

type Section = {
  name: string;
  points: string[];
};

const sections: Section[] = [
  {
    name: 'THE PROBLEMS',
    points: ['Investment in marketing is inefficient and costly, attracting low qualified profiles that do not convert and raise the cost of acquisition.', "Without a content strategy, your brand isn't perceived as a reference. If you don't stand out in the market, customers choose the competition.", "Buyers research, consume content, and trust experts before contacting sales. If you're not on their radar beforehand, you're not an option.", "Your team can't spend hours recording, optimizing ads, and managing LinkedIn. Without a clear strategy, effort doesn't translate into results."]
  },
  {
    name: 'OUR SOLUTIONS',
    points: ['We generate demand with strategic content and optimized ads, reducing your acquisition cost and attracting customers ready to buy.', 'We convert your CEO or C-level knowledge into high-impact content, differentiating you with a unique narrative that builds trust and authority.', 'Your company appears at the key moment with content and ads that educate buyers before they look for solutions.', 'We take care of everything: interviews, editing, ads, and optimization, maximizing your LinkedIn investment while you focus on closing sales.']
  }
];

export function Differentiation() {
  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden bg-black">
      <section className="container mx-auto px-3 py-15 xl:px-5 xl:py-20">
        <div className="flex flex-col gap-15">
          <SparklesText className="text-center text-white">Like Magic</SparklesText>
          <div className="flex w-full flex-col items-center gap-5 text-white xl:flex-row xl:justify-evenly">
            {sections.map((section, index) => (
              <Card
                key={index}
                className={cn('w-full max-w-xl bg-black px-1 py-5 ring-0 md:p-5', section.name === sections[1]!.name && 'shadow-[0px_4px_15px_#007fd8]')}
              >
                <CardHeader>
                  <CardTitle>
                    <BoxReveal
                      boxColor="#007fd8"
                      duration={0.5}
                    >
                      <div className="hidden text-xl font-bold text-motakaro lg:block xl:text-2xl">
                        <HyperText>{section.name}</HyperText>
                      </div>
                    </BoxReveal>
                    <div className="text-xl font-bold text-motakaro lg:hidden xl:text-2xl">
                      <HyperText>{section.name}</HyperText>
                    </div>
                  </CardTitle>
                </CardHeader>
                <BoxReveal
                  boxColor="#ffffff"
                  duration={0.75}
                >
                  <CardContent className="hidden flex-col gap-8 lg:flex">
                    {section.points.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 font-medium text-white"
                      >
                        <span className="text-xl">•</span>
                        <p className="text-lg">{point}</p>
                      </div>
                    ))}
                  </CardContent>
                </BoxReveal>
                <CardContent className="flex flex-col gap-8 lg:hidden">
                  {section.points.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 font-medium text-white"
                    >
                      <span className="text-xl">•</span>
                      <p className="text-lg">{point}</p>
                    </div>
                  ))}
                </CardContent>
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
              </Card>
            ))}
          </div>
        </div>
      </section>
      <GridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn('mask-[radial-gradient(500px_circle_at_center,white,transparent)]', 'inset-x-0 inset-y-[-30%] h-[200%] w-full skew-y-12')}
      />
    </div>
  );
}
