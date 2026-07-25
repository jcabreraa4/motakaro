import type { Editor } from '@tiptap/react';
import { create } from 'zustand';

interface TiptapStore {
  tiptap: Editor | null;
  setTiptap: (tiptap: Editor | null) => void;
}

export const useTiptapStore = create<TiptapStore>((set) => ({
  tiptap: null,
  setTiptap: (tiptap: Editor | null) => set({ tiptap })
}));
