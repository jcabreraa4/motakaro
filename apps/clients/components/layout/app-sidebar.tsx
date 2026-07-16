import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';

import { NavMain } from '@/components/layout/nav-main';
import { NavTeam } from '@/components/layout/nav-team';
import { NavUser } from '@/components/layout/nav-user';
import { getTeams } from '@/server/get-teams';
import { getUser } from '@/server/get-user';

export async function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await getUser();
  const teams = await getTeams();

  return (
    <Sidebar
      {...props}
      collapsible="icon"
      className={cn('border-none py-2', className)}
    >
      <SidebarHeader>
        <NavTeam teams={teams || []} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          name={`${user!.name} ${user!.surname}`}
          email={user!.email}
          avatar={user!.avatar}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
