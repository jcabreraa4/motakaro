'use client';

import { ChevronsUpDown, CircleUserIcon, LogOutIcon, UserRoundIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@workspace/ui/components/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { DropdownThemeButton } from '@workspace/ui/custom/theme-buttons';
import { cn } from '@workspace/ui/lib/utils';
import { useClerk } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { dark } from '@clerk/themes';

interface UserDataProps {
  name: string;
  email: string;
  avatar: string;
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
  const { isMobile } = useSidebar();
  const { signOut, openUserProfile } = useClerk();
  const { theme } = useTheme();

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
              <DropdownThemeButton />
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
