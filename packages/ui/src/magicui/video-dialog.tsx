'use client';

import { useState } from 'react';
import { Play, XIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@workspace/ui/lib/utils';

type Animation = 'from-center' | 'top-to-bottom' | 'left-to-right';

interface VideoDialogProps {
  video: string;
  thumbnail: string;
  animation?: Animation;
  className?: string;
}

const animationVariants = {
  'from-center': {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 }
  },
  'top-to-bottom': {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 }
  },
  'left-to-right': {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 }
  }
};

export function VideoDialog({ video, thumbnail, animation = 'from-center', className }: VideoDialogProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const selectedAnimation = animationVariants[animation];

  function handleOpenDialog() {
    if (!video) return;
    setIsVideoOpen(true);
  }

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        aria-label="Play video"
        className={cn('group relative aspect-video border-0 bg-transparent p-0', video && 'cursor-pointer')}
        onClick={handleOpenDialog}
      >
        <img
          src={thumbnail}
          width={1920}
          height={1080}
          draggable="false"
          alt="Video thumbnail"
          className={cn('aspect-video w-full rounded-md border shadow-lg transition-all duration-200 ease-out', video && 'group-hover:brightness-[0.8]')}
        />
        {video && (
          <div className="absolute inset-0 flex aspect-video scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100">
            <div className="flex size-28 items-center justify-center rounded-full bg-primary/10 backdrop-blur-md">
              <div className={`relative flex size-20 scale-100 items-center justify-center rounded-full bg-linear-to-b from-primary/30 to-primary shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]`}>
                <Play
                  className="size-8 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105"
                  style={{
                    filter: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))'
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </button>
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                setIsVideoOpen(false);
              }
            }}
            onClick={() => setIsVideoOpen(false)}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          >
            <motion.div
              {...selectedAnimation}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative mx-4 aspect-video w-full max-w-6xl md:mx-0"
            >
              <motion.button className="absolute -top-16 right-0 cursor-pointer rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 backdrop-blur-md dark:bg-neutral-100/50 dark:text-black">
                <XIcon className="size-5" />
              </motion.button>
              <div className="relative isolate z-1 size-full overflow-hidden rounded-2xl border-2 border-white">
                <iframe
                  src={video}
                  title="Media Player"
                  className="mt-0 size-full rounded-2xl"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
