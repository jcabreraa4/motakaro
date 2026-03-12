import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ConvexProvider } from '@/components/providers/convex-provider';
import { TooltipProvider } from '@workspace/ui/components/tooltip';
import { Toaster } from '@workspace/ui/components/sonner';
import { cn } from '@workspace/ui/lib/utils';
import '@workspace/ui/globals.css';

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
  description: 'Motakaro Clients',
  icons: {
    icon: '/motakaro.webp'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('antialiased', fontMono.variable, 'font-sans', fontSans.variable)}
    >
      <body suppressHydrationWarning>
        <ClerkProvider
          dynamic
          taskUrls={{
            'choose-organization': '/org-selection'
          }}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexProvider>
              <TooltipProvider>
                {children}
                <Toaster />
              </TooltipProvider>
            </ConvexProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
