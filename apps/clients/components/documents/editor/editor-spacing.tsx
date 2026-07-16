import { ListCollapseIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';

import { useEditor } from '@/hooks/use-editor';

export function EditorSpacing() {
  const { editor } = useEditor();

  const heights = [
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

  const currentHeight = editor?.getAttributes('textStyle').lineHeight || '1.5';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer"
        >
          <ListCollapseIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col">
        {heights.map((height, index) => (
          <Button
            key={index}
            variant={currentHeight === height.value ? 'secondary' : 'ghost'}
            onClick={() => editor?.chain().focus().toggleTextStyle({ lineHeight: height.value }).run()}
            className="justify-start"
          >
            {height.label}
          </Button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
