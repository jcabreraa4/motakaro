import { SectionContent, SectionInner, SectionWrapper } from '@/components/layout/app-section';

const playbook = process.env.NEXT_PUBLIC_GAMMA_URL!;

export default function Page() {
  return (
    <SectionWrapper className="flex flex-1">
      <SectionInner className="flex flex-1">
        <SectionContent className="flex flex-1">
          <iframe
            src={playbook}
            allow="fullscreen"
            title="Motakaro Playbook"
            className="h-full w-full rounded-md border shadow select-none"
          />
        </SectionContent>
      </SectionInner>
    </SectionWrapper>
  );
}
