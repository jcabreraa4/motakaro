import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';

import { UploadCloud } from 'lucide-react';

import { cn } from '@workspace/ui/lib/utils';

interface DropzoneProps {
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps;
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps;
  isDragActive: boolean;
}

export function Dropzone({ getRootProps, getInputProps, isDragActive }: DropzoneProps) {
  return (
    <div
      {...getRootProps({ role: 'button', tabIndex: 0 })}
      className={cn('flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center', isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300')}
    >
      <input
        {...getInputProps()}
        className="hidden"
        multiple={false}
      />
      <UploadCloud className="h-6 w-6 text-gray-500 dark:text-white/90" />
      <p className="text-sm text-gray-600 dark:text-white/90">Drag and drop, or click to select a file</p>
    </div>
  );
}
