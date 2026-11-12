'use client';

import { useEffect } from 'react';

import { emit } from '@tauri-apps/api/event';

/**
 * Signals the Tauri desktop shell that this app has hydrated and is ready to
 * be shown (the shell shows a splash screen until this event arrives).
 * No-op when running in a regular browser.
 */
export function TauriReadySignal() {
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
