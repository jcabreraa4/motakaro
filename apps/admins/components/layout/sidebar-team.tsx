'use client';

import { BuildingIcon, ChevronsUpDown } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { Dialog, DialogContent, DialogTrigger } from '@workspace/ui/components/dialog';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';

interface TeamDataProps extends SidebarTeamProps {
  className?: string;
}

function TeamData({ name, plan, logo, className }: TeamDataProps) {
  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage
          src={logo}
          alt={name}
        />
        <AvatarFallback className="rounded-lg">
          <BuildingIcon />
        </AvatarFallback>
      </Avatar>
      <div className={cn('grid flex-1 text-left text-sm leading-tight', className)}>
        <span className="truncate font-medium">{name}</span>
        {plan && <span className="truncate text-xs capitalize">{plan}</span>}
      </div>
    </>
  );
}

interface SidebarTeamProps {
  name: string;
  plan: string;
  logo: string;
}

export function SidebarTeam({ name, plan, logo }: SidebarTeamProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <DialogTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="ring-0! data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <TeamData
                name={name}
                plan={plan}
                logo={logo}
                className="select-none"
              />
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DialogTrigger>
          <DialogContent></DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
