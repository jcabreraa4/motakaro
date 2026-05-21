import { auth } from '@clerk/nextjs/server';
import { preloadQuery } from 'convex/nextjs';

import { api } from '@workspace/backend/_generated/api';

import { DocumentsPage } from '@/components/documents/documents-page';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // Obtain Id
  const { id } = await params;

  // Authenticate Convex
  const { getToken } = await auth();
  const token = await getToken({ template: 'convex' });
  if (!token) throw new Error('Unauthorized');

  // Obtain Preloaded
  const preloaded = await preloadQuery(api.documents.get, { id }, { token });

  // Return Page
  return <DocumentsPage preloaded={preloaded} />;
}
