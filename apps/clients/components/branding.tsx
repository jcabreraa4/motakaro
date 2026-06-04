import Image from 'next/image';

import { cn } from '@workspace/ui/lib/utils';

export function Branding({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none flex items-center gap-2 select-none', className)}>
      <Image
        src="/motakaro.webp"
        alt="MTKOLogo"
        width={500}
        height={500}
        className="h-10 w-auto"
      />
      <p className="text-2xl font-semibold text-white">Motakaro</p>
    </div>
  );
}
