import { useState } from 'react';

import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, ChevronDownIcon, DownloadIcon, FileBracesCorner, FileCodeCorner, FilePenIcon, FileTextIcon, GlobeIcon, HighlighterIcon, ImageIcon, ItalicIcon, Link2Icon, ListCollapseIcon, ListIcon, ListOrderedIcon, ListTodoIcon, LucideIcon, MinusIcon, PlusIcon, PrinterIcon, Redo2Icon, RemoveFormattingIcon, SearchIcon, SpellCheckIcon, StrikethroughIcon, TableIcon, TextIcon, UnderlineIcon, Undo2Icon, UploadIcon } from 'lucide-react';
import { toast } from 'sonner';

import type { Document } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';
import { Input } from '@workspace/ui/components/input';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from '@workspace/ui/components/menubar';
import { Separator } from '@workspace/ui/components/separator';
import { cn } from '@workspace/ui/lib/utils';

import { DocumentsUpdate } from '@/components/documents/documents-update';
import { useEditor } from '@/hooks/use-editor';

function MobileToolbar({ document }: { document: Document }) {
  const { editor } = useEditor();

  function downloadJSON() {
    if (!editor) return;
    const content = editor.getJSON();
    const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
    onDownload(blob, `${document.name}.json`);
  }

  function downloadHTML() {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], { type: 'text/html' });
    onDownload(blob, `${document.name}.html`);
  }

  function downloadTXT() {
    if (!editor) return;
    const content = editor.getText();
    const blob = new Blob([content], { type: 'text/plain' });
    onDownload(blob, `${document.name}.txt`);
  }

  function insertTable({ rows, cols }: { rows: number; cols: number }) {
    editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();
  }

  return (
    <Menubar className="h-auto border-none bg-transparent p-0 shadow-none lg:hidden print:hidden">
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
              <MenubarItem onClick={downloadJSON}>
                <FileBracesCorner className="mr-2 size-4" />
                JSON
              </MenubarItem>
              <MenubarItem onClick={downloadHTML}>
                <FileCodeCorner className="mr-2 size-4" />
                HTML
              </MenubarItem>
              <MenubarItem onClick={downloadTXT}>
                <FileTextIcon className="mr-2 size-4" />
                TXT
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <DocumentsUpdate document={document}>
            <MenubarItem onSelect={(e) => e.preventDefault()}>
              <FilePenIcon className="mr-2 size-4" />
              Update
            </MenubarItem>
          </DocumentsUpdate>
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

function onDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  toast.success('Document ready to be downloaded.');
}

