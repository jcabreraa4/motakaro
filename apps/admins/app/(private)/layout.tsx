import { cookies } from 'next/headers';

import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar';

import { AppChatbot } from '@/components/layout/app-chatbot';
import { AppHeader } from '@/components/layout/app-header';
import { AppOnboard } from '@/components/layout/app-onboard';
import { AppSidebar } from '@/components/layout/app-sidebar';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false';

  return (
    <SidebarProvider
      className="bg-sidebar"
      defaultOpen={defaultOpen}
    >
      <AppSidebar className="print:hidden" />
      <SidebarInset className="h-svh overflow-hidden bg-sidebar md:py-2 md:pr-2">
        <AppHeader className="print:hidden" />
        <div className="flex min-h-0 flex-1 overflow-hidden rounded-b-md border bg-white dark:bg-[#0A0A0A] print:border-none">
          <div className="flex min-h-0 flex-1 overflow-hidden">{children}</div>
          <AppChatbot />
        </div>
      </SidebarInset>
      <AppOnboard />
    </SidebarProvider>
  );
}
