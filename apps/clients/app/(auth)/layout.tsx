import Image from 'next/image';

import { Branding } from '@/components/motakaro/branding';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="dark flex h-svh bg-[#0A0A0A]">
      <section className="relative flex h-full w-full items-center justify-center p-5">
        <div className="absolute top-0 left-0 flex w-full justify-between p-5 xl:p-8">
          <Branding className="cursor-default text-white" />
        </div>
        {children}
      </section>
      <section className="pointer-events-none relative hidden h-full w-full select-none xl:flex">
        <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center gap-4 text-center">
          <span className="text-sm font-bold tracking-[0.35em] text-white uppercase">Where GTM Meets Engineering</span>
          <h1 className="text-5xl font-bold text-white">Motakaro Access</h1>
        </div>
        <Image
          fill
          src="/background.webp"
          alt="Motakaro"
          className="opacity-15"
        />
      </section>
    </main>
  );
}
