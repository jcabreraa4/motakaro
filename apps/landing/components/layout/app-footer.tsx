import { DotPattern } from '@workspace/ui/magicui/dot-pattern';
import { Branding } from '@/components/motakaro/branding';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import Link from 'next/link';

export function AppFooter() {
  return (
    <footer className="relative flex h-55 min-h-55 w-full flex-col items-center justify-center overflow-hidden bg-black text-white">
      <section className="container mx-auto h-full px-3 py-8 xl:px-5">
        <div className="flex h-full w-full flex-col justify-between">
          <Branding />
          <div className="flex justify-between">
            <div className="flex flex-col gap-2 text-lg font-semibold md:flex-row md:items-center">
              <p>All Rights Reserved © 2026 Motakaro</p>
              <span className="hidden md:inline">|</span>
              <Button
                variant="link"
                className="w-fit p-0 text-lg font-semibold text-white"
              >
                <Link href="/privacy">Privacy Policy</Link>
              </Button>
            </div>
            <div className="hidden items-center gap-3"></div>
          </div>
        </div>
      </section>
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn('mask-[linear-gradient(to_bottom_right,white,transparent,transparent)]')}
      />
    </footer>
  );
}
