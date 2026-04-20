import { cn } from '@workspace/ui/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface BrandingProps {
  href?: string;
  className?: string;
}

export function Branding({ href = '/', className }: BrandingProps) {
  return (
    <Link href={href}>
      <div className={cn('pointer-events-none flex items-center gap-2 select-none', className)}>
        <Image
          src="/motakaro.webp"
          alt="MTKOLogo"
          width={500}
          height={500}
          className="h-10 w-auto"
        />
        <p className="text-2xl font-semibold">Motakaro</p>
      </div>
    </Link>
  );
}
