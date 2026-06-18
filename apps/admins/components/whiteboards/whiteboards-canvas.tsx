'use client';

import { useLayoutEffect, useMemo, useState } from 'react';

import { useMutation } from 'convex/react';
import { throttle } from 'lodash';
import { DefaultSpinner, Tldraw, createTLStore, getSnapshot, loadSnapshot } from 'tldraw';
import 'tldraw/tldraw.css';

import { api } from '@workspace/backend/_generated/api';
import type { Whiteboard } from '@workspace/backend/schema';

export function WhiteboardsEditor({ whiteboard }: { whiteboard: Whiteboard }) {
  const update = useMutation(api.whiteboards.update);

  // [1] Store creado fuera del render, estable
  const store = useMemo(() => createTLStore(), []);

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useLayoutEffect(() => {
    setStatus('loading');

    // [2] Cargar snapshot de Convex al montar
    if (whiteboard.content) {
      try {
        loadSnapshot(store, JSON.parse(whiteboard.content));
      } catch {
        // content corrupto o vacío, canvas en blanco
      }
    }
    setStatus('ready');

    // [3] Escuchar cambios y guardar solo document en Convex
    const unsub = store.listen(
      throttle(() => {
        const { document } = getSnapshot(store);
        update({
          id: whiteboard._id,
          content: JSON.stringify({ document })
        });
      }, 500)
    );

    return () => unsub();
  }, [store]); // solo store, estable

  if (status === 'loading') {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <DefaultSpinner />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <Tldraw store={store} />
    </div>
  );
}