function DownloadMenubar({ title }: { title: string }) {
  const { editor } = useEditor();

  function onDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    toast.success('Paper ready to be downloaded.');
  }

  function onSaveJSON() {
    if (!editor) return;
    const content = editor.getJSON();
    const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
    onDownload(blob, `${title}.json`);
  }

  function onSaveHTML() {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], { type: 'text/html' });
    onDownload(blob, `${title}.html`);
  }

  function onSaveText() {
    if (!editor) return;
    const content = editor.getText();
    const blob = new Blob([content], { type: 'text/plain' });
    onDownload(blob, `${title}.txt`);
  }

  return (
    <Menubar className="h-auto border-none bg-transparent p-0 shadow-none">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer dark:hover:bg-secondary"
          >
            <DownloadIcon />
          </Button>
        </MenubarTrigger>
        <MenubarContent className="print:hidden">
          <MenubarItem onClick={() => window.print()}>
            <GlobeIcon className="mr-1" />
            PDF
          </MenubarItem>
          <MenubarItem onClick={onSaveJSON}>
            <FileBracesCorner className="mr-1" />
            JSON
          </MenubarItem>
          <MenubarItem onClick={onSaveHTML}>
            <FileCodeCorner className="mr-1" />
            HTML
          </MenubarItem>
          <MenubarItem onClick={onSaveText}>
            <FileTextIcon className="mr-1" />
            TXT
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

function FontSizeButton() {
  const { editor } = useEditor();

  const currentFontSize = editor?.getAttributes('textStyle').fontSize || '16px';

  const [fontSize, setFontSize] = useState('16');
  const [inputValue, setInputValue] = useState(fontSize);
  const [isEditing, setIsEditing] = useState(false);

  function updateFontSize(newSize: string) {
    const size = parseInt(newSize);
    if (!isNaN(size) && size > 0) {
      editor?.chain().focus().setFontSize(`${size}px`).run();
      setFontSize(newSize);
      setInputValue(newSize);
      setIsEditing(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function handleInputBlur() {
    updateFontSize(inputValue);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      updateFontSize(inputValue);
      editor?.commands.focus();
    }
  }

  function increment() {
    const newSize = parseInt(fontSize) + 1;
    updateFontSize(newSize.toString());
  }

  function decrement() {
    const newSize = parseInt(fontSize) - 1;
    if (newSize > 0) {
      updateFontSize(newSize.toString());
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={decrement}
        className="cursor-pointer dark:hover:bg-secondary"
      >
        <MinusIcon />
      </Button>
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="h-7 w-10 rounded-sm border border-neutral-400 bg-transparent text-center text-sm focus:ring-0 focus:outline-none"
        />
      ) : (
        <Button
          variant="ghost"
          onClick={() => {
            setIsEditing(true);
            setFontSize(currentFontSize);
          }}
          className="w-10 cursor-text dark:hover:bg-secondary"
        >
          {currentFontSize}
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={increment}
        className="cursor-pointer dark:hover:bg-secondary"
      >
        <PlusIcon />
      </Button>
    </div>
  );
}

function LinkButton() {
  const { editor } = useEditor();
  const [value, setValue] = useState('');

  function onChange(href: string) {
    editor?.chain().focus().extendMarkRange('link').setLink({ href }).run();
    setValue('');
  }

  return (
    <DropdownMenu onOpenChange={(open) => open && setValue(editor?.getAttributes('link').href || '')}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer dark:hover:bg-secondary"
        >
          <Link2Icon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex w-60 gap-1">
        <Input
          placeholder="https://example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          className="cursor-pointer"
          onClick={() => onChange(value)}
        >
          Apply
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ColorSwatch({ color, active, onClick }: { color?: string; active: boolean; onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      style={color ? { backgroundColor: color } : undefined}
      className={cn('size-6 cursor-pointer rounded-full border border-black/25 transition-transform hover:scale-110', !color && 'bg-black dark:bg-white', active && 'outline-2 outline-offset-2 outline-black dark:outline-white')}
    />
  );
}

function HighlightColorButton() {
  const { editor } = useEditor();

  const colors = ['#FFD54F', '#AED581', '#81C784', '#4FC3F7', '#64B5F6', '#FF8A65', '#FFAB91', '#F48FB1', '#CE93D8', '#E0E0E0', '#BCAAA4'];

  const value = editor?.getAttributes('highlight').color;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer dark:hover:bg-secondary"
        >
          <HighlighterIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit p-2">
        <div className="grid grid-cols-6 gap-1.5">
          <ColorSwatch
            active={!value}
            onClick={() => editor?.chain().focus().unsetHighlight().run()}
          />
          {colors.map((color) => (
            <ColorSwatch
              key={color}
              color={color}
              active={value === color}
              onClick={() => editor?.chain().focus().setHighlight({ color }).run()}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TextColorButton() {
  const { editor } = useEditor();

  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#808080', '#FFC0CB', '#A52A2A'];

  const value = editor?.getAttributes('textStyle').color;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex cursor-pointer flex-col gap-1 dark:hover:bg-secondary"
        >
          <span
            className="border-b-2 px-1"
            style={{ borderColor: value }}
          >
            A
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit p-2">
        <div className="grid grid-cols-6 gap-1.5">
          <ColorSwatch
            active={!value}
            onClick={() => editor?.chain().focus().unsetColor().run()}
          />
          {colors.map((color) => (
            <ColorSwatch
              key={color}
              color={color}
              active={value === color}
              onClick={() => editor?.chain().focus().setColor(color).run()}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FontFamilyDropdown() {
  const { editor } = useEditor();

  const fonts = [
    {
      label: 'Arial',
      value: 'Arial',
      isActive: editor?.getAttributes('textStyle').fontFamily === 'Arial'
    },
    {
      label: 'Times New Roman',
      value: 'Times New Roman',
      isActive: editor?.getAttributes('textStyle').fontFamily === 'Times New Roman'
    },
    {
      label: 'Courier New',
      value: 'Courier New',
      isActive: editor?.getAttributes('textStyle').fontFamily === 'Courier New'
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-35 cursor-pointer justify-between dark:hover:bg-secondary"
        >
          <span className="truncate">{editor?.getAttributes('textStyle').fontFamily || 'Arial'}</span>
          <ChevronDownIcon className="ml-2 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-1 p-1">
        {fonts.map(({ label, value, isActive }) => (
          <Button
            key={value}
            style={{ fontFamily: value }}
            variant={isActive ? 'secondary' : 'ghost'}
            onClick={() => editor?.chain().focus().setFontFamily(value).run()}
          >
            <span className="text-sm">{label}</span>
          </Button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ImageDropdown() {
  const { editor } = useEditor();

  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  function onChange(src: string) {
    editor?.chain().focus().setImage({ src }).run();
  }

  function onUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        onChange(imageUrl);
      }
    };
    input.click();
  }

  function handleImageUrlSubmit() {
    if (imageUrl) {
      onChange(imageUrl);
      setImageUrl('');
      setIsSearchDialogOpen(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer dark:hover:bg-secondary"
          >
            <ImageIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">
          <DropdownMenuItem onClick={onUpload}>
            <UploadIcon />
            Upload Image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsSearchDialogOpen(true)}>
            <SearchIcon />
            Insert Image
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog
        open={isSearchDialogOpen}
        onOpenChange={setIsSearchDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="https://image.png"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleImageUrlSubmit()}
          />
          <DialogFooter>
            <Button
              onClick={handleImageUrlSubmit}
              className="w-full cursor-pointer"
            >
              <PlusIcon />
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TableMenubar() {
  const { insertTable } = useEditor();

  return (
    <Menubar className="h-auto border-none bg-transparent p-0 shadow-none print:hidden">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer dark:hover:bg-secondary"
          >
            <TableIcon />
          </Button>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => insertTable({ rows: 1, cols: 1 })}>1 x 1</MenubarItem>
          <MenubarItem onClick={() => insertTable({ rows: 2, cols: 2 })}>2 x 2</MenubarItem>
          <MenubarItem onClick={() => insertTable({ rows: 3, cols: 3 })}>3 x 3</MenubarItem>
          <MenubarItem onClick={() => insertTable({ rows: 4, cols: 4 })}>4 x 4</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

function AlignDropdown() {
  const { editor } = useEditor();

  const alignments = [
    {
      label: 'Align Left',
      value: 'left',
      icon: AlignLeftIcon,
      isActive: editor?.isActive({ textAlign: 'left' })
    },
    {
      label: 'Align Center',
      value: 'center',
      icon: AlignCenterIcon,
      isActive: editor?.isActive({ textAlign: 'center' })
    },
    {
      label: 'Align Right',
      value: 'right',
      icon: AlignRightIcon,
      isActive: editor?.isActive({ textAlign: 'right' })
    },
    {
      label: 'Align Justify',
      value: 'justify',
      icon: AlignJustifyIcon,
      isActive: editor?.isActive({ textAlign: 'justify' })
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer dark:hover:bg-secondary"
        >
          <AlignLeftIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-1 p-1">
        {alignments.map(({ value, icon: Icon, label, isActive }) => (
          <Button
            key={value}
            variant={isActive ? 'secondary' : 'ghost'}
            onClick={() => editor?.chain().focus().setTextAlign(value).run()}
          >
            <Icon />
            <span className="text-sm">{label}</span>
          </Button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LineHeightDropdown() {
  const { editor } = useEditor();

  const lineHeights = [
    {
      label: 'Simple',
      value: '1.5'
    },
    {
      label: '1.75',
      value: '1.75'
    },
    {
      label: 'Double',
      value: '2.0'
    },
    {
      label: '2.5',
      value: '2.5'
    },
    {
      label: 'Triple',
      value: '3.0'
    }
  ];

  const currentLineHeight = editor?.getAttributes('textStyle').lineHeight || '1.5';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer dark:hover:bg-secondary"
        >
          <ListCollapseIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-1 p-1">
        {lineHeights.map(({ label, value }) => (
          <Button
            key={label}
            variant={currentLineHeight === value ? 'secondary' : 'ghost'}
            onClick={() => editor?.chain().focus().toggleTextStyle({ lineHeight: value }).run()}
            className="justify-start"
          >
            <span className="text-sm">{label}</span>
          </Button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ListDropdown() {
  const { editor, toggleBulletList, toggleOrderedList, toggleTaskList } = useEditor();

  const lists = [
    {
      label: 'Bullet List',
      icon: ListIcon,
      isActive: editor?.isActive('bulletList'),
      onClick: toggleBulletList
    },
    {
      label: 'Ordered List',
      icon: ListOrderedIcon,
      isActive: editor?.isActive('orderedList'),
      onClick: toggleOrderedList
    },
    {
      label: 'Task List',
      icon: ListTodoIcon,
      isActive: editor?.isActive('taskList'),
      onClick: toggleTaskList
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer dark:hover:bg-secondary"
        >
          <ListIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-1 p-1">
        {lists.map(({ icon: Icon, label, onClick, isActive }) => (
          <Button
            key={label}
            variant={isActive ? 'secondary' : 'ghost'}
            onClick={onClick}
          >
            <Icon />
            <span className="text-sm">{label}</span>
          </Button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ToolbarButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  isActive?: boolean;
}

function ToolbarButton({ icon: Icon, onClick, isActive }: ToolbarButtonProps) {
  return (
    <Button
      size="icon"
      variant={isActive ? 'secondary' : 'ghost'}
      className="dark:hover:bg-secondary"
      onClick={onClick}
    >
      <Icon />
    </Button>
  );
}

function ToolbarSeparator() {
  return (
    <Separator
      orientation="vertical"
      className="mx-1 max-h-6 min-w-0.5"
    />
  );
}

export function DocumentsToolbar({ document }: { document: Document }) {
  const { editor, undo, redo, toggleBold, toggleItalic, toggleUnderline, unsetAllMarks, toggleSpellcheck } = useEditor();

  return (
    <>
      <MobileToolbar document={document} />
      <section className="hidden w-full items-center overflow-x-auto overflow-y-hidden lg:flex print:hidden">
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={Undo2Icon}
            onClick={undo}
          />
          <ToolbarButton
            icon={Redo2Icon}
            onClick={redo}
          />
          <ToolbarButton
            icon={SpellCheckIcon}
            onClick={toggleSpellcheck}
          />
          <DownloadMenubar title={document.name} />
        </div>
        <ToolbarSeparator />
        <FontFamilyDropdown />
        <ToolbarSeparator />
        <FontSizeButton />
        <ToolbarSeparator />
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={BoldIcon}
            isActive={editor?.isActive('bold')}
            onClick={toggleBold}
          />
          <ToolbarButton
            icon={ItalicIcon}
            isActive={editor?.isActive('italic')}
            onClick={toggleItalic}
          />
          <ToolbarButton
            icon={UnderlineIcon}
            isActive={editor?.isActive('underline')}
            onClick={toggleUnderline}
          />
          <TextColorButton />
          <HighlightColorButton />
        </div>
        <ToolbarSeparator />
        <div className="flex items-center gap-1">
          <LinkButton />
          <ImageDropdown />
          <TableMenubar />
          <AlignDropdown />
          <LineHeightDropdown />
          <ListDropdown />
          <ToolbarButton
            icon={RemoveFormattingIcon}
            onClick={unsetAllMarks}
          />
        </div>
      </section>
    </>
  );
}
