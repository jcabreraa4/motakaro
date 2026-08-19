import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ClerkProvider } from '@clerk/nextjs';
import { OpenPanelComponent } from '@openpanel/nextjs';
import { Analytics } from '@vercel/analytics/next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import '@workspace/tiptap/tiptap.css';
import { Toaster } from '@workspace/ui/components/sonner';
import { TooltipProvider } from '@workspace/ui/components/tooltip';
import '@workspace/ui/globals.css';
import { cn } from '@workspace/ui/lib/utils';

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
                  <OpenPanelComponent
                    apiUrl="/api/op"
                    scriptUrl="/api/op/op1.js"
                    clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID!}
                    trackScreenViews={true}
                    trackOutgoingLinks={true}
                  />
                </TooltipProvider>
              </ConvexProvider>
            </ThemeProvider>
          </NuqsAdapter>
        </ClerkProvider>
      </body>
    </html>
  );
}
