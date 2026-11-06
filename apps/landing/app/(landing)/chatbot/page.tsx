import { Input } from '@workspace/ui/components/shadcn/input';

import { Paragraph } from '@/components/layout/app-heading';
import { SectionContent, SectionInner, SectionWrapper } from '@/components/layout/app-section';

export default function Page() {
  return (
    <SectionWrapper className="flex flex-1">
      <SectionInner className="flex flex-1">
        <SectionContent className="flex flex-1 items-center">
          <div className="flex w-full flex-col gap-2">
            <Paragraph>Chatbot</Paragraph>
            <Input />
          </div>
        </SectionContent>
      </SectionInner>
    </SectionWrapper>
  );
}
