import { SettingsIcon } from 'lucide-react';

import { AppSection } from '@/components/layout/app-section';

export default function Page() {
  return (
    <AppSection className="flex flex-col items-center justify-center gap-3">
      <SettingsIcon className="size-14" />
      <p className="text-2xl font-semibold">Under Construction</p>
    </AppSection>
  );
}
