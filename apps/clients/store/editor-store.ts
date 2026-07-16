import type { Editor } from '@tiptap/react';
import { create } from 'zustand';

interface EditorStore {
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  editor: null,
  setEditor: (editor: Editor | null) => set({ editor })
}));
