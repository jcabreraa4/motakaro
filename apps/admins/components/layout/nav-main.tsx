'use client';

import Link from 'next/link';

import { Building2Icon, ChartColumnBigIcon, FileTextIcon, HeadsetIcon, ImageIcon, LayoutDashboardIcon, ListVideoIcon, type LucideIcon, MessageSquareIcon, PencilRulerIcon, UsersIcon, WalletIcon } from 'lucide-react';

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';

import { usePathname } from '@/hooks/use-pathname';
import { useMainStore } from '@/store/main-store';

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
        title: 'Analytics',
        url: '/analytics',
        icon: ChartColumnBigIcon
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
      },
      {
        title: 'Payments',
        url: '/payments',
        icon: WalletIcon
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
  const setSubroute = useMainStore((state) => state.setSubroute);

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
                    onClick={() => setSubroute(null)}
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
