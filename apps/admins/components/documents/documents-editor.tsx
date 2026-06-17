import { useEffect } from 'react';

import { useTiptapSync } from '@convex-dev/prosemirror-sync/tiptap';
import { EditorContent, useEditor as useTiptap } from '@tiptap/react';
import { Loader2 } from 'lucide-react';

import { api } from '@workspace/backend/_generated/api';
import type { Document } from '@workspace/backend/schema';

import { useEditor } from '@/hooks/use-editor';
import { tiptapExtensions } from '@/lib/documents/tiptap';

export function DocumentsEditor({ document }: { document: Document }) {
  const { setEditor } = useEditor();

  const realtime = useTiptapSync(api.prosemirror, document._id);

  useEffect(() => {
    if (realtime.isLoading || realtime.initialContent !== null || !realtime.create) return;
    void realtime.create({ type: 'doc', content: [] });
  }, [realtime.isLoading, realtime.initialContent, realtime.create, realtime]);

  const editor = useTiptap(
    {
      content: realtime.initialContent ?? undefined,
      onCreate({ editor }) {
        setEditor(editor);
      },
      onDestroy() {
        setEditor(null);
      },
      onUpdate({ editor }) {
        setEditor(editor);
      },
      onSelectionUpdate({ editor }) {
        setEditor(editor);
      },
      onTransaction({ editor }) {
        setEditor(editor);
      },
      onFocus({ editor }) {
        setEditor(editor);
      },
      onBlur({ editor }) {
        setEditor(editor);
      },
      onContentError({ editor }) {
        setEditor(editor);
      },
      editorProps: {
        attributes: {
          class: 'focus:outline-none bg-white dark:bg-primary rounded-md xl:border border-[#C7C7C7] min-h-[1054px] xl:px-[56px] xl:pt-10 xl:pb-10 print:bg-white print:dark:bg-white'
        }
      },
      extensions: [...tiptapExtensions, ...(realtime.extension ? [realtime.extension] : [])],
      immediatelyRender: false,
      editable: !realtime.isLoading && realtime.initialContent !== null
    },
    [document._id, realtime.extension, realtime.initialContent]
  );

  if (realtime.isLoading || realtime.initialContent === null || !realtime.extension) {
    return (
      <div className="w-full flex-1 overflow-y-scroll">
        <div className="mx-auto my-4 flex min-h-[70vh] w-full max-w-204 items-center justify-center rounded-lg border border-[#C7C7C7] bg-white px-4 md:px-0">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 overflow-y-scroll">
      <div className="mx-auto w-full max-w-204 rounded-lg bg-white px-2 py-2 lg:my-4 lg:px-0 lg:py-0 dark:bg-primary">
        <EditorContent
          editor={editor}
          className="w-full dark:text-black"
        />
      </div>
    </div>
  );
}
