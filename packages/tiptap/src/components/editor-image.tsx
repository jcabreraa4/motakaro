import { useState } from 'react';

import { ImageIcon } from 'lucide-react';

import { useTiptap } from '@workspace/tiptap/hooks/use-tiptap';
import { Button } from '@workspace/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';
import { Input } from '@workspace/ui/components/input';

export function EditorImage() {
  const { tiptap } = useTiptap();

  const [value, setValue] = useState('');

  function handleValue() {
    if (!value.trim()) return;
    tiptap?.chain().focus().setImage({ src: value }).run();
    setValue('');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
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
        <Button onClick={handleValue}>Insert</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
