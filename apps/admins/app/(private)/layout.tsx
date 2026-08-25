import { cookies } from 'next/headers';

import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar';

import { AgentsInset } from '@/components/agents/agents-inset';
import { AppOnboard } from '@/components/layout/app-onboard';
import { InsetHeader } from '@/components/layout/inset-header';
import { SidebarMain } from '@/components/layout/sidebar-main';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false';

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      className="h-svh overflow-hidden"
    >
      <SidebarMain />
      <SidebarInset className="overflow-hidden">
        <InsetHeader />
        <div className="h-full overflow-hidden">{children}</div>
      </SidebarInset>
      <AgentsInset />
      <AppOnboard />
    </SidebarProvider>
  );
}
