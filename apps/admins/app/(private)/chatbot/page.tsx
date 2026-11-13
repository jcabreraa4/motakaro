import { SettingsIcon } from 'lucide-react';

import { InsetSection } from '@/components/layout/inset-section';

export default function Page() {
  return (
    <InsetSection className="flex flex-col items-center justify-center gap-3">
      <SettingsIcon className="size-14" />
      <p className="text-2xl font-semibold">Under Construction</p>
    </InsetSection>
  );
}
