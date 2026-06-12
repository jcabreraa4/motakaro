import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { Toaster } from '@workspace/ui/components/sonner';
import { TooltipProvider } from '@workspace/ui/components/tooltip';
import '@workspace/ui/globals.css';
import { cn } from '@workspace/ui/lib/utils';
import '@workspace/ui/tiptap.css';

import { ConvexProvider } from '@/components/providers/convex-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';

const fontSans = Geist({
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
      className={cn('antialiased', fontMono.variable, 'font-sans', fontSans.variable)}
    >
      <body suppressHydrationWarning>
        <ClerkProvider>
          <NuqsAdapter>
            <ThemeProvider
              enableSystem
              attribute="class"
              defaultTheme="dark"
              disableTransitionOnChange
            >
              <ConvexProvider>
                <TooltipProvider>
                  {children}
                  <Toaster />
                  <Analytics />
                </TooltipProvider>
              </ConvexProvider>
            </ThemeProvider>
          </NuqsAdapter>
        </ClerkProvider>
      </body>
    </html>
  );
}
