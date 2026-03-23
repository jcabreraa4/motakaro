'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { ButtonSize } from '@workspace/ui/types/button';
import { cn } from '@workspace/ui/lib/utils';
import { useTheme } from 'next-themes';

interface SquareThemeButtonProps {
  size?: ButtonSize;
  className?: string;
}

export function SquareThemeButton({ size = 'icon-lg', className }: SquareThemeButtonProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size={size}
      variant="outline"
      className={cn('cursor-pointer', theme == 'light' ? 'text-black' : 'text-white', className)}
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
