import { HeadphonesIcon } from 'lucide-react';

import { RenderPoster } from '@workspace/render/components/render-poster';
import { cn } from '@workspace/ui/lib/utils';

interface RenderAudioProps {
  src: string;
  fill?: boolean;
  controls?: boolean;
  className?: string;
}

export function RenderAudio({ src, fill, controls, className }: RenderAudioProps) {
  // Fill Container
  if (fill) {
    return (
      <div className="relative h-full w-full">
        <RenderPoster
          icon={HeadphonesIcon}
          text="Audio File"
          className="absolute inset-0"
        />
        {controls && (
          <audio
            controls
            src={src}
            preload="none"
            className={cn('absolute bottom-0 left-0 z-10 w-full rounded-md', className)}
          />
        )}
      </div>
    );
  }

  // Expand Contained
  return (
    <div className="@container-size flex h-full w-full items-center justify-center">
      <div className="relative aspect-video w-full overflow-hidden rounded-md border">
        <RenderPoster
          icon={HeadphonesIcon}
          text="Audio File"
          className="absolute inset-0"
        />
        {controls && (
          <audio
            controls
            src={src}
            preload="none"
            className={cn('absolute bottom-0 left-0 z-10 w-full rounded-md', className)}
          />
        )}
      </div>
    </div>
  );
}
