import { cn } from '@workspace/ui/lib/utils';

interface RenderImageProps {
  src: string;
  fill?: boolean;
  className?: string;
}

export function RenderImage({ src, fill, className }: RenderImageProps) {
  // Fill Container
  if (fill) {
    return (
      <img
        src={src}
        alt="Image"
        loading="lazy"
        className={cn('object-cover', className)}
      />
    );
  }

  // Expand Contained
  return (
    <div className="@container-size flex h-full w-full items-center justify-center">
      <img
        src={src}
        alt="Image"
        loading="lazy"
        className={cn('max-h-full w-auto max-w-full rounded-md border object-contain', className)}
      />
    </div>
  );
}
