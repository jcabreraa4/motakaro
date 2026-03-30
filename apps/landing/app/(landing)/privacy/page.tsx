import { Separator } from '@workspace/ui/components/separator';

type Section = {
  number: number;
  name: string;
  description: string;
};

const sections: Section[] = [
  {
    number: 1,
    name: 'Data Collection',
    description: "We collect different types of personal data, including:\n\n- Identity data: User's first and last name.\n- Contact data: Email address and phone number.\n- Technical data: IP address, browser type, and operating system.\n- Usage data: Information on how you interact with our website and services."
  },
  {
    number: 2,
    name: 'Use of Information',
    description: 'We use the collected data to improve our services, personalize your experience, manage your account, and communicate with you. We may also use it to ensure the security of our website and comply with legal obligations.'
  },
  {
    number: 3,
    name: 'Data Protection',
    description: 'We implement technical and organizational security measures to protect your personal information against unauthorized access, loss, or alteration.'
  },
  {
    number: 4,
    name: 'Sharing with Third Parties',
    description: 'We do not share your personal data with third parties, except in cases necessary for the provision of our services, legal compliance, or security improvement.'
  },
  {
    number: 5,
    name: 'Cookies and Similar Technologies',
    description: 'We use cookies and similar technologies to enhance user experience and analyze website traffic. You can manage your preferences through your browser settings.'
  },
  {
    number: 6,
    name: 'Your Rights',
    description: 'You have the right to access, rectify, or delete your personal data, as well as to object to its processing. To exercise these rights, you can contact us.'
  },
  {
    number: 7,
    name: 'Contact Us',
    description: 'If you have questions about this policy or how we handle your data, you can contact us via our support email.'
  }
];

export default function Page() {
  return (
    <section className="container mx-auto px-3 py-15 xl:px-5 xl:py-20">
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl font-black xl:text-5xl">Privacy Policy</h1>
        <h2 className="text-xl font-semibold xl:text-2xl">Here we explain how we collect, use, and protect your personal information when you interact with our website and services.</h2>
        <div className="flex flex-col gap-6 xl:gap-10">
          {sections.map((section, index) => (
            <div
              key={index}
              className="flex flex-col gap-6 xl:gap-10"
            >
              <Separator className="border bg-black" />
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-bold">
                  {section.number} | {section.name}
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
        </div>
      </div>
    </section>
  );
}
