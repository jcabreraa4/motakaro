'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect } from 'react';

import { useAuth, useClerk } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useMutation, useQuery } from 'convex/react';
import { BellIcon, BuildingIcon, ChevronsUpDown, CircleUserIcon, LogOutIcon, MoonIcon, SunIcon, UserRoundIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';

interface UserDataProps extends NavUserProps {
  className?: string;
}

function UserData({ name, email, avatar, className }: UserDataProps) {
  return (
    <>
      <Avatar>
        <AvatarImage
          src={avatar}
          alt={name}
          className="overflow-hidden"
        />
        <AvatarFallback className="overflow-hidden">
          <UserRoundIcon />
        </AvatarFallback>
      </Avatar>
      <div className={cn('grid flex-1 text-left text-sm leading-tight', className)}>
        <span className="truncate font-medium">{name}</span>
        <span className="truncate text-xs">{email}</span>
      </div>
    </>
  );
}

interface NavUserProps {
  name: string;
  email: string;
  avatar: string;
}

export function NavUser({ name, email, avatar }: NavUserProps) {
  const { isLoaded } = useAuth();
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { signOut, openUserProfile, openOrganizationProfile } = useClerk();

  const client = useQuery(api.clients.clientGet, isLoaded ? {} : 'skip');
  const updateClient = useMutation(api.clients.clientUpdate);

  // Indicate Presence
  useEffect(() => {
    if (!isLoaded) return;
    updateClient({});
    const interval = setInterval(() => updateClient({}), 50000);
    return () => clearInterval(interval);
  }, [isLoaded, updateClient]);

  const displayName = client ? `${client.name} ${client.surname}` : name;
  const displayEmail = client?.email ?? email;
  const displayAvatar = client?.avatar ?? avatar;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              variant="outline"
              className="cursor-pointer bg-sidebar data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserData
                name={displayName}
                email={displayEmail}
                avatar={displayAvatar}
                className="select-none"
              />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={4}
            side={isMobile ? 'bottom' : 'right'}
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserData
                  name={displayName}
                  email={displayEmail}
                  avatar={displayAvatar}
                />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  openUserProfile({
                    appearance: {
                      theme: theme === 'dark' ? dark : undefined
                    }
                  })
                }
              >
                <CircleUserIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  openOrganizationProfile({
                    appearance: {
                      theme: theme === 'dark' ? dark : undefined
                    }
                  })
                }
              >
                <BuildingIcon />
                Organization
              </DropdownMenuItem>
              <Link href="/notifications">
                <DropdownMenuItem className="cursor-pointer">
                  <BellIcon />
                  Notifications
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="cursor-pointer md:hidden"
                onClick={() => setTheme(theme == 'light' ? 'dark' : 'light')}
              >
                <SunIcon className="hidden dark:block" />
                <MoonIcon className="dark:hidden" />
                <span className="hidden dark:block">Light Mode</span>
                <span className="dark:hidden">Dark Mode</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => signOut()}
            >
              <LogOutIcon />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
