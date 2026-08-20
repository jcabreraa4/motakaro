import { cookies } from 'next/headers';

import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar';

import { AppHeader } from '@/components/layout/app-header';
import { AppOnboard } from '@/components/layout/app-onboard';
import { AppSidebar } from '@/components/layout/app-sidebar';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false';

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      className="h-svh overflow-hidden"
    >
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <AppHeader />
        <div className="h-full overflow-hidden">{children}</div>
      </SidebarInset>
      <AppOnboard />
    </SidebarProvider>
  );
}
