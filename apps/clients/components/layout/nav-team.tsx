'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { useClerk, useOrganization, useOrganizationList } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useQuery } from 'convex/react';
import { BuildingIcon, ChevronsUpDown } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import { Organization } from '@workspace/backend/schema';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@workspace/ui/components/sidebar';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { cn } from '@workspace/ui/lib/utils';

function TeamSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="hover:bg-inherit active:bg-inherit data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Skeleton className="h-8 w-8 rounded-2xl border" />
          <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
            <Skeleton className="h-4 rounded-sm border" />
            <Skeleton className="h-2.5 w-20 rounded-sm border" />
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

interface TeamDataProps extends TeamSettingsProps {
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

interface TeamSettingsProps {
  name: string;
  plan: string;
  logo: string;
}

function TeamSettings({ name, plan, logo }: TeamSettingsProps) {
  const { theme } = useTheme();
  const { openOrganizationProfile } = useClerk();

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
            name={name}
            plan={plan}
            logo={logo}
            className="select-none"
          />
          <ChevronsUpDown className="ml-auto size-4.5" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

interface TeamSelectorProps {
  organizations: Organization[];
  activeOrganization: Organization;
  setActiveOrganization: (organization: Organization) => void;
}

function TeamSelector({ organizations, activeOrganization, setActiveOrganization }: TeamSelectorProps) {
  const { isMobile } = useSidebar();
  const { setActive } = useOrganizationList();

  const otherOrganizations = organizations.filter((organization) => organization._id !== activeOrganization._id);

  async function handleSwitch(organization: Organization) {
    setActiveOrganization(organization);
    if (setActive) {
      await setActive({ organization: organization.clerkId })
        .then(() => toast.success('Organization switched successfully.'))
        .catch(() => toast.error('An internal error has ocurred.'));
    }
  }

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
              <TeamData
                name={activeOrganization.name}
                plan={activeOrganization.plan}
                logo={activeOrganization.logo}
                className="select-none"
              />
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            sideOffset={4}
            side={isMobile ? 'bottom' : 'right'}
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground select-none">Other Organizations</DropdownMenuLabel>
            {otherOrganizations.map((organization) => (
              <DropdownMenuItem
                key={organization._id}
                onClick={() => handleSwitch(organization)}
                className="cursor-pointer gap-2 p-2"
              >
                <TeamData
                  name={organization.name}
                  plan={organization.plan}
                  logo={organization.logo}
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function NavTeam({ teams }: { teams: Organization[] }) {
  const { organization } = useOrganization();

  const organizations = useQuery(api.organizations.clientList);

  const [activeOrganization, setActiveOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    if (organization?.id && organizations && organizations[0]) {
      const active = organizations.find((org) => org.clerkId === organization.id);
      if (active) setActiveOrganization(active);
    }
  }, [organization?.id, organizations]);

  if (!activeOrganization && teams.length === 1) {
    return (
      <TeamSettings
        name={teams[0]!.name}
        plan={teams[0]!.plan}
        logo={teams[0]!.logo}
      />
    );
  }

  if (!activeOrganization) return <TeamSkeleton />;

  if (!organizations || organizations.length === 1) {
    return (
      <TeamSettings
        name={activeOrganization.name}
        plan={activeOrganization.plan}
        logo={activeOrganization.logo}
      />
    );
  }

  return (
    <TeamSelector
      organizations={organizations}
      activeOrganization={activeOrganization}
      setActiveOrganization={setActiveOrganization}
    />
  );
}
