'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';

import { useAuth, useClerk } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useQuery } from 'convex/react';
import { ChevronsUpDown, CircleUserIcon, LogOutIcon, MoonIcon, SettingsIcon, SunIcon, UserRoundIcon } from 'lucide-react';

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
  avatar?: string;
}

export function NavUser({ name, email, avatar }: NavUserProps) {
  const { isLoaded } = useAuth();
  const { isMobile } = useSidebar();
  const { signOut, openUserProfile } = useClerk();
  const { theme, setTheme } = useTheme();

  const employee = useQuery(api.employees.get, isLoaded ? {} : 'skip');

  const displayName = employee ? `${employee.name} ${employee.surname}` : name;
  const displayEmail = employee?.email ?? email;
  const displayAvatar = employee?.avatar ?? avatar;

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
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
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
              <Link href="/settings">
                <DropdownMenuItem className="cursor-pointer">
                  <SettingsIcon />
                  Settings
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="cursor-pointer"
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
