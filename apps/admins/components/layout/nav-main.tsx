'use client';

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@workspace/ui/components/sidebar';
import { BotIcon, FileTextIcon, ImageIcon, LayoutDashboardIcon, Building2Icon, UsersIcon, type LucideIcon } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import { usePathname } from '@/hooks/use-pathname';
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
        title: 'Chatbots',
        url: '/chatbots',
        icon: BotIcon
      }
    ]
  },
  {
    title: 'Database',
    items: [
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
  },
  {
    title: 'Storage',
    items: [
      {
        title: 'Documents',
        url: '/documents',
        icon: FileTextIcon
      },
      {
        title: 'Multimedia',
        url: '/multimedia',
        icon: ImageIcon
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
          <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
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
                      <span>{item.title}</span>
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
