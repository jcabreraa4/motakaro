import { cn } from '@workspace/ui/lib/utils';
import { BotIcon } from 'lucide-react';

export function SideChatbot({ className }: { className?: string }) {
  return (
    <section className={cn('w-120 border-l', className)}>
      <div className="pointer-events-none flex w-full flex-col items-center justify-center gap-2 select-none">
        <BotIcon className="size-14" />
        <p className="text-2xl font-semibold">Under Construction</p>
      </div>
    </section>
  );
}
