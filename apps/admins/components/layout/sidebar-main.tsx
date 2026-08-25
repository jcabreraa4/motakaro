import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@workspace/ui/components/sidebar';

import { SidebarLinks } from '@/components/layout/sidebar-links';
import { SidebarTeam } from '@/components/layout/sidebar-team';
import { SidebarUser } from '@/components/layout/sidebar-user';
import { getUser } from '@/server/get-user';

export async function SidebarMain({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await getUser();

  return (
    <Sidebar
      {...props}
      variant="inset"
    >
      <SidebarHeader>
        <SidebarTeam
          name="Motakaro"
          plan="Internal"
          logo="/motakaro.webp"
        />
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
