'use client';

import { useEffect } from 'react';

import { emit } from '@tauri-apps/api/event';

export function TauriLoaded() {
  useEffect(() => {
    if (!('__TAURI_INTERNALS__' in window)) {
      return;
    }

    emit('motakaro:app-ready').catch((error: unknown) => {
      console.warn('[tauri] failed to signal app-ready', error);
    });
  }, []);

  return null;
}
