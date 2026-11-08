import { useState } from 'react';

import { Link2Icon } from 'lucide-react';

import { useTiptap } from '@workspace/tiptap/hooks/use-tiptap';
import { Button } from '@workspace/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';
import { Input } from '@workspace/ui/components/input';

export function EditorLink() {
  const { tiptap } = useTiptap();

  const [value, setValue] = useState('');

  function handleValue() {
    if (!value.trim()) return;
    tiptap?.chain().focus().extendMarkRange('link').setLink({ href: value }).run();
    setValue('');
  }

  return (
    <DropdownMenu onOpenChange={(open) => open && setValue(tiptap?.getAttributes('link').href || '')}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
        >
          <Link2Icon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex w-fit gap-1">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://example.com"
        />
        <Button onClick={handleValue}>Insert</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
