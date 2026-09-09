'use client';

import { Geist, Geist_Mono } from 'next/font/google';

import '@workspace/ui/globals.css';
import { ExceptionPage } from '@workspace/ui/components/custom/exception-page';
import { cn } from '@workspace/ui/lib/utils';

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans'
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

export default function GlobalError() {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('antialiased', fontMono.variable, 'font-sans', fontSans.variable)}
    >
      <body suppressHydrationWarning>
        <ExceptionPage
          code={500}
          text="Internal error"
        />
      </body>
    </html>
  );
}
