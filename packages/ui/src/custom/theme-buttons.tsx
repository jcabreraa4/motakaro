'use client';

import { useTheme } from 'next-themes';
import { useRef } from 'react';
import { flushSync } from 'react-dom';

import { MoonIcon, SunIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { cn } from '@workspace/ui/lib/utils';
import { ButtonSize, ButtonVariant } from '@workspace/ui/types/button';

interface SquareThemeButtonProps {
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
}

export function SquareThemeButton({ size = 'icon-lg', variant = 'outline', className }: SquareThemeButtonProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size={size}
      variant={variant}
      className={cn('cursor-pointer text-black dark:text-white', className)}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
    </Button>
  );
}

interface HeaderThemeButtonProps extends SquareThemeButtonProps {}

export function HeaderThemeButton({ size = 'icon-sm', variant = 'ghost', className }: HeaderThemeButtonProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size={size}
      variant={variant}
      className={cn('cursor-pointer bg-transparent! text-zinc-500 hover:bg-transparent! dark:text-zinc-400 dark:hover:text-white', className)}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <SunIcon className="hidden size-5 dark:block" />
      <MoonIcon className="size-5 dark:hidden" />
    </Button>
  );
}

interface RectangleThemeButtonProps {
  variant?: ButtonVariant;
  className?: string;
}

export function RectangleThemeButton({ variant = 'outline', className }: RectangleThemeButtonProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={variant}
      className={cn('min-w-40 cursor-pointer', className)}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
      <span className="hidden dark:block">Light Mode</span>
      <span className="dark:hidden">Dark Mode</span>
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
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
      <span className="hidden dark:block">Light Mode</span>
      <span className="dark:hidden">Dark Mode</span>
    </DropdownMenuItem>
  );
}

interface AnimatedThemeButtonProps {
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  duration?: number;
}

export function AnimatedThemeButton({ size = 'icon-lg', variant = 'outline', className, duration = 500 }: AnimatedThemeButtonProps) {
  const { theme, setTheme } = useTheme();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDark = theme === 'dark';

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
      variant={variant}
      className={cn('cursor-pointer', isDark ? 'text-white' : 'text-black', className)}
      onClick={toggleTheme}
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
    </Button>
  );
}
