import type { MediaFile } from '@workspace/backend/schema';

export function MultimediaToolbar({ file }: { file: MediaFile }) {
  return (
    <section className="flex h-9 w-full items-center">
      <p className="text-lg font-semibold">Multimedia Toolbar: {file.name}</p>
    </section>
  );
}
