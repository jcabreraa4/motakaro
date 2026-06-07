'use client';

import Link from 'next/link';

import { CircleUserIcon, GhostIcon, type LucideIcon, PaletteIcon, ShieldIcon } from 'lucide-react';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';

import { usePathname } from '@/hooks/use-pathname';

type Item = {
  title: string;
  url: string;
  icon: LucideIcon;
};

const items: Item[] = [
  {
    title: 'Account',
    url: '/settings',
    icon: CircleUserIcon
  },
  {
    title: 'Security',
    url: '/settings/security',
    icon: ShieldIcon
  },
  {
    title: 'Assistant',
    url: '/settings/assistant',
    icon: GhostIcon
  },
  {
    title: 'Appearance',
    url: '/settings/appearance',
    icon: PaletteIcon
  }
];

export function SettingsMenu() {
  const { segments } = usePathname();

  function isActive(url: string) {
    if (!segments[1] && url === '/settings') return true;
    if (`/settings/${segments[1]}` === url) return true;
    return false;
  }

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            className={cn(isActive(item.url) && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground active:bg-primary active:text-primary-foreground')}
          >
            <Link href={item.url}>
              <item.icon className="size-4" />
              <span className="select-none">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
