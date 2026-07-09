import { TextReveal } from '@workspace/ui/components/magicui/text-reveal';

import { SectionContent, SectionInner, SectionWrapper } from '@/components/layout/app-section';

export function MainReveal() {
  return (
    <SectionWrapper>
      <SectionInner>
        <SectionContent className="select-none">
          <TextReveal>We revolutionize the way you interact with your market.</TextReveal>
        </SectionContent>
      </SectionInner>
    </SectionWrapper>
  );
}
