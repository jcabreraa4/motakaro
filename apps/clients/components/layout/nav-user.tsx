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
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage
          src={avatar}
          alt={name}
        />
        <AvatarFallback className="rounded-lg">
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

  const contact = useQuery(api.contacts.clientGet, isLoaded ? {} : 'skip');
  const updateContact = useMutation(api.contacts.clientUpdate);

  // Indicate Presence
  useEffect(() => {
    if (!isLoaded) return;
    updateContact({});
    const interval = setInterval(() => updateContact({}), 50000);
    return () => clearInterval(interval);
  }, [isLoaded, updateContact]);

  // Select Data
  const displayName = contact ? `${contact.name} ${contact.surname}` : name;
  const displayEmail = contact?.email ?? email;
  const displayAvatar = contact?.avatar ?? avatar;

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
