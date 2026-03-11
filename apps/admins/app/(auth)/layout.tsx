import { RectangleThemeButton } from '@/components/theme-buttons';

export default function AccessLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen items-center justify-center bg-[#080808] px-5 lg:px-0">
      <div className="fixed top-0 left-0 z-50 p-5">
        <RectangleThemeButton />
      </div>
      {children}
    </main>
  );
}
