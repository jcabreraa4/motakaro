import { ChartColumnBigIcon } from 'lucide-react';

export default function Page() {
  return (
    <main className="flex w-full flex-col gap-2 overflow-hidden p-3 lg:p-5">
      <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center gap-2 select-none">
        <ChartColumnBigIcon className="size-14" />
        <p className="text-2xl font-semibold">Under Construction</p>
      </div>
    </main>
  );
}
