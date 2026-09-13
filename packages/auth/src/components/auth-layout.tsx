import { MotakaroLogo } from '@workspace/ui/components/custom/motakaro-logo';

const background = '/tree.webp';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-svh">
      <section className="relative flex h-full w-full items-center justify-center border-r p-5">
        <div className="absolute top-0 left-0 flex w-full justify-between p-5 xl:p-8">
          <MotakaroLogo />
        </div>
        <div className="w-full max-w-md">{children}</div>
      </section>
      <section className="pointer-events-none relative hidden h-full w-full select-none xl:flex">
        <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center gap-4 text-center">
          <span className="text-sm font-bold tracking-[0.35em] uppercase">Where GTM Meets Engineering</span>
          <h1 className="text-5xl font-bold">Motakaro Labs</h1>
        </div>
        <img
          alt="Motakaro"
          src={background}
          className="w-full object-cover opacity-30"
        />
      </section>
    </main>
  );
}
