import { PrinterIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

export function EditorPrint() {
  return (
    <Button
      size="icon"
      variant="ghost"
      className="cursor-pointer"
      onClick={() => window.print()}
    >
      <PrinterIcon />
    </Button>
  );
}
