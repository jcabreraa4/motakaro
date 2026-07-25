import { useEffect } from 'react';

import { useTiptapSync } from '@convex-dev/prosemirror-sync/tiptap';
import { EditorContent, useEditor } from '@tiptap/react';

import { api } from '@workspace/backend/_generated/api';
import type { Document } from '@workspace/backend/schema';
import { extensions } from '@workspace/tiptap/extensions';
import { useTiptap } from '@workspace/tiptap/hooks/use-tiptap';

export function DocumentsEditor({ document }: { document: Document }) {
  const { setTiptap } = useTiptap();

  const realtime = useTiptapSync(api.prosemirror, document._id);

  useEffect(() => {
    if (realtime.isLoading || realtime.initialContent !== null || !realtime.create) return;
    void realtime.create({ type: 'doc', content: [] });
  }, [realtime]);

  const editor = useEditor(
    {
      content: realtime.initialContent ?? undefined,
      onCreate({ editor }) {
        setTiptap(editor);
      },
      onDestroy() {
        setTiptap(null);
      },
      onUpdate({ editor }) {
        setTiptap(editor);
      },
      onSelectionUpdate({ editor }) {
        setTiptap(editor);
      },
      onTransaction({ editor }) {
        setTiptap(editor);
      },
      onFocus({ editor }) {
        setTiptap(editor);
      },
      onBlur({ editor }) {
        setTiptap(editor);
      },
      onContentError({ editor }) {
        setTiptap(editor);
      },
      editorProps: {
        attributes: {
          class: 'focus:outline-none min-h-263.5 xl:px-14 xl:py-10'
        }
      },
      extensions: [...extensions, realtime.extension!],
      immediatelyRender: false,
      editable: !realtime.isLoading && realtime.initialContent !== null
    },
    [document._id, realtime.extension, realtime.initialContent]
  );

  return (
    <section className="h-full overflow-y-auto">
      <div className="mx-auto min-h-263.5 w-full rounded-md p-2 xl:max-w-204 xl:border xl:p-0">{!realtime.isLoading && <EditorContent editor={editor} />}</div>
    </section>
  );
}
