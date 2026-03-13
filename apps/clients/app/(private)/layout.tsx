import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar';
import { ConvexProvider } from '@/components/providers/convex-provider';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false';

  return (
    <ConvexProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset className="h-svh overflow-hidden">
          <AppHeader />
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <Suspense>{children}</Suspense>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ConvexProvider>
  );
}
