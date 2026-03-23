'use client';

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@workspace/ui/components/sidebar';
import { type LucideIcon, BotIcon, FileTextIcon, ImageIcon, LayoutDashboardIcon, Building2Icon, UsersIcon, ListVideoIcon, HeadsetIcon, ChartColumnBigIcon, PencilRulerIcon } from 'lucide-react';
import { useAppStateStore } from '@/store/state-store';
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
        title: 'Meetings',
        url: '/meetings',
        icon: HeadsetIcon
      },
      {
        title: 'Analytics',
        url: '/analytics',
        icon: ChartColumnBigIcon
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
        title: 'Whiteboards',
        url: '/whiteboards',
        icon: PencilRulerIcon
      },
      {
        title: 'Multimedia',
        url: '/multimedia',
        icon: ImageIcon
      },
      {
        title: 'Resources',
        url: '/resources',
        icon: ListVideoIcon
      }
    ]
  }
];

export function NavMain() {
  const { segments } = usePathname();
  const setSubroute = useAppStateStore((state) => state.setSubroute);

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
                    onClick={() => setSubroute(null)}
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
