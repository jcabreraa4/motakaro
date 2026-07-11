'use client';

import Link from 'next/link';
import { useState } from 'react';

import { MenuIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet';
import { cn } from '@workspace/ui/lib/utils';

import { Paragraph } from '@/components/layout/app-heading';
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
  className?: string;
}

function TableItem({ text, isActive, onClick, className }: TableItemProps) {
  return (
    <div onClick={onClick}>
      <Paragraph className={cn('cursor-pointer', isActive && 'text-motakaro', className)}>{text}</Paragraph>
    </div>
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
      <Sheet
        open={open}
        onOpenChange={setOpen}
      >
        <SheetTrigger asChild>
          <Button
            asChild
            size="icon"
            variant="ghost"
            className="cursor-pointer"
          >
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle></SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-5 px-5 py-2">
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
          </div>
        </SheetContent>
      </Sheet>
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
