import { Separator } from '@workspace/ui/components/separator';

import { SectionContent, SectionInner, SectionSubtitle, SectionTitle, SectionWrapper } from '@/components/layout/app-section';

interface Section {
  title: string;
  description: string;
}

const sections: Section[] = [
  {
    title: 'Data Collection',
    description: "We collect different types of personal data, including:\n\n- Identity data: User's first and last name.\n- Contact data: Email address and phone number.\n- Technical data: IP address, browser type, and operating system.\n- Usage data: Information on how you interact with our website and services."
  },
  {
    title: 'Use of Information',
    description: 'We use the collected data to improve our services, personalize your experience, manage your account, and communicate with you. We may also use it to ensure the security of our website and comply with legal obligations.'
  },
  {
    title: 'Data Protection',
    description: 'We implement technical and organizational security measures to protect your personal information against unauthorized access, loss, or alteration.'
  },
  {
    title: 'Sharing with Third Parties',
    description: 'We do not share your personal data with third parties, except in cases necessary for the provision of our services, legal compliance, or security improvement.'
  },
  {
    title: 'Cookies and Similar Technologies',
    description: 'We use cookies and similar technologies to enhance user experience and analyze website traffic. You can manage your preferences through your browser settings.'
  },
  {
    title: 'Your Rights',
    description: 'You have the right to access, rectify, or delete your personal data, as well as to object to its processing. To exercise these rights, you can contact us.'
  },
  {
    title: 'Contact Us',
    description: 'If you have questions about this policy or how we handle your data, you can contact us via our support email.'
  }
];

export default function Page() {
  return (
    <SectionWrapper>
      <SectionInner>
        <SectionContent className="flex flex-col gap-5">
          <SectionTitle>Privacy Policy</SectionTitle>
          <SectionSubtitle>Here we explain how we collect, use, and protect your personal information when you interact with our website and services.</SectionSubtitle>
        </SectionContent>
        <SectionContent className="flex flex-col gap-6 lg:gap-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className="flex flex-col gap-6 lg:gap-8"
            >
              <Separator />
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold">
                  [ {index + 1} ] {section.title}
                </h3>
                <div className="text-lg font-medium">
                  {section.description.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </SectionContent>
      </SectionInner>
    </SectionWrapper>
  );
}
