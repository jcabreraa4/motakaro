import { AppNavbar } from '@/components/layout/app-navbar';
import { Suspense } from 'react';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNavbar />
      <Suspense>{children}</Suspense>
    </>
  );
}
