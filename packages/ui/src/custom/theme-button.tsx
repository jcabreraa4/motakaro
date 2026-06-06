import { useTheme } from 'next-themes';

import { MoonIcon, SunIcon } from 'lucide-react';

import { HeaderButton } from '@workspace/ui/custom/header-button';

export function ThemeButton({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <HeaderButton
      className={className}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <SunIcon className="hidden size-5 dark:block" />
      <MoonIcon className="size-5 dark:hidden" />
    </HeaderButton>
  );
}
