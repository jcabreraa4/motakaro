import { preloadQuery } from 'convex/nextjs';

import { api } from '@workspace/backend/_generated/api';

import { DocumentsPage } from '@/components/documents/documents-page';
import { runConvex } from '@/server/run-convex';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { token } = await runConvex();
  const document = await preloadQuery(api.documents.get, { id }, { token });

  return <DocumentsPage preloaded={document} />;
}
