import { useTiptapSync } from '@convex-dev/prosemirror-sync/tiptap';
import { Id } from '@workspace/backend/_generated/dataModel';
import { tiptapExtensions } from '@/lib/documents/tiptap';
import { useEditor, EditorContent } from '@tiptap/react';
import { api } from '@workspace/backend/_generated/api';
import { useEditorStore } from '@/store/editor-store';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export function DocumentsPaper({ paperId }: { paperId: Id<'documents'> }) {
  const { setEditor } = useEditorStore();
  const sync = useTiptapSync(api.prosemirror, paperId);

  useEffect(() => {
    if (sync.isLoading || sync.initialContent !== null || !sync.create) return;
    void sync.create({ type: 'doc', content: [] });
  }, [sync.isLoading, sync.initialContent, sync.create, sync]);

  const editor = useEditor(
    {
      content: sync.initialContent ?? undefined,
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
      extensions: [...tiptapExtensions, ...(sync.extension ? [sync.extension] : [])],
      immediatelyRender: false,
      editable: !sync.isLoading && sync.initialContent !== null
    },
    [paperId, sync.extension, sync.initialContent]
  );

  if (sync.isLoading || sync.initialContent === null || !sync.extension) {
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
