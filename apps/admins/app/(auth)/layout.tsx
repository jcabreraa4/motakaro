import Image from 'next/image';

import { Branding } from '@/components/branding';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-svh">
      <section className="relative flex h-full w-full items-center justify-center border-r p-5">
        <div className="absolute top-0 left-0 flex w-full justify-between p-5 xl:p-8">
          <Branding />
        </div>
        <div className="w-full max-w-md">{children}</div>
      </section>
      <section className="pointer-events-none relative hidden h-full w-full select-none xl:flex">
        <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center gap-4 text-center">
          <span className="text-sm font-bold tracking-[0.35em] uppercase">Where GTM Meets Engineering</span>
          <h1 className="text-5xl font-bold">Motakaro Access</h1>
        </div>
        <Image
          fill
          alt="Motakaro"
          src="/background.webp"
          className="opacity-15"
        />
      </section>
    </main>
  );
}
