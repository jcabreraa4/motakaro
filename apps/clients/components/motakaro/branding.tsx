import { cn } from '@workspace/ui/lib/utils';
import Image from 'next/image';

export function Branding({ className }: { className?: string }) {
  return (
    <div className="pointer-events-none flex items-center gap-2 select-none">
      <Image
        src="/motakaro.webp"
        alt="MTKOLogo"
        width={500}
        height={500}
        className="h-10 w-auto"
      />
      <p className={cn('text-2xl font-semibold text-white', className)}>Motakaro</p>
    </div>
  );
}
