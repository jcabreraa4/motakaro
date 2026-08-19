import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { Toaster } from '@workspace/ui/components/sonner';
import { TooltipProvider } from '@workspace/ui/components/tooltip';
import '@workspace/ui/globals.css';
import { cn } from '@workspace/ui/lib/utils';

import { OpenPanel } from '@/components/external/open-panel';
import { ConvexProvider } from '@/components/providers/convex-provider';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans'
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'Motakaro',
  description: 'B2B GTM Engineering',
  icons: {
    icon: '/motakaro.webp'
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('antialiased', fontMono.variable, 'font-sans', geist.variable)}
    >
      <body>
        <ConvexProvider>
          <TooltipProvider>
            <Toaster />
            {children}
            <Analytics />
            <SpeedInsights />
            <OpenPanel />
          </TooltipProvider>
        </ConvexProvider>
      </body>
    </html>
  );
}
