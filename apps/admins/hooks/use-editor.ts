import { useEditorStore } from '@/store/editor-store';

interface InsertTableProps {
  rows: number;
  cols: number;
}

interface SetLineHeightProps {
  height: string;
}

export function useEditor() {
  const { editor, setEditor } = useEditorStore();

  const actions = {
    undo: {
      execute: () => editor?.chain().focus().undo().run(),
      canExecute: editor?.can().undo()
    },
    redo: {
      execute: () => editor?.chain().focus().redo().run(),
      canExecute: editor?.can().redo()
    },
    unsetAllMarks: () => editor?.chain().focus().unsetAllMarks().run(),
    toggleSpellcheck: () => {
      const current = editor?.view.dom.getAttribute('spellcheck');
      editor?.view.dom.setAttribute('spellcheck', current === 'false' ? 'true' : 'false');
    }
  };

  const format = {
    bold: {
      toggle: () => editor?.chain().focus().toggleBold().run(),
      isActive: editor?.isActive('bold')
    },
    italic: {
      toggle: () => editor?.chain().focus().toggleItalic().run(),
      isActive: editor?.isActive('italic')
    },
    underline: {
      toggle: () => editor?.chain().focus().toggleUnderline().run(),
      isActive: editor?.isActive('underline')
    }
  };

  const structure = {
    bulletList: {
      toggle: () => editor?.chain().focus().toggleBulletList().run(),
      isActive: editor?.isActive('bulletList')
    },
    orderedList: {
      toggle: () => editor?.chain().focus().toggleOrderedList().run(),
      isActive: editor?.isActive('orderedList')
    },
    taskList: {
      toggle: () => editor?.chain().focus().toggleTaskList().run(),
      isActive: editor?.isActive('taskList')
    }
  };

  // Advanced Functions
  function insertTable({ rows, cols }: InsertTableProps) {
    editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();
  }

  function setLineHeight({ height }: SetLineHeightProps) {
    editor?.chain().focus().toggleTextStyle({ lineHeight: height }).run();
  }

  return { editor, setEditor, actions, format, structure, insertTable, setLineHeight };
}
