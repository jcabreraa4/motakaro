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
    </Link>
  );
}
