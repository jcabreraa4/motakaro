import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@workspace/ui/components/sidebar';

import { NavMain } from '@/components/layout/nav-main';
import { NavTeam } from '@/components/layout/nav-team';
import { NavUser } from '@/components/layout/nav-user';
import { getUser } from '@/server/get-user';

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await getUser();

  return (
    <Sidebar
      {...props}
      variant="inset"
    >
      <SidebarHeader>
        <NavTeam
          name="Motakaro"
          plan="Onboarding"
          logo="/motakaro.webp"
        />
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
