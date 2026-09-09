import { MotakaroLogo } from '@workspace/ui/components/custom/motakaro-logo';

interface ExceptionPageProps {
  code: number;
  text: string;
}

export function ExceptionPage({ code, text }: ExceptionPageProps) {
  return (
    <main className="flex h-svh flex-col items-center justify-center gap-5">
      <section className="pointer-events-none flex h-14 w-full justify-center gap-5 select-none">
        <div className="flex h-full items-center border-e-2 pe-5">
          <p className="text-3xl font-semibold">{code}</p>
        </div>
        <div className="flex h-full flex-col justify-center gap-2">
          <p className="text-3xl font-semibold">{text}</p>
        </div>
      </section>
      <div className="fixed top-0 left-0 z-50 p-5 xl:p-8">
        <MotakaroLogo />
      </div>
    </main>
  );
}
