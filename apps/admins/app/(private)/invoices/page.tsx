import { WalletIcon } from 'lucide-react';

export default function Page() {
  return (
    <main className="w-full overflow-hidden p-3 md:p-5">
      <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center gap-2 select-none">
        <WalletIcon className="size-14" />
        <p className="text-2xl font-semibold">Under Construction</p>
      </div>
    </main>
  );
}
