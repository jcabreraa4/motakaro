'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { useClerk, useOrganization, useOrganizationList } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useQuery } from 'convex/react';
import { BuildingIcon, ChevronsUpDown } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@workspace/backend/_generated/api';
import { Company } from '@workspace/backend/schema';
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
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

interface TeamSelectorProps {
  companies: Company[];
  activeCompany: Company;
  setActiveCompany: (company: Company) => void;
}

function TeamSelector({ companies, activeCompany, setActiveCompany }: TeamSelectorProps) {
  const { isMobile } = useSidebar();
  const { setActive } = useOrganizationList();

  const otherCompanies = companies.filter((company) => company._id !== activeCompany._id);

  async function handleSwitch(company: Company) {
    setActiveCompany(company);
    if (setActive) {
      await setActive({ organization: company.clerkId }).finally(() => {
        toast.success('Organization switched successfully.');
      });
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
                name={activeCompany.name}
                plan={activeCompany.plan}
                logo={activeCompany.logo}
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
            {otherCompanies.map((company) => (
              <DropdownMenuItem
                key={company._id}
                onClick={() => handleSwitch(company)}
                className="cursor-pointer gap-2 p-2"
              >
                <TeamData
                  name={company.name}
                  plan={company.plan}
                  logo={company.logo}
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function NavTeam({ teams }: { teams: Company[] }) {
  const { organization } = useOrganization();

  const companies = useQuery(api.companies.clientList);

  const [activeCompany, setActiveCompany] = useState<Company | null>(null);

  useEffect(() => {
    if (organization?.id && companies && companies[0]) {
      const active = companies.find((company) => company.clerkId === organization.id);
      if (active) setActiveCompany(active);
    }
  }, [organization?.id, companies]);

  if (!activeCompany && teams.length === 1) {
    return (
      <TeamSettings
        name={teams[0]!.name}
        plan={teams[0]!.plan}
        logo={teams[0]!.logo}
      />
    );
  }

  if (!activeCompany) return <TeamSkeleton />;

  if (!companies || companies.length === 1) {
    return (
      <TeamSettings
        name={activeCompany.name}
        plan={activeCompany.plan}
        logo={activeCompany.logo}
      />
    );
  }

  return (
    <TeamSelector
      companies={companies}
      activeCompany={activeCompany}
      setActiveCompany={setActiveCompany}
    />
  );
}
