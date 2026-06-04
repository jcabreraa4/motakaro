'use client';

import { Geist, Geist_Mono } from 'next/font/google';

import '@workspace/ui/globals.css';
import { cn } from '@workspace/ui/lib/utils';

import { Branding } from '@/components/motakaro/branding';

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
        <main className="flex h-screen flex-col items-center justify-center gap-5 bg-[#0A0A0A] text-white">
          <div className="fixed top-0 left-0 z-50 p-5 xl:p-8">
            <Branding />
          </div>
          <section className="pointer-events-none flex h-14 w-full justify-center gap-5 select-none">
            <div className="flex h-full items-center border-e-2 pe-5">
              <p className="text-3xl font-semibold">500</p>
            </div>
            <div className="flex h-full flex-col justify-center gap-2">
              <p className="text-3xl font-semibold">Internal error</p>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
