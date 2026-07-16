import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';

import { useEditor } from '@/hooks/use-editor';

export function EditorAlign() {
  const { editor } = useEditor();

  const alignments = [
    {
      value: 'left',
      icon: AlignLeftIcon,
      label: 'Align Left',
      isActive: editor?.isActive({ textAlign: 'left' })
    },
    {
      value: 'center',
      icon: AlignCenterIcon,
      label: 'Align Center',
      isActive: editor?.isActive({ textAlign: 'center' })
    },
    {
      value: 'right',
      icon: AlignRightIcon,
      label: 'Align Right',
      isActive: editor?.isActive({ textAlign: 'right' })
    },
    {
      value: 'justify',
      icon: AlignJustifyIcon,
      label: 'Align Justify',
      isActive: editor?.isActive({ textAlign: 'justify' })
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer"
        >
          <AlignLeftIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col">
        {alignments.map(({ value, icon: Icon, label, isActive }) => (
          <Button
            key={value}
            variant={isActive ? 'secondary' : 'ghost'}
            onClick={() => editor?.chain().focus().setTextAlign(value).run()}
          >
            <Icon />
            {label}
          </Button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
