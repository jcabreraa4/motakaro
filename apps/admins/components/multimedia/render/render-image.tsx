import Image from 'next/image';

import { cn } from '@workspace/ui/lib/utils';

interface RenderImageProps {
  src: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export function RenderImage({ src, fill, width, height, className }: RenderImageProps) {
  // Fill Container
  if (fill) {
    return (
      <Image
        fill
        src={src}
        alt="Image"
        className={cn('object-cover', className)}
      />
    );
  }

  // Expand Contained
  return (
    <div className="@container-size flex h-full w-full items-center justify-center">
      {width && height ? (
        <Image
          src={src}
          alt="Image"
          width={width}
          height={height}
          className={cn('max-h-full w-auto max-w-full rounded-md border object-contain', className)}
        />
      ) : (
        <img
          src={src}
          alt="Image"
          loading="lazy"
          className={cn('max-h-full w-auto max-w-full rounded-md border object-contain', className)}
        />
      )}
    </div>
  );
}
