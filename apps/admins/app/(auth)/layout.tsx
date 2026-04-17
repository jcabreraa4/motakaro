import { SquareThemeButton } from '@workspace/ui/custom/theme-buttons';
import { Branding } from '@/components/motakaro/branding';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen items-center justify-center gap-6 bg-[#0A0A0A] px-5 lg:px-0">
      <div className="fixed top-0 left-0 z-50 p-5">
        <Branding />
      </div>
      <div className="fixed top-0 right-0 z-50 p-5">
        <SquareThemeButton className="hidden lg:flex" />
      </div>
      {children}
    </main>
  );
}
