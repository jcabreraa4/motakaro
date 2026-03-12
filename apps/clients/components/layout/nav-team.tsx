'use client';

import { useEffect, useState } from 'react';
import { BuildingIcon, ChevronsUpDown } from 'lucide-react';
import { useClerk, useOrganization, useOrganizationList } from '@clerk/nextjs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@workspace/ui/components/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { dark } from '@clerk/themes';

function TeamSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="hover:bg-inherit active:bg-inherit data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="flex h-8 w-8 items-center justify-center rounded-lg">CN</Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Organization</span>
            <span className="truncate text-xs">Organization Plan</span>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

interface TeamDataProps {
  name: string;
  plan: string;
  logo: string;
}

function TeamData({ name, plan, logo }: TeamDataProps) {
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
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{name}</span>
        <span className="truncate text-xs">{plan}</span>
      </div>
    </>
  );
}

type Team = {
  id: string;
  name: string;
  logo: string;
  plan: string;
};

interface NavTeamProps {
  teams: Team[];
}

export function NavTeam({ teams }: NavTeamProps) {
  const { isMobile } = useSidebar();
  const { setActive } = useOrganizationList();
  const { organization } = useOrganization();
  const { openOrganizationProfile } = useClerk();
  const { theme } = useTheme();

  const firstTeam = teams[0];
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);

  useEffect(() => {
    if (organization?.id) {
      const match = teams.find((team) => team.id === organization.id);
      setActiveTeam(match ?? teams[0] ?? null);
    }
  }, [organization?.id]);

  async function handleSwitch(team: Team) {
    setActiveTeam(team);
    if (setActive) {
      await setActive({ organization: team.id }).finally(() => {
        toast.success('Organization switched successfully.');
      });
    }
  }

  if (!firstTeam) return <TeamSkeleton />;

  if (teams.length === 1) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            onClick={() =>
              openOrganizationProfile({
                appearance: {
                  theme: theme === 'dark' ? dark : undefined
                }
              })
            }
          >
            <TeamData
              name={firstTeam.name}
              plan={firstTeam.plan}
              logo={firstTeam.logo}
            />
            <ChevronsUpDown className="ml-auto" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeTeam) return <TeamSkeleton />;

  const otherTeams = teams.filter((team) => team.id !== activeTeam.id);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <TeamData
                name={activeTeam.name}
                plan={activeTeam.plan}
                logo={activeTeam.logo}
              />
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">Other Organizations</DropdownMenuLabel>
            {otherTeams.map((team) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => handleSwitch(team)}
                className="cursor-pointer gap-2 p-2"
              >
                <TeamData
                  name={team.name}
                  plan={team.plan}
                  logo={team.logo}
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
