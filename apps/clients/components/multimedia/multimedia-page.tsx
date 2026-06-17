'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { FileTextIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { GenericLoader } from '@workspace/ui/custom/generic-loader';

import { MultimediaToolbar } from '@/components/multimedia/multimedia-toolbar';
import { MultimediaViewer } from '@/components/multimedia/multimedia-viewer';
import { useHeader } from '@/hooks/use-header';

interface MultimediaPageProps {
  preloaded: Preloaded<typeof api.multimedia.clientGet>;
}

export function MultimediaPage({ preloaded }: MultimediaPageProps) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <GenericLoader />;
  return <MultimediaLoaded preloaded={preloaded} />;
}

function MultimediaLoaded({ preloaded }: MultimediaPageProps) {
  const { setBreadcrumbs } = useHeader();

  const file = usePreloadedQuery(preloaded);

  useEffect(() => {
    if (file) setBreadcrumbs([{ text: file.name || 'Untitled File' }]);
    return () => setBreadcrumbs([]);
  }, [file, setBreadcrumbs]);

  if (!file) {
    return (
      <main className="flex w-full flex-col items-center justify-center gap-5 select-none">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xl font-semibold">404 Not Found</p>
          <p>The file you are looking for could not be found.</p>
        </div>
        <Link href="/multimedia">
          <Button className="cursor-pointer">
            <FileTextIcon />
            Check Multimedia
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="flex w-full flex-col gap-2 p-3 lg:gap-3 lg:p-5">
      <MultimediaToolbar file={file} />
      <MultimediaViewer file={file} />
    </main>
  );
}
