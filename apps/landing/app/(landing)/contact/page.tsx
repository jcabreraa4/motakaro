'use client';

import { useEffect, useState } from 'react';

import Cal, { getCalApi } from '@calcom/embed-react';

import { GenericLoader } from '@workspace/ui/components/custom/generic-loader';

import { SectionContent, SectionInner, SectionWrapper } from '@/components/layout/app-section';

const calcom = process.env.NEXT_PUBLIC_CALCOM_URL!;

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function handleCalcom() {
      const cal = await getCalApi({ namespace: 'discovery' });
      cal('ui', {
        theme: 'dark',
        cssVarsPerTheme: {
          light: { 'cal-brand': '#007fd8' },
          dark: { 'cal-brand': '#007fd8' }
        },
        hideEventTypeDetails: false,
        layout: 'month_view'
      });
      cal('on', {
        action: 'linkReady',
        callback: () => setIsLoading(false)
      });
    }
    handleCalcom();
  }, []);

  return (
    <SectionWrapper className="flex flex-1">
      <SectionInner className="flex flex-1">
        <SectionContent className="relative flex flex-1">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <GenericLoader />
            </div>
          )}
          <Cal
            calLink={calcom}
            namespace="Discovery"
            config={{ layout: 'month_view', theme: 'dark' }}
            style={{ width: '100%', flex: 1, overflow: 'scroll' }}
            className="flex items-center justify-center"
          />
        </SectionContent>
      </SectionInner>
    </SectionWrapper>
  );
}
