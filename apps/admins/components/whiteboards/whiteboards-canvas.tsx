'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

import { useMutation, useQuery } from 'convex/react';
import { throttle } from 'lodash';
import { Tldraw, createTLStore, getSnapshot, loadSnapshot } from 'tldraw';

import { api } from '@workspace/backend/_generated/api';
import type { Whiteboard } from '@workspace/backend/schema';

export function WhiteboardsCanvas({ whiteboard }: { whiteboard: Whiteboard }) {
  const { theme } = useTheme();

  const updateWhiteboard = useMutation(api.whiteboards.update);
  const remoteWhiteboard = useQuery(api.whiteboards.get, { id: whiteboard._id });

  const [canvas] = useState(() => {
    const store = createTLStore();
    if (!whiteboard.content) return { store, content: '' };
    try {
      loadSnapshot(store, JSON.parse(whiteboard.content));
      return { store, content: whiteboard.content };
    } catch {
      return { store, content: '' };
    }
  });

  const store = canvas.store;
  const lastContent = useRef(canvas.content);
  const pendingContent = useRef<string | null>(null);

  useEffect(() => {
    const save = throttle(() => {
      const { document } = getSnapshot(store);
      const content = JSON.stringify({ document });

      lastContent.current = content;
      pendingContent.current = content;
      void updateWhiteboard({ id: whiteboard._id, content });
    }, 500);

    const unsub = store.listen(save, {
      scope: 'document',
      source: 'user'
    });

    return () => {
      save.cancel();
      unsub();
    };
  }, [store, updateWhiteboard, whiteboard._id]);

  useEffect(() => {
    if (!remoteWhiteboard?.content) return;
    if (remoteWhiteboard.content === pendingContent.current) {
      pendingContent.current = null;
      return;
    }
    if (remoteWhiteboard.content === lastContent.current) return;
    try {
      const { document } = JSON.parse(remoteWhiteboard.content);
      store.mergeRemoteChanges(() => loadSnapshot(store, { document }));
      lastContent.current = remoteWhiteboard.content;
    } catch {
      return;
    }
  }, [store, remoteWhiteboard?.content]);

  return (
    <div className="relative isolate h-full w-full">
      <Tldraw
        store={store}
        colorScheme={theme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
}
