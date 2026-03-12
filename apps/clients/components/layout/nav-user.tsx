'use client';

import { BuildingIcon, ChevronsUpDown, CircleUserIcon, LogOutIcon, MoonIcon, SunIcon, UserRoundIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@workspace/ui/components/sidebar';
import { useClerk } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

interface UserDataProps {
  name: string;
  email: string;
  avatar: string;
}

function UserData({ name, email, avatar }: UserDataProps) {
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
      <div className="grid flex-1 text-left text-sm leading-tight">
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
  const { isMobile } = useSidebar();
  const { signOut, openUserProfile, openOrganizationProfile } = useClerk();
  const { theme, setTheme } = useTheme();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserData
                name={name}
                email={email}
                avatar={avatar}
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
                  name={name}
                  email={email}
                  avatar={avatar}
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
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setTheme(theme == 'light' ? 'dark' : 'light')}
              >
                {theme == 'light' ? <SunIcon /> : <MoonIcon />}
                {theme == 'light' ? 'Light Mode' : 'Dark Mode'}
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
