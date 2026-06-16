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

  // Primary Functions
  function undo() {
    editor?.chain().focus().undo().run();
  }

  function redo() {
    editor?.chain().focus().redo().run();
  }

  function toggleBold() {
    editor?.chain().focus().toggleBold().run();
  }

  function toggleItalic() {
    editor?.chain().focus().toggleItalic().run();
  }

  function toggleUnderline() {
    editor?.chain().focus().toggleUnderline().run();
  }

  function toggleTaskList() {
    editor?.chain().focus().toggleTaskList().run();
  }

  function toggleBulletList() {
    editor?.chain().focus().toggleBulletList().run();
  }

  function toggleOrderedList() {
    editor?.chain().focus().toggleOrderedList().run();
  }

  function unsetAllMarks() {
    editor?.chain().focus().unsetAllMarks().run();
  }

  function toggleSpellcheck() {
    const current = editor?.view.dom.getAttribute('spellcheck');
    editor?.view.dom.setAttribute('spellcheck', current === 'false' ? 'true' : 'false');
  }

  // Advanced Functions
  function insertTable({ rows, cols }: InsertTableProps) {
    editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();
  }

  function setLineHeight({ height }: SetLineHeightProps) {
    editor?.chain().focus().toggleTextStyle({ lineHeight: height }).run();
  }

  return { editor, setEditor, undo, redo, toggleBold, toggleItalic, toggleUnderline, toggleTaskList, toggleBulletList, toggleOrderedList, unsetAllMarks, toggleSpellcheck, insertTable, setLineHeight };
}
