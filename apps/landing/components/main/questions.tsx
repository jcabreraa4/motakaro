import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@workspace/ui/components/accordion';

type Section = {
  name: string;
  description: string;
};

const sections: Section[] = [
  {
    name: 'How does the pricing work?',
    description: 'Payment is monthly and you can cancel at any time. For solid results, we recommend a minimum commitment of 3 months.'
  },
  {
    name: 'How do I know if this is for me?',
    description: 'If your company offers B2B High Ticket solutions, either product or services, our strategy will fit perfectly.'
  },
  {
    name: 'How can I trust the process?',
    description: 'Before we get started, we will schedule a call where we will present you with a customized strategy and provide you with an actionable roadmap.'
  },
  {
    name: 'How long before I see results?',
    description: 'It depends on the case, but you will notice progress from the first month. To achieve a steady and predictable flow of customers, is ideal to wait from 3 to 6 months.'
  },
  {
    name: 'Will I have to invest a lot of time?',
    description: "We'll only need between 60 and 90 minutes per month from the CEO or a C-level to generate all the necessary content."
  }
];

export function Questions() {
  return (
    <section className="container mx-auto px-3 py-15 xl:px-5 xl:py-20">
      <div className="w-full">
        <Accordion
          collapsible
          id="faqs"
          type="single"
          className="w-full"
        >
          {sections.map((section, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-black py-2"
            >
              <AccordionTrigger className="cursor-pointer text-2xl font-bold">{section.name}</AccordionTrigger>
              <AccordionContent className="text-lg font-medium">{section.description}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
