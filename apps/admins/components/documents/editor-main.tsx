'use client';

import dynamic from 'next/dynamic';
import { DesktopToolbar } from '@/components/documents/desktop-toolbar';
import { MobileToolbar } from '@/components/documents/mobile-toolbar';
import { Button } from '@workspace/ui/components/button';
import { api } from '@workspace/backend/_generated/api';
import { useEditor } from '@/hooks/use-editor';
import { FileTextIcon } from 'lucide-react';
import { Preloaded } from 'convex/react';
import Link from 'next/link';

const EditorPaper = dynamic(() => import('@/components/documents/editor-paper').then((m) => ({ default: m.EditorPaper })), { ssr: false });

export function EditorMain({ preloadedDocument }: { preloadedDocument: Preloaded<typeof api.documents.get> }) {
  const { document } = useEditor(preloadedDocument);

  if (!document)
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

  return (
    <main className="flex w-full flex-col gap-3 p-3 xl:p-4">
      <DesktopToolbar
        document={document}
        className="hidden xl:flex"
      />
      <MobileToolbar
        document={document}
        className="xl:hidden"
      />
      <EditorPaper paperId={document._id} />
    </main>
  );
}
