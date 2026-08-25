import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@workspace/ui/components/sidebar';

import { SidebarLinks } from '@/components/layout/sidebar-links';
import { SidebarTeam } from '@/components/layout/sidebar-team';
import { SidebarUser } from '@/components/layout/sidebar-user';
import { getTeams } from '@/server/get-teams';
import { getUser } from '@/server/get-user';

export async function SidebarMain({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await getUser();
  const teams = await getTeams();

  return (
    <Sidebar
      {...props}
      variant="inset"
    >
      <SidebarHeader>
        <SidebarTeam teams={teams || []} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarLinks />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser
          name={`${user!.name} ${user!.surname}`}
          email={user!.email}
          avatar={user!.avatar}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
