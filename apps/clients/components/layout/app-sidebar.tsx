import { currentUser } from '@clerk/nextjs/server';

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@workspace/ui/components/sidebar';

import { NavMain } from '@/components/layout/nav-main';
import { NavTeam } from '@/components/layout/nav-team';
import { NavUser } from '@/components/layout/nav-user';

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUser();

  const userData = {
    name: user!.fullName || 'User',
    email: user!.emailAddresses[0]!.emailAddress,
    avatar: user!.imageUrl
  };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <NavTeam />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser {...userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
