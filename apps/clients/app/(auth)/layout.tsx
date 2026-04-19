import { SquareThemeButton } from '@workspace/ui/custom/theme-buttons';
import { LightRays } from '@workspace/ui/magicui/light-rays';
import { Branding } from '@/components/motakaro/branding';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-svh bg-primary-foreground dark:bg-[#0A0A0A]">
      <section className="relative flex h-full w-full items-center justify-center p-5">
        <div className="absolute top-0 left-0 p-5">
          <Branding className="xl:hidden" />
          <SquareThemeButton className="hidden xl:flex" />
        </div>
        {children}
      </section>
      <section className="pointer-events-none relative hidden h-full w-full border-l bg-motakaro select-none xl:flex">
        <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center gap-4 text-center">
          <span className="text-xs font-semibold tracking-[0.35em] uppercase">CLIENT ACCESS</span>
          <h1 className="text-5xl font-bold text-foreground">Motakaro</h1>
        </div>
        <LightRays
          blur={80}
          speed={10}
          count={3}
          length="160vh"
          color="#ffffff"
        />
        <LightRays
          fromBottom
          blur={80}
          speed={10}
          count={3}
          length="160vh"
          color="#ffffff"
        />
      </section>
    </main>
  );
}
