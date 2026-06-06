interface GenericErrorProps {
  code: number;
  text: string;
  children: React.ReactNode;
}

export function GenericError({ code, text, children }: GenericErrorProps) {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5 bg-[#0A0A0A] text-white">
      <section className="pointer-events-none flex h-14 w-full justify-center gap-5 select-none">
        <div className="flex h-full items-center border-e-2 pe-5">
          <p className="text-3xl font-semibold">{code}</p>
        </div>
        <div className="flex h-full flex-col justify-center gap-2">
          <p className="text-3xl font-semibold">{text}</p>
        </div>
      </section>
      {children}
    </main>
  );
}
