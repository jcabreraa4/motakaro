import { NavMain } from '@/components/layout/nav-main';
import { NavUser } from '@/components/layout/nav-user';
import { Sidebar, SidebarHeader, SidebarContent, SidebarRail } from '@workspace/ui/components/sidebar';
import { currentUser } from '@clerk/nextjs/server';

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
        <NavUser {...userData} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
