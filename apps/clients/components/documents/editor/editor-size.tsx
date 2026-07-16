import { useState } from 'react';

import { MinusIcon, PlusIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

import { useEditor } from '@/hooks/use-editor';

export function EditorSize() {
  const { editor } = useEditor();

  const [fontSize, setFontSize] = useState('16');
  const [inputValue, setInputValue] = useState(fontSize);
  const [isEditing, setIsEditing] = useState(false);

  const currentSize = editor?.getAttributes('textStyle').fontSize || '16px';

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
        size="icon"
        variant="ghost"
        onClick={decrement}
        className="cursor-pointer"
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
          className="h-7 w-10 rounded-sm border bg-transparent text-center text-sm focus:ring-0 focus:outline-none"
        />
      ) : (
        <Button
          variant="ghost"
          onClick={() => {
            setIsEditing(true);
            setFontSize(currentSize);
          }}
          className="w-10 cursor-text"
        >
          {currentSize}
        </Button>
      )}
      <Button
        size="icon"
        variant="ghost"
        onClick={increment}
        className="cursor-pointer"
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
