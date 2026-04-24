import { ConvexProvider } from '@/components/providers/convex-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { TooltipProvider } from '@workspace/ui/components/tooltip';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from '@workspace/ui/components/sonner';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { cn } from '@workspace/ui/lib/utils';
import type { Metadata } from 'next';
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
  description: 'GTM Agency',
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
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="light"
        >
          <ConvexProvider>
            <TooltipProvider>
              {children}
              <Toaster />
              <SpeedInsights />
              <Analytics />
            </TooltipProvider>
          </ConvexProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
