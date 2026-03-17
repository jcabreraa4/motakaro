import { type LucideIcon, AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, ChevronDownIcon, HighlighterIcon, ImageIcon, ItalicIcon, Link2Icon, ListCollapseIcon, ListIcon, ListOrderedIcon, ListTodoIcon, MinusIcon, PlusIcon, Redo2Icon, RemoveFormattingIcon, SearchIcon, SpellCheckIcon, UnderlineIcon, Undo2Icon, UploadIcon, DownloadIcon, FileBracesCorner, FileCodeCorner, FileTextIcon, GlobeIcon, TableIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@workspace/ui/components/menubar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { type ColorResult, CirclePicker } from 'react-color';
import type { Document } from '@workspace/backend/schema';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { useEditorStore } from '@/store/editor-store';
import { cn } from '@workspace/ui/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

interface ToolbarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
}

interface ToolbarSectionsType {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
}

interface DesktopToolbarProps {
  document: Document;
  className?: string;
}

function LineHeightButton() {
  const { editor } = useEditorStore();

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
          className="dark:hover:bg-secondary"
        >
          <ListCollapseIcon className="size-4" />
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

function FontSizeButton() {
  const { editor } = useEditorStore();

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
        <MinusIcon className="size-4" />
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
        <PlusIcon className="size-4" />
      </Button>
    </div>
  );
}

