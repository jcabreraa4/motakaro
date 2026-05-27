import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@workspace/ui/components/sidebar';

import { NavMain } from '@/components/layout/nav-main';
import { NavUser } from '@/components/layout/nav-user';
import { getEmployee } from '@/server/get-employee';

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const employee = await getEmployee();

  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <NavUser
          name={`${employee!.name} ${employee!.surname}`}
          email={employee!.email}
          avatar={employee!.avatar}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
