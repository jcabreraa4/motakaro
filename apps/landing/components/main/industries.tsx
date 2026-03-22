import { VelocityScroll } from '@workspace/ui/custom/velocity-scroll';

const industries: string[] = ['DATAOPS', 'B2B CONSULTING', 'FINTECH', 'CYBERSECURITY', 'REVOPS', 'MARTECH', 'FINOPS', 'ENTERPRISE IT', 'MEDTECH'];

export function Industries() {
  return (
    <section className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden pt-10 pb-20 select-none">
      <VelocityScroll>
        {industries.map((industry, index) => (
          <span
            key={index}
            className="mx-3 text-4xl font-black transition hover:cursor-default hover:text-motakaro xl:text-5xl"
          >
            {industry}
          </span>
        ))}
      </VelocityScroll>
    </section>
  );
}
