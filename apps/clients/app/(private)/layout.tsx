import { cookies } from 'next/headers';
import { Suspense } from 'react';

import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar';

import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden">
        <AppHeader />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <Suspense>{children}</Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
