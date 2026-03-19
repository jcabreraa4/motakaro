'use client';

import { useState } from 'react';
import { type LucideIcon, HeadphonesIcon, Loader2Icon, VideoIcon } from 'lucide-react';
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

interface ThumbnailProps {
  icon: LucideIcon;
  text: string;
}

export function Thumbnail({ icon: Icon, text }: ThumbnailProps) {
  return (
    <div className="flex aspect-video items-center justify-center gap-2 rounded-md bg-sidebar">
      <Icon className="size-6 lg:size-8" />
      <p className="text-lg font-semibold lg:text-2xl">{text}</p>
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
    const isVertical = height > width;
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn('pointer-events-none mx-auto h-auto w-auto max-w-full', isVertical ? 'h-full' : 'w-full', className)}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={cn('pointer-events-none mx-auto h-auto w-auto max-w-full', className)}
    />
  );
}

interface VideoRenderProps {
  src: string;
  width?: number;
  height?: number;
  interact?: boolean;
  className?: string;
}

export function VideoRender({ src, width, height, interact = false, className }: VideoRenderProps) {
  const [loading, setLoading] = useState(true);

  if (interact) {
    return (
      <>
        {loading && <RenderLoader />}
        <video
          controls
          src={src}
          width={width}
          height={height}
          preload="metadata"
          className={cn('object-cover', className)}
          onLoadedData={() => setLoading(false)}
        />
      </>
    );
  }

  return (
    <Thumbnail
      icon={VideoIcon}
      text="Video File"
    />
  );
}

interface AudioRenderProps {
  src: string;
  interact?: boolean;
  className?: string;
}

export function AudioRender({ src, interact = false, className }: AudioRenderProps) {
  if (interact) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-md bg-gray-100 dark:bg-gray-100 dark:text-black">
        <div className="flex flex-1 items-center justify-center gap-3 pt-5">
          <HeadphonesIcon className="size-6 lg:size-8" />
          <p className="text-lg font-semibold lg:text-2xl">Audio File</p>
        </div>
        <div className="w-full px-2 pb-2">
          <audio
            controls
            src={src}
            preload="none"
            className={cn('w-full', className)}
          />
        </div>
      </div>
    );
  }

  return (
    <Thumbnail
      icon={HeadphonesIcon}
      text="Audio File"
    />
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
