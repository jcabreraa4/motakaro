import { MediaPreview } from '@/components/multimedia/media-preview';
import { MediaToolbar } from '@/components/multimedia/media-toolbar';
import { MediaInfo } from '@/components/multimedia/media-info';
import { useAppStateStore } from '@/store/state-store';
import { MediaFile } from '@workspace/backend/schema';
import { cn } from '@workspace/ui/lib/utils';

type UrlMediaFile = MediaFile & { url: string | null };

export function MediaTable({ multimedia }: { multimedia: UrlMediaFile[] }) {
  const showChat = useAppStateStore((state) => state.showChat);

  const starredFiles = multimedia.filter((file) => file.starred);
  const nonStarredFiles = multimedia!.filter((file) => !file.starred);

  return (
    <>
      {starredFiles.length != 0 && (
        <div className={cn('grid grid-flow-row grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3', showChat ? '2xl:grid-cols-3' : '2xl:grid-cols-4')}>
          {starredFiles.map((file) => (
            <div
              key={file._id}
              className="flex flex-col gap-5"
            >
              <MediaPreview
                id={file._id}
                src={file.url!}
                name={file.name}
                type={file.type}
              />
              <MediaInfo
                name={file.name}
                size={file.size}
                type={file.type}
              />
              <MediaToolbar file={file} />
            </div>
          ))}
        </div>
      )}
      {nonStarredFiles.length != 0 && (
        <div className={cn('grid grid-flow-row grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3', showChat ? '2xl:grid-cols-3' : '2xl:grid-cols-4')}>
          {nonStarredFiles.map((file) => (
            <div
              key={file._id}
              className="flex flex-col gap-5"
            >
              <MediaPreview
                id={file._id}
                src={file.url!}
                name={file.name}
                type={file.type}
              />
              <MediaInfo
                name={file.name}
                size={file.size}
                type={file.type}
              />
              <MediaToolbar file={file} />
            </div>
          ))}
        </div>
      )}
      <div className="py-0.5 lg:hidden" />
    </>
  );
}
