import { Preloaded, usePreloadedQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';

export function useEditor(preloadedDocument: Preloaded<typeof api.documents.get>) {
  const document = usePreloadedQuery(preloadedDocument);

  return { document };
}
