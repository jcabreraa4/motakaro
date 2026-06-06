'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import { useEffect } from 'react';

import { captureException } from '@sentry/nextjs';

import { GenericError } from '@workspace/ui/custom/generic-error';
import '@workspace/ui/globals.css';
import { cn } from '@workspace/ui/lib/utils';

import { Branding } from '@/components/branding';

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans'
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

interface GlobalErrorProps {
  error: Error & { digest?: string };
}

export default function GlobalError({ error }: GlobalErrorProps) {
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('antialiased', fontMono.variable, 'font-sans', fontSans.variable)}
    >
      <body suppressHydrationWarning>
        <GenericError
          code={500}
          text="Internal error"
        >
          <div className="fixed top-0 left-0 z-50 p-5 xl:p-8">
            <Branding />
          </div>
        </GenericError>
      </body>
    </html>
  );
}
