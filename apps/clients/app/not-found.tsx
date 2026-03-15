import { Branding } from '@/components/motakaro/branding';
import { SquareThemeButton } from '@/components/theme-buttons';
import { Particles } from '@workspace/ui/custom/particles';

export default function NotFound() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="fixed top-0 left-0 z-50 p-5">
        <Branding className="text-black dark:text-white" />
      </div>
      <div className="fixed top-0 right-0 z-50 p-5">
        <SquareThemeButton className="hidden lg:flex" />
      </div>
      <section className="pointer-events-none flex h-14 w-full justify-center gap-5 select-none">
        <div className="flex h-full items-center border-e-2 pe-5">
          <p className="text-3xl font-semibold">404</p>
        </div>
        <div className="flex h-full flex-col justify-center gap-2">
          <p className="text-3xl font-semibold">Page not found</p>
        </div>
      </section>
      <Particles
        className="fixed inset-0 z-[-1]"
        quantity={150}
        ease={80}
        refresh
      />
    </main>
  );
}
