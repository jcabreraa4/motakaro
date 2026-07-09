import { AppFooter } from '@/components/layout/app-footer';
import { AppNavbar } from '@/components/layout/app-navbar';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col bg-sidebar">
      <AppNavbar />
      {children}
      <AppFooter />
    </main>
  );
}
