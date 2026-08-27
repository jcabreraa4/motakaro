import { useState } from 'react';

import { RenderLoader } from '@workspace/render/components/render-loader';
import { cn } from '@workspace/ui/lib/utils';

interface RenderVideoProps {
  src: string;
  fill?: boolean;
  controls?: boolean;
  className?: string;
}

export function RenderVideo({ src, fill, controls, className }: RenderVideoProps) {
  const [loading, setLoading] = useState(true);

  // Fill Container
  if (fill) {
    return (
      <>
        {loading && <RenderLoader />}
        <video
          src={src}
          controls={controls}
          preload="metadata"
          className={cn('object-cover', className)}
          onLoadedData={() => setLoading(false)}
        />
      </>
    );
  }

  // Expand Contained
  return (
    <>
      {loading && <RenderLoader />}
      <div className="@container-size relative flex h-full w-full items-center justify-center">
        <video
          src={src}
          controls={controls}
          preload="metadata"
          className={cn('max-h-full w-full max-w-full rounded-md border bg-sidebar object-contain', className)}
          onLoadedData={() => setLoading(false)}
        />
      </div>
    </>
  );
}
