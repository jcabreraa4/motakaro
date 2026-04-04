import { FileTextIcon, HeadphonesIcon, ImageIcon, VideoIcon } from 'lucide-react';
import { sizeToText } from '@/utils/size-to-text';
import { mediaType } from '@/utils/media-type';
import { cn } from '@workspace/ui/lib/utils';

interface MediaInfoProps {
  name: string;
  size: number;
  type: string;
  className?: string;
  showIcon?: boolean;
}

export function MediaInfo({ name, size, type, className, showIcon = true }: MediaInfoProps) {
  const fileType = mediaType(type);

  return (
    <div className={cn('flex h-13 flex-col gap-1 overflow-hidden', className)}>
      <div className="flex items-center">
        {showIcon && <div className="min-w-8">{fileType === 'image' ? <ImageIcon /> : fileType === 'video' ? <VideoIcon /> : fileType === 'audio' ? <HeadphonesIcon /> : <FileTextIcon />}</div>}
        <p className="truncate text-lg font-semibold">{name}</p>
      </div>
      <p className="text-sm text-gray-500">{sizeToText(size)}</p>
    </div>
  );
}
