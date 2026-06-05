import { Sidebar, SidebarContent, SidebarHeader } from '@workspace/ui/components/sidebar';

import { NavMain } from '@/components/layout/nav-main';
import { NavUser } from '@/components/layout/nav-user';
import { getEmployee } from '@/server/get-employee';

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const employee = await getEmployee();

  return (
    <Sidebar
      {...props}
      collapsible="icon"
      className="border-none py-2"
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
    </Sidebar>
  );
}
