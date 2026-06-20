import { cloneElement, useEffect } from 'react';

import { getCalApi } from '@calcom/embed-react';

export function MeetingsCreate({ children }: { children: React.ReactElement }) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: 'discovery' });
      cal('ui', { theme: 'dark', cssVarsPerTheme: { light: { 'cal-brand': '#007fd8' }, dark: { 'cal-brand': '#007fd8' } }, hideEventTypeDetails: false, layout: 'month_view' });
    })();
  }, []);

  return cloneElement(children as React.ReactElement);
}
