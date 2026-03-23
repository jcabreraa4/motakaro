import { EditorMain } from '@/components/documents/editor-main';
import { api } from '@workspace/backend/_generated/api';
import { preloadQuery } from 'convex/nextjs';
import { auth } from '@clerk/nextjs/server';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { getToken } = await auth();
  const token = await getToken({ template: 'convex' });
  if (!token) throw new Error('Unauthorized');
  const preloaded = await preloadQuery(api.documents.get, { id }, { token });
  return <EditorMain preloadedDocument={preloaded} />;
}
