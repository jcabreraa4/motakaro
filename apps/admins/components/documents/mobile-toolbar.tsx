import { BoldIcon, ItalicIcon, PrinterIcon, Redo2Icon, RemoveFormattingIcon, UnderlineIcon, Undo2Icon, DownloadIcon, FileBracesCorner, FileCodeCorner, FilePenIcon, FileTextIcon, GlobeIcon, StrikethroughIcon, TextIcon, TrashIcon } from 'lucide-react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from '@workspace/ui/components/menubar';
import { UpdateDialog } from '@/components/documents/update-dialog';
import { RemoveDialog } from '@/components/documents/remove-dialog';
import type { Document } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { useEditorStore } from '@/store/editor-store';
import { cn } from '@workspace/ui/lib/utils';
import { toast } from 'sonner';

interface MobileToolbarProps {
  document: Document;
  className?: string;
}

function onDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  toast.success('Document ready to be downloaded.');
}

export function MobileToolbar({ document, className }: MobileToolbarProps) {
  const { editor } = useEditorStore();

  function insertTable({ rows, cols }: { rows: number; cols: number }) {
    editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();
  }

  function onSaveJSON() {
    if (!editor) return;
    const content = editor.getJSON();
    const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
    onDownload(blob, `${document.name}.json`);
  }

  function onSaveHTML() {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], { type: 'text/html' });
    onDownload(blob, `${document.name}.html`);
  }

  function onSaveText() {
    if (!editor) return;
    const content = editor.getText();
    const blob = new Blob([content], { type: 'text/plain' });
    onDownload(blob, `${document.name}.txt`);
  }

  return (
    <Menubar className={cn('h-auto border-none bg-transparent p-0 shadow-none print:hidden', className)}>
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer dark:hover:bg-secondary"
          >
            File
          </Button>
        </MenubarTrigger>
        <MenubarContent className="print:hidden">
          <MenubarSub>
            <MenubarSubTrigger>
              <DownloadIcon className="mr-2 size-4" />
              Download
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem onClick={() => window.print()}>
                <GlobeIcon className="mr-2 size-4" />
                PDF
              </MenubarItem>
              <MenubarItem onClick={onSaveJSON}>
                <FileBracesCorner className="mr-2 size-4" />
                JSON
              </MenubarItem>
              <MenubarItem onClick={onSaveHTML}>
                <FileCodeCorner className="mr-2 size-4" />
                HTML
              </MenubarItem>
              <MenubarItem onClick={onSaveText}>
                <FileTextIcon className="mr-2 size-4" />
                TXT
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <UpdateDialog
            id={document._id}
            name={document.name}
            note={document.note}
          >
            <MenubarItem onSelect={(e) => e.preventDefault()}>
              <FilePenIcon className="mr-2 size-4" />
              Update
            </MenubarItem>
          </UpdateDialog>
          <RemoveDialog
            redirect
            id={document._id}
          >
            <MenubarItem onSelect={(e) => e.preventDefault()}>
              <TrashIcon className="mr-2 size-4" />
              Delete
            </MenubarItem>
          </RemoveDialog>
          <MenubarSeparator />
          <MenubarItem onClick={() => window.print()}>
            <PrinterIcon className="mr-2 size-4" />
            Print <MenubarShortcut>Ctrl+P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer dark:hover:bg-secondary"
          >
            Edit
          </Button>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
            <Undo2Icon className="mr-2 size-4" />
            Undo <MenubarShortcut>Ctrl+Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
            <Redo2Icon className="mr-2 size-4" />
            Redo <MenubarShortcut>Ctrl+Y</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer dark:hover:bg-secondary"
          >
            Insert
          </Button>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Table</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem onClick={() => insertTable({ rows: 1, cols: 1 })}>1 x 1</MenubarItem>
              <MenubarItem onClick={() => insertTable({ rows: 2, cols: 2 })}>2 x 2</MenubarItem>
              <MenubarItem onClick={() => insertTable({ rows: 3, cols: 3 })}>3 x 3</MenubarItem>
              <MenubarItem onClick={() => insertTable({ rows: 4, cols: 4 })}>4 x 4</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer dark:hover:bg-secondary"
          >
            Format
          </Button>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>
              <TextIcon className="mr-2 size-4" />
              Text
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}>
                <BoldIcon className="mr-2 size-4" />
                Bold <MenubarShortcut>Ctrl+B</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
                <ItalicIcon className="mr-2 size-4" />
                Italic <MenubarShortcut>Ctrl+I</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                <UnderlineIcon className="mr-2 size-4" />
                Underline <MenubarShortcut>Ctrl+U</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={() => editor?.chain().focus().toggleStrike().run()}>
                <StrikethroughIcon className="mr-2 size-4" />
                Strike <MenubarShortcut>Ctrl+S</MenubarShortcut>
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
            <RemoveFormattingIcon className="mr-2 size-4" />
            Clear Formatting
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
