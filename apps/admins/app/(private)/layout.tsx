import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar';
import { AppChatbot } from '@/components/layout/app-chatbot';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden">
        <AppHeader />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <Suspense>{children}</Suspense>
          </div>
          <AppChatbot className="hidden 2xl:flex" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
