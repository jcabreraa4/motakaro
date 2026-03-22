import { AppFooter } from '@/components/layout/app-footer';
import { AppNavbar } from '@/components/layout/app-navbar';
import { Background } from '@/components/layout/background';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppNavbar />
      {children}
      <AppFooter />
      <Background />
    </div>
  );
}
