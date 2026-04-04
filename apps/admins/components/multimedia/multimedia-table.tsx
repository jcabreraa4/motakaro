import { MultimediaPreview } from '@/components/multimedia/multimedia-preview';
import { MultimediaToolbar } from '@/components/multimedia/multimedia-toolbar';
import { MultimediaInfo } from '@/components/multimedia/multimedia-info';
import { useAppStateStore } from '@/store/state-store';
import { MediaFile } from '@workspace/backend/schema';
import { cn } from '@workspace/ui/lib/utils';

type UrlMediaFile = MediaFile & { url: string | null };

export function MediaTable({ multimedia }: { multimedia: UrlMediaFile[] }) {
  const showChat = useAppStateStore((state) => state.showChat);

  const starredFiles = multimedia.filter((file) => file.starred);
  const nonStarredFiles = multimedia!.filter((file) => !file.starred);

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-scroll lg:pe-3">
      {starredFiles.length != 0 && (
        <div className={cn('grid grid-flow-row grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3', showChat ? '2xl:grid-cols-3' : '2xl:grid-cols-4')}>
          {starredFiles.map((file) => (
            <div
              key={file._id}
              className="flex flex-col gap-5"
            >
              <MultimediaPreview
                id={file._id}
                src={file.url!}
                name={file.name}
                type={file.type}
              />
              <MultimediaInfo
                name={file.name}
                size={file.size}
                type={file.type}
              />
              <MultimediaToolbar file={file} />
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
              <MultimediaPreview
                id={file._id}
                src={file.url!}
                name={file.name}
                type={file.type}
              />
              <MultimediaInfo
                name={file.name}
                size={file.size}
                type={file.type}
              />
              <MultimediaToolbar file={file} />
            </div>
          ))}
        </div>
      )}
      <div className="py-0.5 lg:hidden" />
    </section>
  );
}
