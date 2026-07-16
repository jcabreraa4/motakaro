import { useState } from 'react';

import { Link2Icon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';
import { Input } from '@workspace/ui/components/input';

import { useEditor } from '@/hooks/use-editor';

export function EditorLink() {
  const { editor } = useEditor();

  const [value, setValue] = useState('');

  function handleValue() {
    if (!value.trim()) return;
    editor?.chain().focus().extendMarkRange('link').setLink({ href: value }).run();
    setValue('');
  }

  return (
    <DropdownMenu onOpenChange={(open) => open && setValue(editor?.getAttributes('link').href || '')}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer"
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
