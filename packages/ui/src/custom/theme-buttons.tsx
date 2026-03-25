'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { ButtonSize } from '@workspace/ui/types/button';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { Button } from '@workspace/ui/components/button';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@workspace/ui/lib/utils';
import { useTheme } from 'next-themes';
import { flushSync } from 'react-dom';

interface SquareThemeButtonProps {
  size?: ButtonSize;
  className?: string;
}

export function SquareThemeButton({ size = 'icon-lg', className }: SquareThemeButtonProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Button
      size={size}
      variant="outline"
      className={cn('cursor-pointer text-black dark:text-white', className)}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {mounted ? theme === 'dark' ? <SunIcon /> : <MoonIcon /> : <span className="size-5" />}
    </Button>
  );
}

export function RectangleThemeButton({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Button
      variant="outline"
      className={cn('min-w-40 cursor-pointer', className)}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {mounted ? (
        <>
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </>
      ) : (
        <span className="size-5" />
      )}
    </Button>
  );
}

export function DropdownThemeButton({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenuItem
      className={cn('cursor-pointer', className)}
      onClick={() => setTheme(theme == 'light' ? 'dark' : 'light')}
    >
      {theme == 'dark' ? <SunIcon /> : <MoonIcon />}
      {theme == 'dark' ? 'Light Mode' : 'Dark Mode'}
    </DropdownMenuItem>
  );
}

interface AnimatedThemeButtonProps {
  size?: ButtonSize;
  className?: string;
  duration?: number;
}

export function AnimatedThemeButton({ size = 'icon-lg', className, duration = 500 }: AnimatedThemeButtonProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => setMounted(true), []);

  async function toggleTheme() {
    const newTheme = isDark ? 'light' : 'dark';
    if (!buttonRef.current || !document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return setTheme(newTheme);
    }
    await document.startViewTransition(() => flushSync(() => setTheme(newTheme))).ready;
    const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${Math.hypot(Math.max(left, window.innerWidth - left), Math.max(top, window.innerHeight - top))}px at ${x}px ${y}px)`] }, { duration, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' });
  }

  return (
    <Button
      size={size}
      ref={buttonRef}
      variant="outline"
      className={cn('cursor-pointer', isDark ? 'text-white' : 'text-black', className)}
      onClick={toggleTheme}
    >
      {mounted ? isDark ? <SunIcon /> : <MoonIcon /> : <span className="size-5" />}
    </Button>
  );
}
