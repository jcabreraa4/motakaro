'use client';

import { useEffect } from 'react';
import { FileTextIcon } from 'lucide-react';
import { api } from '@workspace/backend/_generated/api';
import { DesktopToolbar } from '@/components/documents/desktop-toolbar';
import { MobileToolbar } from '@/components/documents/mobile-toolbar';
import { CircleLoader } from '@workspace/ui/custom/loaders';
import { Button } from '@workspace/ui/components/button';
import { useAppStateStore } from '@/store/state-store';
import { useEditor } from '@/hooks/use-editor';
import { Preloaded } from 'convex/react';
import { useAuth } from '@clerk/nextjs';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const DocumentsPaper = dynamic(() => import('@/components/documents/documents-paper').then((m) => ({ default: m.DocumentsPaper })), { ssr: false });

interface DocumentsPageProps {
  preloaded: Preloaded<typeof api.documents.get>;
}

export function DocumentsPage({ preloaded }: DocumentsPageProps) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <CircleLoader />;
  return <DocumentsPageInner preloaded={preloaded} />;
}

function DocumentsPageInner({ preloaded }: DocumentsPageProps) {
  const { document } = useEditor(preloaded);
  const setSubroute = useAppStateStore((state) => state.setSubroute);

  useEffect(() => {
    if (document) setSubroute(document.name);
  }, [document, setSubroute]);

  if (!document) {
    return (
      <section className="flex w-full flex-col items-center justify-center gap-5">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xl font-semibold">404 Not Found</p>
          <p>The document you are looking for could not be found.</p>
        </div>
        <Link href="/documents">
          <Button className="cursor-pointer">
            <FileTextIcon />
            Check Documents
          </Button>
        </Link>
      </section>
    );
  }

  return (
    <main className="flex w-full flex-col gap-2 p-3 lg:gap-3 lg:p-5">
      <DesktopToolbar
        document={document}
        className="hidden xl:flex"
      />
      <MobileToolbar
        document={document}
        className="xl:hidden"
      />
      <DocumentsPaper paperId={document._id} />
    </main>
  );
}
