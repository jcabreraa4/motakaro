'use client';

import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';

export default function Page() {
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
    }
    handleCalcom();
  }, []);

  return (
    <main className="container mx-auto flex flex-1 flex-col px-3 py-10 xl:px-5">
      <Cal
        namespace="Discovery"
        calLink="jcabreraa4/discovery"
        config={{ layout: 'month_view', theme: 'dark' }}
        style={{ width: '100%', flex: 1, overflow: 'scroll' }}
      />
    </main>
  );
}
