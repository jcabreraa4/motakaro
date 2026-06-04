'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { MenuIcon, MoonIcon, SunIcon, XIcon } from 'lucide-react';
import { motion } from 'motion/react';

import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

import { ActionButton } from '@/components/motakaro/action-button';
import { Branding } from '@/components/motakaro/branding';

const clientsApp = 'https://clients.motakaro.com';

interface Section {
  url: string;
  name: string;
}

const sections: Section[] = [
  {
    url: '/',
    name: 'Home'
  },
  {
    url: '/contact',
    name: 'Contact'
  },
  {
    url: '/playbook',
    name: 'Playbook'
  },
  {
    url: '/resources',
    name: 'Resources'
  }
];

export function ThemeButton({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size="icon"
      variant="outline"
      className={cn('cursor-pointer', className)}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
    </Button>
  );
}

export function AppNavbar() {
  const pathname = usePathname();

  const [openNavbar, setOpenNavbar] = useState(false);

  return (
    <div className="pb-14 xl:pb-18">
      <nav className="fixed top-0 left-0 z-50 flex h-18 w-full items-center bg-black text-white shadow-md">
        <section className="container mx-auto flex items-center justify-between px-3 md:px-5">
          <Branding />
          <div className="hidden items-center gap-5 select-none md:flex">
            {sections.map((section, index) => (
              <Link
                key={index}
                href={section.url}
                className={cn('relative text-lg font-semibold transition-colors after:absolute after:right-0 after:-bottom-1 after:left-0 after:block after:h-0.75 after:origin-left after:rounded after:bg-motakaro after:transition-transform after:duration-200 after:content-[""]', pathname == section.url ? 'text-motakaro' : 'after:scale-x-0 hover:text-motakaro hover:after:scale-x-100')}
              >
                {section.name}
              </Link>
            ))}
            <a
              className="relative cursor-pointer text-lg font-semibold transition-colors after:absolute after:right-0 after:-bottom-1 after:left-0 after:block after:h-0.75 after:origin-left after:scale-x-0 after:rounded after:bg-motakaro after:transition-transform after:duration-200 after:content-[''] hover:text-motakaro hover:after:scale-x-100"
              onClick={() => window.open(clientsApp, '_blank')}
            >
              Clients
            </a>
          </div>
          <div className="flex items-center gap-3 md:gap-3">
            <ThemeButton className="border-[#262626] bg-[#0B0B0B] text-white hover:bg-[#131313] hover:text-white" />
            <div className="hidden xl:block">
              <ActionButton />
            </div>
            <button
              className="cursor-pointer md:hidden"
              onClick={() => setOpenNavbar(!openNavbar)}
            >
              {openNavbar ? <XIcon size={30} /> : <MenuIcon size={30} />}
            </button>
          </div>
        </section>
        {openNavbar && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 flex w-full flex-col items-center space-y-4 bg-black py-5 text-white shadow-md md:hidden"
          >
            {sections.map((section, index) => (
              <Link
                key={index}
                onClick={() => setOpenNavbar(false)}
                href={section.url}
                className={cn(`text-lg font-semibold transition hover:text-motakaro`, pathname == section.url && 'text-motakaro')}
              >
                {section.name}
              </Link>
            ))}
            <a
              className="cursor-pointer text-lg font-semibold transition hover:text-motakaro"
              onClick={() => window.open(clientsApp, '_blank')}
            >
              Clients
            </a>
          </motion.div>
        )}
      </nav>
    </div>
  );
}
