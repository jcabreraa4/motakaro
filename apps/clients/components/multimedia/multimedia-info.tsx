import { FileTextIcon, HeadphonesIcon, ImageIcon, VideoIcon } from 'lucide-react';

import { extractType } from '@workspace/render/utils/extract-type';
import { stringifySize } from '@workspace/render/utils/stringify-size';
import { cn } from '@workspace/ui/lib/utils';

interface MultimediaInfoProps {
  name: string;
  size: number;
  type: string;
  className?: string;
  showIcon?: boolean;
}

export function MultimediaInfo({ name, size, type, className, showIcon = true }: MultimediaInfoProps) {
  const fileType = extractType(type);

  return (
    <div className={cn('flex h-13 flex-col gap-1 overflow-hidden', className)}>
      <div className="flex items-center">
        {showIcon && <div className="min-w-8">{fileType === 'image' ? <ImageIcon /> : fileType === 'video' ? <VideoIcon /> : fileType === 'audio' ? <HeadphonesIcon /> : <FileTextIcon />}</div>}
        <p className="truncate text-lg font-semibold">{name || 'Untitled File'}</p>
      </div>
      <p className="text-sm text-gray-500">File size: {stringifySize(size)}</p>
    </div>
  );
}
