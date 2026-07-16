import { useState } from 'react';

import { ImageIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';
import { Input } from '@workspace/ui/components/input';

import { useEditor } from '@/hooks/use-editor';

export function EditorImage() {
  const { editor } = useEditor();

  const [value, setValue] = useState('');

  function handleValue() {
    if (!value.trim()) return;
    editor?.chain().focus().setImage({ src: value }).run();
    setValue('');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer"
        >
          <ImageIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex w-fit gap-1">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://image.png"
        />
        <Button
          className="cursor-pointer"
          onClick={handleValue}
        >
          Insert
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
