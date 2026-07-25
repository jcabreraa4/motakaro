import { useRouter } from 'next/navigation';

import { BoldIcon, ItalicIcon, LucideIcon, PenIcon, PrinterIcon, Redo2Icon, RemoveFormattingIcon, SpellCheckIcon, TrashIcon, UnderlineIcon, Undo2Icon } from 'lucide-react';

import type { Document } from '@workspace/backend/schema';
import { EditorAlign } from '@workspace/tiptap/components/editor-align';
import { EditorColor } from '@workspace/tiptap/components/editor-color';
import { EditorHighlight } from '@workspace/tiptap/components/editor-highlight';
import { EditorImage } from '@workspace/tiptap/components/editor-image';
import { EditorLink } from '@workspace/tiptap/components/editor-link';
import { EditorLists } from '@workspace/tiptap/components/editor-lists';
import { EditorSize } from '@workspace/tiptap/components/editor-size';
import { EditorSpacing } from '@workspace/tiptap/components/editor-spacing';
import { EditorTable } from '@workspace/tiptap/components/editor-table';
import { useTiptap } from '@workspace/tiptap/hooks/use-tiptap';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { cn } from '@workspace/ui/lib/utils';

import { DocumentsRemove } from '@/components/documents/documents-remove';
import { DocumentsUpdate } from '@/components/documents/documents-update';

interface ToolbarButtonProps {
  icon: LucideIcon;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

function ToolbarButton({ icon: Icon, isActive, disabled, onClick, className }: ToolbarButtonProps) {
  return (
    <Button
      size="icon"
      variant={isActive ? 'secondary' : 'ghost'}
      className={cn('cursor-pointer', className)}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon />
    </Button>
  );
}

function ToolbarSeparator({ className }: { className?: string }) {
  return (
    <Separator
      orientation="vertical"
      className={cn('mx-1 max-h-6 min-w-0.5', className)}
    />
  );
}

export function DocumentsToolbar({ document }: { document: Document }) {
  const { push } = useRouter();
  const { actions, format } = useTiptap();

  return (
    <section className="flex w-full items-center overflow-x-auto overflow-y-hidden print:hidden">
      <div className="hidden items-center gap-1 lg:flex">
        <DocumentsUpdate document={document}>
          <ToolbarButton icon={PenIcon} />
        </DocumentsUpdate>
        <DocumentsRemove
          id={document._id}
          onSuccess={() => push('/documents')}
        >
          <ToolbarButton icon={TrashIcon} />
        </DocumentsRemove>
        <ToolbarButton
          icon={PrinterIcon}
          onClick={() => window.print()}
        />
      </div>
      <ToolbarSeparator className="hidden lg:flex" />
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={Undo2Icon}
          onClick={actions.undo.execute}
          isActive={actions.undo.canExecute}
        />
        <ToolbarButton
          icon={Redo2Icon}
          onClick={actions.redo.execute}
          isActive={actions.redo.canExecute}
        />
        <ToolbarButton
          icon={SpellCheckIcon}
          onClick={actions.toggleSpellcheck}
          className="hidden lg:flex"
        />
        <ToolbarButton
          icon={RemoveFormattingIcon}
          onClick={actions.unsetAllMarks}
          className="hidden lg:flex"
        />
      </div>
      <ToolbarSeparator />
      <EditorSize />
      <ToolbarSeparator />
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={BoldIcon}
          isActive={format.bold.isActive}
          onClick={format.bold.toggle}
        />
        <ToolbarButton
          icon={ItalicIcon}
          isActive={format.italic.isActive}
          onClick={format.italic.toggle}
        />
        <ToolbarButton
          icon={UnderlineIcon}
          isActive={format.underline.isActive}
          onClick={format.underline.toggle}
        />
        <EditorColor />
        <EditorHighlight />
      </div>
      <ToolbarSeparator />
      <div className="flex items-center gap-1">
        <EditorLink />
        <EditorImage />
        <EditorTable />
        <EditorAlign />
        <EditorSpacing />
        <EditorLists />
      </div>
    </section>
  );
}