function ListButton() {
  const { editor } = useEditorStore();

  const lists = [
    {
      label: 'Bullet List',
      icon: ListIcon,
      isActive: editor?.isActive('bulletList'),
      onClick: () => editor?.chain().focus().toggleBulletList().run()
    },
    {
      label: 'Ordered List',
      icon: ListOrderedIcon,
      isActive: editor?.isActive('orderedList'),
      onClick: () => editor?.chain().focus().toggleOrderedList().run()
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="dark:hover:bg-secondary"
        >
          <ListIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-1 p-1">
        {lists.map(({ label, icon: Icon, onClick, isActive }) => (
          <Button
            key={label}
            variant={isActive ? 'secondary' : 'ghost'}
            onClick={onClick}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </Button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AlignButton() {
  const { editor } = useEditorStore();

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
          className="dark:hover:bg-secondary"
        >
          <AlignLeftIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-1 p-1">
        {alignments.map(({ label, value, icon: Icon, isActive }) => (
          <Button
            key={value}
            variant={isActive ? 'secondary' : 'ghost'}
            onClick={() => editor?.chain().focus().setTextAlign(value).run()}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </Button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TableButton() {
  const { editor } = useEditorStore();

  function insertTable({ rows, cols }: { rows: number; cols: number }) {
    editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();
  }

  return (
    <Menubar className="h-auto border-none bg-transparent p-0 shadow-none print:hidden">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer dark:hover:bg-secondary"
          >
            <TableIcon className="size-4" />
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

function ImageButton() {
  const { editor } = useEditorStore();

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
            className="dark:hover:bg-secondary"
          >
            <ImageIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">
          <DropdownMenuItem onClick={onUpload}>
            <UploadIcon className="mr-2 size-4" />
            Upload image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsSearchDialogOpen(true)}>
            <SearchIcon className="mr-2 size-4" />
            Insert image URL
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
            placeholder="Insert image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleImageUrlSubmit()}
          />
          <DialogFooter>
            <Button
              onClick={handleImageUrlSubmit}
              className="w-full cursor-pointer"
            >
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function LinkButton() {
  const { editor } = useEditorStore();
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
          className="dark:hover:bg-secondary"
        >
          <Link2Icon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex gap-1">
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

function HighlightColorButton() {
  const { editor } = useEditorStore();

  const colors = ['#FFEB3B', '#FFD54F', '#AED581', '#81C784', '#4FC3F7', '#64B5F6', '#FF8A65', '#FFAB91', '#F48FB1', '#CE93D8', '#E0E0E0', '#BCAAA4'];

  const value = editor?.getAttributes('highlight').color || '#FFFFFF';

  function onChange(color: ColorResult) {
    editor?.chain().focus().setHighlight({ color: color.hex }).run();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="dark:hover:bg-secondary"
        >
          <HighlighterIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <CirclePicker
          colors={colors}
          color={value}
          onChangeComplete={onChange}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TextColorButton() {
  const { editor } = useEditorStore();

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#808080', '#FFC0CB', '#A52A2A'];

  const value = editor?.getAttributes('textStyle').color || '#000000';

  function onChange(color: ColorResult) {
    editor?.chain().focus().setColor(color.hex).run();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex flex-col gap-1 dark:hover:bg-secondary"
        >
          <span
            className="border-b-2 px-1"
            style={{ borderColor: value }}
          >
            A
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5">
        <CirclePicker
          colors={colors}
          color={value}
          onChangeComplete={onChange}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FontFamilyButton() {
  const { editor } = useEditorStore();

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
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
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

function DownloadButton({ title }: { title: string }) {
  const { editor } = useEditorStore();

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
            <DownloadIcon className="size-4" />
          </Button>
        </MenubarTrigger>
        <MenubarContent className="print:hidden">
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
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

function ToolbarButton({ onClick, isActive, icon: Icon }: ToolbarButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      variant={isActive ? 'secondary' : 'ghost'}
      className="dark:hover:bg-secondary"
    >
      <Icon className="size-4" />
    </Button>
  );
}

function ToolbarSeparator() {
  return <div className="mx-1 h-6 w-0.5 bg-neutral-300" />;
}

export function DesktopToolbar({ document, className }: DesktopToolbarProps) {
  const { editor } = useEditorStore();

  const sections: ToolbarSectionsType[][] = [
    [
      {
        label: 'Undo',
        icon: Undo2Icon,
        onClick: () => editor?.chain().focus().undo().run()
      },
      {
        label: 'Redo',
        icon: Redo2Icon,
        onClick: () => editor?.chain().focus().redo().run()
      },
      {
        label: 'Spell Check',
        icon: SpellCheckIcon,
        onClick: () => {
          const current = editor?.view.dom.getAttribute('spellcheck');
          editor?.view.dom.setAttribute('spellcheck', current === 'false' ? 'true' : 'false');
        }
      }
    ],
    [
      {
        label: 'Bold',
        icon: BoldIcon,
        isActive: editor?.isActive('bold'),
        onClick: () => editor?.chain().focus().toggleBold().run()
      },
      {
        label: 'Italic',
        icon: ItalicIcon,
        isActive: editor?.isActive('italic'),
        onClick: () => editor?.chain().focus().toggleItalic().run()
      },
      {
        label: 'Underline',
        icon: UnderlineIcon,
        isActive: editor?.isActive('underline'),
        onClick: () => editor?.chain().focus().toggleUnderline().run()
      }
    ],
    [
      {
        label: 'List Todo',
        icon: ListTodoIcon,
        isActive: editor?.isActive('taskList'),
        onClick: () => editor?.chain().focus().toggleTaskList().run()
      },
      {
        label: 'Remove Formatting',
        icon: RemoveFormattingIcon,
        onClick: () => editor?.chain().focus().unsetAllMarks().run()
      }
    ]
  ];

  return (
    <section className={cn('flex w-full items-center overflow-x-auto print:hidden', className)}>
      <div className="flex items-center gap-2">
        {sections[0]!.map((item) => (
          <ToolbarButton
            key={item.label}
            {...item}
          />
        ))}
        <DownloadButton title={document.name} />
      </div>
      <ToolbarSeparator />
      <FontFamilyButton />
      <ToolbarSeparator />
      <FontSizeButton />
      <ToolbarSeparator />
      <div className="flex items-center gap-1">
        {sections[1]!.map((item) => (
          <ToolbarButton
            key={item.label}
            {...item}
          />
        ))}
        <TextColorButton />
        <HighlightColorButton />
      </div>
      <ToolbarSeparator />
      <div className="flex items-center gap-1">
        <LinkButton />
        <ImageButton />
        <TableButton />
        <AlignButton />
        <LineHeightButton />
        <ListButton />
        {sections[2]!.map((item) => (
          <ToolbarButton
            key={item.label}
            {...item}
          />
        ))}
      </div>
    </section>
  );
}
