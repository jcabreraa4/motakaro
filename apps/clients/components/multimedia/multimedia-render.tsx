'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';

import { HeadphonesIcon, Loader2Icon, type LucideIcon, VideoIcon } from 'lucide-react';

import { cn } from '@workspace/ui/lib/utils';

const MultimediaIframe = dynamic(() => import('@/components/multimedia/multimedia-iframe').then((m) => m.MultimediaIframe), { ssr: false });

export function MultimediaLoader() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
      <Loader2Icon className="size-12 animate-spin text-black" />
    </div>
  );
}

interface MultimediaThumbnailProps {
  icon: LucideIcon;
  text: string;
  className?: string;
}

export function MultimediaThumbnail({ icon: Icon, text, className }: MultimediaThumbnailProps) {
  return (
    <div className={cn('flex aspect-video items-center justify-center gap-2 rounded-md bg-sidebar select-none', className)}>
      <Icon className="size-6 lg:size-8" />
      <p className="text-lg font-semibold lg:text-2xl">{text}</p>
    </div>
  );
}

interface MultimediaImageProps {
  src: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export function MultimediaImage({ src, fill = false, width, height, className }: MultimediaImageProps) {
  if (fill) {
    return (
      <Image
        fill
        src={src}
        alt="Image"
        sizes="100vw"
        className={cn('pointer-events-none object-cover', className)}
      />
    );
  }

  if (width && height) {
    const isVertical = height > width;

    return (
      <Image
        src={src}
        alt="Image"
        width={width}
        height={height}
        className={cn('pointer-events-none mx-auto h-auto w-auto max-w-full', isVertical ? 'h-full' : 'w-full', className)}
      />
    );
  }

  return (
    <img
      src={src}
      alt="Image"
      loading="lazy"
      className={cn('pointer-events-none mx-auto h-auto w-auto max-w-full', className)}
    />
  );
}

interface MultimediaVideoProps {
  src: string;
  width?: number;
  height?: number;
  interact?: boolean;
  external?: boolean;
  preview?: boolean;
  className?: string;
}

export function MultimediaVideo({ src, width, height, interact = false, external = false, preview = false, className }: MultimediaVideoProps) {
  const [loading, setLoading] = useState(true);

  if (external) {
    return (
      <>
        {loading && <MultimediaLoader />}
        <iframe
          src={src}
          allowFullScreen
          title="Media Player"
          onLoad={() => setLoading(false)}
          className={cn('object-cover', className)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      </>
    );
  }

  if (preview) {
    return (
      <>
        {loading && <MultimediaLoader />}
        <video
          src={src}
          width={width}
          height={height}
          controls={interact}
          preload="metadata"
          className={cn('object-cover', className)}
          onLoadedData={() => setLoading(false)}
        />
      </>
    );
  }

  return (
    <MultimediaThumbnail
      icon={VideoIcon}
      text="Video File"
    />
  );
}

interface MultimediaAudioProps {
  src: string;
  interact?: boolean;
  className?: string;
}

export function MultimediaAudio({ src, interact = false, className }: MultimediaAudioProps) {
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
    <MultimediaThumbnail
      icon={HeadphonesIcon}
      text="Audio File"
    />
  );
}

interface MultimediaFileProps {
  src: string;
  interact?: boolean;
  className?: string;
}

export function MultimediaFile({ src, interact = false, className }: MultimediaFileProps) {
  return (
    <MultimediaIframe
      src={src}
      interact={interact}
      className={className}
    />
  );
}
