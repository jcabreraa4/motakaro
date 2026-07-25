import { useTiptapStore } from '@workspace/tiptap/store/tiptap-store';

interface InsertTableProps {
  rows: number;
  cols: number;
}

interface SetLineHeightProps {
  height: string;
}

export function useTiptap() {
  const { tiptap, setTiptap } = useTiptapStore();

  const actions = {
    undo: {
      execute: () => tiptap?.chain().focus().undo().run(),
      canExecute: tiptap?.can().undo()
    },
    redo: {
      execute: () => tiptap?.chain().focus().redo().run(),
      canExecute: tiptap?.can().redo()
    },
    unsetAllMarks: () => tiptap?.chain().focus().unsetAllMarks().run(),
    toggleSpellcheck: () => {
      const current = tiptap?.view.dom.getAttribute('spellcheck');
      tiptap?.view.dom.setAttribute('spellcheck', current === 'false' ? 'true' : 'false');
    }
  };

  const format = {
    bold: {
      toggle: () => tiptap?.chain().focus().toggleBold().run(),
      isActive: tiptap?.isActive('bold')
    },
    italic: {
      toggle: () => tiptap?.chain().focus().toggleItalic().run(),
      isActive: tiptap?.isActive('italic')
    },
    underline: {
      toggle: () => tiptap?.chain().focus().toggleUnderline().run(),
      isActive: tiptap?.isActive('underline')
    }
  };

  const structure = {
    bulletList: {
      toggle: () => tiptap?.chain().focus().toggleBulletList().run(),
      isActive: tiptap?.isActive('bulletList')
    },
    orderedList: {
      toggle: () => tiptap?.chain().focus().toggleOrderedList().run(),
      isActive: tiptap?.isActive('orderedList')
    },
    taskList: {
      toggle: () => tiptap?.chain().focus().toggleTaskList().run(),
      isActive: tiptap?.isActive('taskList')
    }
  };

  // Advanced Functions
  function insertTable({ rows, cols }: InsertTableProps) {
    tiptap?.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();
  }

  function setLineHeight({ height }: SetLineHeightProps) {
    tiptap?.chain().focus().toggleTextStyle({ lineHeight: height }).run();
  }

  return { tiptap, setTiptap, actions, format, structure, insertTable, setLineHeight };
}
