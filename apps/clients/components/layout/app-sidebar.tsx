import { Sidebar, SidebarHeader, SidebarContent, SidebarRail, SidebarFooter } from '@workspace/ui/components/sidebar';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { NavMain } from '@/components/layout/nav-main';
import { NavUser } from '@/components/layout/nav-user';
import { NavTeam } from '@/components/layout/nav-team';

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUser();
  const client = await clerkClient();

  const memberships = await client.users.getOrganizationMembershipList({ userId: user!.id });

  const userData = {
    name: user!.fullName || 'User',
    email: user!.emailAddresses[0]!.emailAddress,
    avatar: user!.imageUrl
  };

  const teamsData = await Promise.all(
    memberships.data.map(async ({ organization }) => {
      try {
        const subscription = await client.billing.getOrganizationBillingSubscription(organization.id);
        const activeItem = subscription.subscriptionItems?.find((item) => item.status === 'active');
        return {
          id: organization.id,
          name: organization.name,
          logo: organization.imageUrl,
          plan: activeItem?.plan?.name
        };
      } catch {
        return {
          id: organization.id,
          name: organization.name,
          logo: organization.imageUrl,
          plan: undefined
        };
      }
    })
  );

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
