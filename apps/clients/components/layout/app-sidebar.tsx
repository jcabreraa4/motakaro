import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@workspace/ui/components/sidebar';

import { NavMain } from '@/components/layout/nav-main';
import { NavTeam } from '@/components/layout/nav-team';
import { NavUser } from '@/components/layout/nav-user';
import { getCompanies } from '@/server/get-companies';
import { getContact } from '@/server/get-contact';

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const contact = await getContact();
  const companies = await getCompanies();

  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <NavTeam teams={companies || []} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          name={`${contact!.name} ${contact!.surname}`}
          email={contact!.email}
          avatar={contact!.avatar}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
