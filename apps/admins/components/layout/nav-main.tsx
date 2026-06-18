'use client';

import Link from 'next/link';

import { Building2Icon, ChartColumnBigIcon, FileTextIcon, HeadsetIcon, ImageIcon, LayoutDashboardIcon, ListVideoIcon, type LucideIcon, PencilRulerIcon, UsersIcon, WalletIcon } from 'lucide-react';

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';

import { useChatbot } from '@/hooks/use-chatbot';
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
    title: 'Agency',
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
      },
      {
        title: 'Meetings',
        url: '/meetings',
        icon: HeadsetIcon
      },
      {
        title: 'Resources',
        url: '/resources',
        icon: ListVideoIcon
      }
    ]
  },
  {
    title: 'Internal',
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
      },
      {
        title: 'Whiteboards',
        url: '/whiteboards',
        icon: PencilRulerIcon
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
        title: 'Invoices',
        url: '/invoices',
        icon: WalletIcon
      }
    ]
  }
];

export function NavMain() {
  const { section } = useLocation();
  const { handleChatbot } = useChatbot();

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
                    onClick={handleChatbot}
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
