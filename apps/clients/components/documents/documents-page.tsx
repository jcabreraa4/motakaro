'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useAuth } from '@clerk/nextjs';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { FileTextIcon } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { EmptySection } from '@workspace/ui/components/custom/empty-section';
import { GenericLoader } from '@workspace/ui/components/custom/generic-loader';

import { DocumentsEditor } from '@/components/documents/documents-editor';
import { DocumentsToolbar } from '@/components/documents/documents-toolbar';
import { AppSection } from '@/components/layout/app-section';
import { useHeader } from '@/hooks/use-header';

interface DocumentsPageProps {
  preloaded: Preloaded<typeof api.documents.clientGet>;
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
    else setBreadcrumbs([{ text: '404 Not Found' }]);
    return () => setBreadcrumbs([]);
  }, [document, setBreadcrumbs]);

  if (!document) {
    return (
      <AppSection>
        <EmptySection
          icon={FileTextIcon}
          title="404 Not Found"
          description="The document record could not be found."
        >
          <Link href="/documents">
            <Button className="cursor-pointer">
              <FileTextIcon />
              Check Documents
            </Button>
          </Link>
        </EmptySection>
      </AppSection>
    );
  }

  return (
    <AppSection className="flex flex-col gap-3 md:gap-5">
      <DocumentsToolbar document={document} />
      <DocumentsEditor document={document} />
    </AppSection>
  );
}
