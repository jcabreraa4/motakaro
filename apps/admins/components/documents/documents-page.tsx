'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { FileTextIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { GenericLoader } from '@workspace/ui/custom/generic-loader';

import { DocumentsEditor } from '@/components/documents/documents-editor';
import { DocumentsToolbar } from '@/components/documents/documents-toolbar';
import { useHeader } from '@/hooks/use-header';

interface DocumentsPageProps {
  preloaded: Preloaded<typeof api.documents.get>;
}

export function DocumentsPage({ preloaded }: DocumentsPageProps) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <GenericLoader />;
  return <DocumentsPageLoaded preloaded={preloaded} />;
}

function DocumentsPageLoaded({ preloaded }: DocumentsPageProps) {
  const { setBreadcrumbs } = useHeader();

  const document = usePreloadedQuery(preloaded);

  useEffect(() => {
    if (document) setBreadcrumbs([{ text: document.name || 'Untitled Document' }]);
    return () => setBreadcrumbs([]);
  }, [document, setBreadcrumbs]);

  if (!document) {
    return (
      <section className="flex w-full flex-col items-center justify-center gap-5 p-3 select-none md:p-5">
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
    <main className="flex w-full flex-col gap-3 p-3 md:gap-5 md:p-5">
      <DocumentsToolbar document={document} />
      <DocumentsEditor document={document} />
    </main>
  );
}
