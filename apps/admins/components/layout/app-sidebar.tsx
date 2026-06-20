import { Sidebar, SidebarContent, SidebarHeader } from '@workspace/ui/components/sidebar';

import { NavMain } from '@/components/layout/nav-main';
import { NavUser } from '@/components/layout/nav-user';
import { getUser } from '@/server/get-user';

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await getUser();

  return (
    <Sidebar
      {...props}
      collapsible="icon"
      className="border-none py-2"
    >
      <SidebarHeader>
        <NavUser
          name={`${user!.name} ${user!.surname}`}
          email={user!.email}
          avatar={user!.avatar}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
    </Sidebar>
  );
}
