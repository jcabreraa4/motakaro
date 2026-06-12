'use client';

import Link from 'next/link';

import { HeadsetIcon, ImageIcon, LayoutDashboardIcon, type LucideIcon, MessageSquareIcon } from 'lucide-react';

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
    title: 'Dashboard',
    items: [
      {
        title: 'Overview',
        url: '/overview',
        icon: LayoutDashboardIcon
      },
      {
        title: 'Multimedia',
        url: '/multimedia',
        icon: ImageIcon
      }
    ]
  },
  {
    title: 'Contact',
    items: [
      {
        title: 'Meetings',
        url: '/meetings',
        icon: HeadsetIcon
      },
      {
        title: 'Messages',
        url: '/messages',
        icon: MessageSquareIcon
      }
    ]
  }
];

export function NavMain() {
  const { section } = useLocation();

  function isActive(url: string) {
    if (`/${section}` === url) return true;
    return false;
  }

  return (
    <>
      {sections.map((section, index) => (
        <SidebarGroup key={index}>
          <SidebarGroupLabel className="pointer-events-none select-none">{section.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={cn(isActive(item.url) ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground active:bg-primary active:text-primary-foreground' : 'text-primary/85')}
                  >
                    <Link href={item.url}>
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
