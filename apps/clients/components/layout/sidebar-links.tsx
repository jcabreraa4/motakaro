'use client';

import type { Route } from 'next';
import Link from 'next/link';

import { Building2Icon, ChartColumnBigIcon, FileTextIcon, HeadsetIcon, ImageIcon, LayoutDashboardIcon, type LucideIcon, UsersIcon } from 'lucide-react';

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';

import { useLocation } from '@/hooks/use-location';

type Section = {
  title: string;
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
};

const sections: Section[] = [
  {
    title: 'Internal',
    items: [
      {
        title: 'Overview',
        url: '/overview',
        icon: LayoutDashboardIcon
      },
      {
        title: 'Meetings',
        url: '/meetings',
        icon: HeadsetIcon
      }
    ]
  },
  {
    title: 'Storage',
    items: [
      {
        title: 'Multimedia',
        url: '/multimedia',
        icon: ImageIcon
      },
      {
        title: 'Documents',
        url: '/documents',
        icon: FileTextIcon
      }
    ]
  },
  {
    title: 'Database',
    items: [
      {
        title: 'Analytics',
        url: '/analytics',
        icon: ChartColumnBigIcon
      },
      {
        title: 'Contacts',
        url: '/contacts',
        icon: UsersIcon
      },
      {
        title: 'Companies',
        url: '/companies',
        icon: Building2Icon
      }
    ]
  }
];

export function SidebarLinks() {
  const { routes } = useLocation();

  function isSection(url: string) {
    if (`/${routes[0]}` === url && !routes[1]) return true;
    return false;
  }

  function isSubroute(url: string) {
    if (`/${routes[0]}` === url && routes[1]) return true;
    return false;
  }

  return (
    <>
      {sections.map((section, index) => (
        <SidebarGroup key={index}>
          <SidebarGroupLabel className="select-none">{section.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(isSection(item.url) ? 'bg-primary! text-white! dark:text-black!' : isSubroute(item.url) && 'border border-black dark:border-white')}
                  >
                    <Link href={item.url as Route}>
                      <item.icon className="size-4" />
                      <span className="select-none">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
