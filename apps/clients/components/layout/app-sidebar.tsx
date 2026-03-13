import { NavMain } from '@/components/layout/nav-main';
import { NavUser } from '@/components/layout/nav-user';
import { NavTeam } from '@/components/layout/nav-team';
import { Sidebar, SidebarHeader, SidebarContent, SidebarRail, SidebarFooter } from '@workspace/ui/components/sidebar';
import { clerkClient, currentUser } from '@clerk/nextjs/server';

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUser();
  const client = await clerkClient();

  const memberships = await client.users.getOrganizationMembershipList({ userId: user!.id });

  const userData = {
    name: user!.fullName || 'User',
    email: user!.emailAddresses[0]!.emailAddress,
    avatar: user!.imageUrl
  };

  const teamsData = memberships.data.map((mem) => ({
    id: mem.organization.id,
    name: mem.organization.name,
    logo: mem.organization.imageUrl,
    plan: (mem.organization.publicMetadata?.plan as string) ?? 'No Plan'
  }));

  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <NavTeam teams={teamsData} />
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
