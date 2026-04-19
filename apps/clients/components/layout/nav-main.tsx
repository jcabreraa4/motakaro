'use client';

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@workspace/ui/components/sidebar';
import { type LucideIcon, LayoutDashboardIcon, MessageSquareIcon } from 'lucide-react';
import { usePathname } from '@/hooks/use-pathname';
import { cn } from '@workspace/ui/lib/utils';
import Link from 'next/link';

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
        title: 'Messages',
        url: '/messages',
        icon: MessageSquareIcon
      }
    ]
  }
];

export function NavMain() {
  const { segments } = usePathname();

  function isActive(url: string) {
    if (`/${segments[0]}` === url) return true;
    return false;
  }

  return (
    <>
      {sections.map((section, index) => (
        <SidebarGroup key={index}>
          <SidebarGroupLabel className="pointer-events-none select-none">{section.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section.items?.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
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
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
