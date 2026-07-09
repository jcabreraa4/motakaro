'use client';
import Link from 'next/link';
import { useState } from 'react';

import { MenuIcon, XIcon } from 'lucide-react';
import { motion } from 'motion/react';

import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

import { SectionContent, SectionInner, SectionWrapper } from '@/components/layout/app-section';
import { Branding } from '@/components/motakaro/branding';
import { ContactLink } from '@/components/motakaro/contact-link';
import { useLocation } from '@/hooks/use-location';

const clients = process.env.NEXT_PUBLIC_CLIENTS_URL!;

interface Item {
  url: string;
  title: string;
}

const items: Item[] = [
  {
    url: '/',
    title: 'Home'
  },
  {
    url: '/contact',
    title: 'Contact'
  },
  {
    url: '/playbook',
    title: 'Playbook'
  },
  {
    url: '/resources',
    title: 'Resources'
  }
];

interface TableItemProps {
  text: string;
  isActive?: boolean;
  onClick?: () => void;
}

function TableItem({ text, isActive, onClick }: TableItemProps) {
  return (
    <span
      onClick={onClick}
      className={cn('cursor-pointer text-lg font-semibold', isActive && 'text-motakaro')}
    >
      {text}
    </span>
  );
}

interface TableProps {
  isActive: (url: string) => boolean;
  className?: string;
}

function DesktopTable({ isActive, className }: TableProps) {
  return (
    <div className={cn('items-center gap-5', className)}>
      {items.map((item) => (
        <Link
          key={item.url}
          href={item.url}
        >
          <TableItem
            text={item.title}
            isActive={isActive(item.url)}
          />
        </Link>
      ))}
      <TableItem
        text="Clients"
        onClick={() => window.open(clients, '_blank')}
      />
    </div>
  );
}

function MobileTable({ isActive, className }: TableProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {open ? <XIcon /> : <MenuIcon />}
      </Button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full flex w-full flex-col gap-4 border bg-background p-5 shadow-lg"
        >
          {items.map((item) => (
            <Link
              key={item.url}
              href={item.url}
            >
              <TableItem
                text={item.title}
                isActive={isActive(item.url)}
                onClick={() => setOpen(false)}
              />
            </Link>
          ))}
          <TableItem
            text="Clients"
            onClick={() => {
              window.open(clients, '_blank');
              setOpen(false);
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

export function AppNavbar() {
  const { section } = useLocation();

  function isActive(url: string) {
    if (!section && '/' === url) return true;
    else if (`/${section}` === url) return true;
    return false;
  }

  return (
    <SectionWrapper>
      <SectionInner className="lg:py-5">
        <SectionContent className="flex items-center justify-between">
          <Branding />
          <DesktopTable
            isActive={isActive}
            className="hidden lg:flex"
          />
          <MobileTable
            isActive={isActive}
            className="lg:hidden"
          />
          <ContactLink className="hidden lg:flex" />
        </SectionContent>
      </SectionInner>
    </SectionWrapper>
  );
}
