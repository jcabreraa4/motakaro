import { useTiptapStore } from '@workspace/tiptap/store/tiptap-store';

interface InsertImageProps {
  src: string;
}

interface InsertTableProps {
  rows: number;
  cols: number;
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

  const color = {
    value: tiptap?.getAttributes('textStyle').color,
    set: (value: string) => tiptap?.chain().focus().setColor(value).run(),
    unset: () => tiptap?.chain().focus().unsetColor().run()
  };

  const highlight = {
    value: tiptap?.getAttributes('highlight').color,
    set: (color: string) => tiptap?.chain().focus().setHighlight({ color }).run(),
    unset: () => tiptap?.chain().focus().unsetHighlight().run()
  };

  const lineHeight = {
    value: tiptap?.getAttributes('textStyle').lineHeight,
    set: (height: string) => tiptap?.chain().focus().toggleTextStyle({ lineHeight: height }).run()
  };

  const align = {
    isActive: (value: string) => tiptap?.isActive({ textAlign: value }),
    set: (value: string) => tiptap?.chain().focus().setTextAlign(value).run()
  };

  const link = {
    value: tiptap?.getAttributes('link').href,
    set: (href: string) => tiptap?.chain().focus().extendMarkRange('link').setLink({ href }).run()
  };

  function insertImage({ src }: InsertImageProps) {
    tiptap?.chain().focus().setImage({ src }).run();
  }

  function insertTable({ rows, cols }: InsertTableProps) {
    tiptap?.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();
  }

  return { tiptap, setTiptap, actions, format, structure, color, highlight, lineHeight, align, link, insertImage, insertTable };
}
