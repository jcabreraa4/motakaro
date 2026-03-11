'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { useTheme } from 'next-themes';
import { cn } from '@workspace/ui/lib/utils';

export function SquareThemeButton({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size="icon-lg"
      variant="outline"
      className={cn('cursor-pointer', className)}
      onClick={() => setTheme(theme == 'light' ? 'dark' : 'light')}
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
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
