'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { ImageIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { EmptySection } from '@workspace/ui/components/custom/empty-section';
import { GenericLoader } from '@workspace/ui/components/custom/generic-loader';

import { AppSection } from '@/components/layout/app-section';
import { MultimediaRender } from '@/components/multimedia/multimedia-render';
import { MultimediaToolbar } from '@/components/multimedia/multimedia-toolbar';
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
    else setBreadcrumbs([{ text: '404 Not Found' }]);
    return () => setBreadcrumbs([]);
  }, [file, setBreadcrumbs]);

  if (!file) {
    return (
      <AppSection>
        <EmptySection
          icon={ImageIcon}
          title="404 Not Found"
          description="The file record could not be found."
        >
          <Link href="/multimedia">
            <Button className="cursor-pointer">
              <ImageIcon />
              Check Multimedia
            </Button>
          </Link>
        </EmptySection>
      </AppSection>
    );
  }

  return (
    <AppSection className="flex flex-col gap-3 md:gap-5">
      <MultimediaToolbar file={file} />
      <MultimediaRender file={file} />
    </AppSection>
  );
}
