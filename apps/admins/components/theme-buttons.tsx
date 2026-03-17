'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { useTheme } from 'next-themes';

export function SquareThemeButton({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size="icon-lg"
      variant="outline"
      className={cn('cursor-pointer', className)}
      onClick={() => setTheme(theme == 'light' ? 'dark' : 'light')}
    >
      {theme == 'light' ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}

export function RectangleThemeButton({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="outline"
      className={cn('min-w-40 cursor-pointer', className)}
      onClick={() => setTheme(theme == 'light' ? 'dark' : 'light')}
    >
      {theme == 'light' ? <SunIcon /> : <MoonIcon />}
      {theme == 'light' ? 'Light Mode' : 'Dark Mode'}
    </Button>
  );
}
