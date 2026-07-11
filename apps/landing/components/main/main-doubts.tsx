import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@workspace/ui/components/accordion';

import { Heading3, Paragraph } from '@/components/layout/app-heading';
import { SectionContent, SectionInner, SectionWrapper } from '@/components/layout/app-section';

interface Question {
  title: string;
  description: string;
}

const questions: Question[] = [
  {
    title: 'How does the pricing work?',
    description: 'Payment is monthly and you can cancel at any time. For solid results, we recommend a minimum commitment of 3 months.'
  },
  {
    title: 'How do I know if this is for me?',
    description: 'If your company offers B2B High Ticket solutions, either product or services, our strategy will fit perfectly.'
  },
  {
    title: 'How can I trust the process?',
    description: 'Before we get started, we will schedule a call where we will present you with a customized strategy and provide you with an actionable roadmap.'
  },
  {
    title: 'How long before I see results?',
    description: 'It depends on the case, but you will notice progress from the first month. To achieve a steady and predictable flow of customers, is ideal to wait from 3 to 6 months.'
  },
  {
    title: 'Will I have to invest a lot of time?',
    description: "We'll only need between 60 and 90 minutes per month from the CEO or a C-level to generate all the necessary content."
  }
];

export function MainDoubts() {
  return (
    <SectionWrapper>
      <SectionInner>
        <SectionContent>
          <Accordion
            collapsible
            id="faqs"
            type="single"
          >
            {questions.map((question, index) => (
              <AccordionItem
                key={index}
                value={index.toString()}
                className="border-black py-2"
              >
                <AccordionTrigger className="cursor-pointer">
                  <Heading3>{question.title}</Heading3>
                </AccordionTrigger>
                <AccordionContent>
                  <Paragraph>{question.description}</Paragraph>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </SectionContent>
      </SectionInner>
    </SectionWrapper>
  );
}
