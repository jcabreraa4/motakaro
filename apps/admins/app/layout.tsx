import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Analytics } from '@vercel/analytics/next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import '@workspace/tiptap/tiptap.css';
import { Toaster } from '@workspace/ui/components/sonner';
import { TooltipProvider } from '@workspace/ui/components/tooltip';
import '@workspace/ui/globals.css';
import { cn } from '@workspace/ui/lib/utils';

import { OpenPanel } from '@/components/external/open-panel';
import { ClerkProvider } from '@/components/providers/clerk-provider';
import { ConvexProvider } from '@/components/providers/convex-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';

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
  description: 'Motakaro Admins',
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
        <ClerkProvider>
          <NuqsAdapter>
            <ThemeProvider>
              <ConvexProvider>
                <TooltipProvider>
                  <Toaster />
                  {children}
                  <Analytics />
                  <OpenPanel />
                </TooltipProvider>
              </ConvexProvider>
            </ThemeProvider>
          </NuqsAdapter>
        </ClerkProvider>
      </body>
    </html>
  );
}
