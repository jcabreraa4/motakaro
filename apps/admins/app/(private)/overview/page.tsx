'use client';

import * as React from 'react';
import { Calendar } from '@workspace/ui/components/calendar';

export default function Page() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <main className="w-full overflow-hidden p-3 lg:p-5">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border"
        captionLayout="dropdown"
      />
    </main>
  );
}
