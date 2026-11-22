'use client';

import { Geist, Geist_Mono } from 'next/font/google';

import { Exception } from '@workspace/branding/components/exception';
import '@workspace/ui/globals.css';
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
        <Exception
          code={500}
          text="Internal error"
        />
      </body>
    </html>
  );
}
