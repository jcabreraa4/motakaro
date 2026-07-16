import { Sidebar, SidebarContent, SidebarHeader } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';

import { NavMain } from '@/components/layout/nav-main';
import { NavUser } from '@/components/layout/nav-user';
import { getUser } from '@/server/get-user';

export async function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await getUser();

  return (
    <Sidebar
      {...props}
      collapsible="icon"
      className={cn('border-none py-2', className)}
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
