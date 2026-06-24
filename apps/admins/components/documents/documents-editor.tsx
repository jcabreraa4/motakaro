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
  }, [realtime]);

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
          class: 'focus:outline-none rounded-md xl:border min-h-[1054px] xl:px-[56px] xl:py-10'
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
      <section className="w-full flex-1 overflow-y-scroll">
        <div className="mx-auto my-4 flex min-h-[70vh] w-full max-w-204 items-center justify-center rounded-lg border border-[#C7C7C7] bg-white px-4 md:px-0">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex-1 overflow-y-auto">
      <div className="mx-auto max-w-204 p-2 lg:my-5 lg:p-0">
        <EditorContent editor={editor} />
      </div>
    </section>
  );
}
