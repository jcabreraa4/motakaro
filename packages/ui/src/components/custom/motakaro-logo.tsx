import { cn } from '@workspace/ui/lib/utils';

const logo = '/logo.webp';

export function MotakaroLogo({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none flex items-center gap-2 select-none', className)}>
      <img
        src={logo}
        alt="Motakaro"
        className="size-10"
      />
      <p className="text-2xl font-semibold">Motakaro</p>
    </div>
  );
}
