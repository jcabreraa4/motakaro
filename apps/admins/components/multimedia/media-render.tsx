'use client';

import { useState } from 'react';
import { HeadphonesIcon, Loader2Icon } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const OtherMediaRender = dynamic(() => import('@/components/multimedia/other-render').then((m) => m.OtherMediaRender), { ssr: false });

export function RenderLoader() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
      <Loader2Icon className="size-12 animate-spin text-black" />
    </div>
  );
}

interface ImageRenderProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
}

export function ImageRender({ src, alt, width, height, className, fill = false }: ImageRenderProps) {
  if (fill) {
    return (
      <Image
        fill
        src={src}
        alt={alt}
        sizes="100vw"
        className={cn('pointer-events-none object-contain', className)}
      />
    );
  }

  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn('pointer-events-none mx-auto h-auto max-h-[80vh] w-auto max-w-full rounded-md', className)}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn('pointer-events-none h-auto max-h-[80vh] max-w-full rounded-md', className)}
    />
  );
}

interface VideoRenderProps {
  src: string;
  interact?: boolean;
  className?: string;
}

export function VideoRender({ src, interact = false, className }: VideoRenderProps) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <RenderLoader />}
      <video
        controls={interact}
        src={src}
        className={cn('object-cover', className)}
        onLoadedData={() => setLoading(false)}
      />
    </>
  );
}

interface AudioRenderProps {
  src: string;
  interact?: boolean;
  className?: string;
}

export function AudioRender({ src, interact = false, className }: AudioRenderProps) {
  const [loading, setLoading] = useState(true);

  if (interact)
    return (
      <>
        {loading && <RenderLoader />}
        <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-md bg-gray-100 dark:bg-gray-100 dark:text-black">
          <div className="flex flex-1 items-center gap-2 pt-5">
            <HeadphonesIcon className="size-6 lg:size-8" />
            <p className="text-lg font-semibold lg:text-2xl">Audio File</p>
          </div>
          <div className="w-full px-2 pb-2">
            <audio
              controls
              src={src}
              className={cn('w-full', className)}
              onLoadedData={() => setLoading(false)}
            />
          </div>
        </div>
      </>
    );

  return (
    <div className="flex aspect-video items-center justify-center gap-2 rounded-md bg-gray-100 dark:bg-gray-100 dark:text-black">
      <HeadphonesIcon className="size-6 lg:size-8" />
      <p className="text-lg font-semibold lg:text-2xl">Audio File</p>
    </div>
  );
}

interface OtherRenderProps {
  src: string;
  interact?: boolean;
  className?: string;
}

export function OtherRender({ src, interact = false, className }: OtherRenderProps) {
  return (
    <OtherMediaRender
      src={src}
      interact={interact}
      className={className}
    />
  );
}
